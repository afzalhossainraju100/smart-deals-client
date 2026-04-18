import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContexts";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../Firebase/firebase.init";

const googleProvider = new GoogleAuthProvider();
const LOCAL_CURRENT_USER_KEY = "smart-deals-client-current-user";
const LOCAL_USERS_KEY = "smart-deals-client-users";

const authDisabled = false;
const isFirebaseConfigured = true;
const authMessage = "";

const readLocalData = (key, fallbackValue) => {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
};

const writeLocalData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getStoredUsers = () => readLocalData(LOCAL_USERS_KEY, []);

const setStoredUsers = (users) => {
  writeLocalData(LOCAL_USERS_KEY, users);
};

const getStoredCurrentUser = () => readLocalData(LOCAL_CURRENT_USER_KEY, null);

const setStoredCurrentUser = (user) => {
  if (user) {
    writeLocalData(LOCAL_CURRENT_USER_KEY, user);
    return;
  }

  localStorage.removeItem(LOCAL_CURRENT_USER_KEY);
};

const toAuthUser = ({
  uid,
  displayName,
  email,
  photoURL,
  providerId = "password",
}) => ({
  uid: uid || email,
  displayName: displayName || email?.split("@")[0] || "User",
  email: email || "",
  photoURL: photoURL || "",
  providerId,
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = async (email, password, profile = {}) => {
    if (!isFirebaseConfigured) {
      const normalizedEmail = String(email || "")
        .trim()
        .toLowerCase();
      const normalizedPassword = String(password || "");

      if (!normalizedEmail || !normalizedPassword) {
        throw new Error("Email and password are required.");
      }

      const users = getStoredUsers();
      const existingUser = users.find(
        (storedUser) => storedUser.email === normalizedEmail,
      );

      if (existingUser) {
        throw new Error("An account with this email already exists.");
      }

      const newUser = toAuthUser({
        uid: normalizedEmail,
        email: normalizedEmail,
        displayName:
          profile.displayName || normalizedEmail.split("@")[0] || "User",
        photoURL: profile.photoURL || "",
      });

      const storedUser = {
        ...newUser,
        password: normalizedPassword,
      };

      setStoredUsers([...users, storedUser]);
      setStoredCurrentUser(newUser);
      setUser(newUser);

      return { user: newUser };
    }

    setLoading(true);

    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  const signInUser = (email, password) => {
    if (!isFirebaseConfigured) {
      const normalizedEmail = String(email || "")
        .trim()
        .toLowerCase();
      const normalizedPassword = String(password || "");
      const users = getStoredUsers();
      const matchedUser = users.find(
        (storedUser) =>
          storedUser.email === normalizedEmail &&
          storedUser.password === normalizedPassword,
      );

      if (!matchedUser) {
        throw new Error("Invalid email or password.");
      }

      const currentUser = toAuthUser(matchedUser);
      setStoredCurrentUser(currentUser);
      setUser(currentUser);

      return Promise.resolve({ user: currentUser });
    }

    setLoading(true);

    return signInWithEmailAndPassword(auth, email, password).finally(() => {
      setLoading(false);
    });
  };

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured) {
      throw new Error(
        "Google sign-in requires real Firebase configuration. Add your Firebase Web App values to .env.local, enable Google sign-in in Firebase, and restart Vite.",
      );
    }

    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;

      if (accessToken) {
        console.log("Firebase Google access token:", accessToken);
      }

      return result;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    if (!isFirebaseConfigured) {
      setStoredCurrentUser(null);
      setUser(null);
      return Promise.resolve();
    }

    setLoading(true);

    try {
      return await signOut(auth);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    if (!isFirebaseConfigured) {
      const normalizedEmail = String(email || "")
        .trim()
        .toLowerCase();

      if (!normalizedEmail) {
        return Promise.reject(
          new Error("Enter your email first to reset the password."),
        );
      }

      const users = getStoredUsers();
      const matchedUser = users.find(
        (storedUser) => storedUser.email === normalizedEmail,
      );

      if (!matchedUser) {
        return Promise.reject(
          new Error("No local account found for that email."),
        );
      }

      return Promise.resolve({ email: normalizedEmail });
    }

    setLoading(true);

    try {
      return await sendPasswordResetEmail(auth, email);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isFirebaseConfigured) {
      const storedCurrentUser = getStoredCurrentUser();

      if (storedCurrentUser?.providerId === "google.com") {
        const sanitizedUsers = getStoredUsers().filter(
          (storedUser) => storedUser.providerId !== "google.com",
        );

        setStoredUsers(sanitizedUsers);
        setStoredCurrentUser(null);
        setUser(null);
        setLoading(false);
        return undefined;
      }

      setUser(storedCurrentUser);
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const loggedUser = { email: currentUser.email, uid: currentUser.uid };

        const syncAccessToken = async () => {
          try {
            const response = await fetch(
              "https://smart-deals-server-flame.vercel.app/getToken",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(loggedUser),
              },
            );

            if (!response.ok) {
              throw new Error("Failed to get access token from backend.");
            }

            const data = await response.json();
            const firebaseToken = await currentUser.getIdToken();
            const accessToken =
              data?.token ||
              data?.accessToken ||
              data?.idToken ||
              firebaseToken;

            if (accessToken) {
              localStorage.setItem("smart-deals-access-token", accessToken);
            } else {
              localStorage.removeItem("smart-deals-access-token");
            }
          } catch (error) {
            console.error("Unable to sync access token:", error);
            localStorage.removeItem("smart-deals-access-token");
          }
        };

        syncAccessToken();
      } else {
        localStorage.removeItem("smart-deals-access-token");
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // const signInWithGoogle = async () =>
  //   Promise.reject(new Error(AUTH_DISABLED_ERROR));

  // const signOutUser = async () => Promise.resolve();

  // const resetPassword = async () =>
  //   Promise.reject(new Error(AUTH_DISABLED_ERROR));

  const authInfo = {
    user,
    loading,
    createUser,
    signInUser,
    signInWithGoogle,
    signOutUser,
    resetPassword,
    authDisabled,
    authMessage,
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
