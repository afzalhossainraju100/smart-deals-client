import { use, useState } from "react";
import { Link } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { AuthContext } from "../../Contaxts/AuthContexts";

const USERS_API_URL = "http://localhost:3000/users";

const Register = () => {
  const { createUser, signInWithGoogle } = use(AuthContext);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const saveUserToBackend = async (user) => {
    const newUser = {
      name: user.displayName || user.email?.split("@")[0] || "User",
      email: user.email,
      image: user.photoURL || "",
    };

    try {
      const response = await fetch(USERS_API_URL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("User account created, but profile sync failed.");
      }

      return response.json();
    } catch {
      return null;
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "")
      .trim()
      .toLowerCase();
    const image = String(formData.get("image") || "").trim();
    const password = String(formData.get("password") || "").trim();

    if (!name || !email || !password) {
      setFormError("Name, email, and password are required.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const credential = await createUser(email, password);

      await updateProfile(credential.user, {
        displayName: name,
        photoURL: image || null,
      });

      await saveUserToBackend({
        displayName: name,
        email,
        photoURL: image,
      });

      setSuccessMessage("Account created successfully.");
      form.reset();
    } catch (error) {
      setFormError(error?.message || "Unable to create account.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError("");
    setSuccessMessage("");
    setSubmitting(true);

    try {
      const result = await signInWithGoogle();
      await saveUserToBackend(result.user);
      setSuccessMessage("Account created successfully.");
    } catch (error) {
      setFormError(error?.message || "Google Sign-In Error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-linear-to-br from-slate-50 via-white to-slate-100 px-4 py-10">
      <div className="w-full max-w-105 rounded-xl bg-white px-8 py-9 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">Register Now!</h1>
          <p className="mt-2 text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-violet-500 hover:text-violet-600"
            >
              Login Now
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Mariam Swarna"
              required
              className="input input-bordered w-full rounded-md border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="smsowkothasan@gmail.com"
              required
              className="input input-bordered w-full rounded-md border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Image-URL
            </label>
            <input
              type="url"
              name="image"
              placeholder="https://example.com/photo.jpg"
              className="input input-bordered w-full rounded-md border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="************"
              required
              minLength={6}
              className="input input-bordered w-full rounded-md border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none"
            />
          </div>

          {(formError || successMessage) && (
            <p
              className={`rounded-md px-3 py-2 text-sm ${
                formError
                  ? "bg-rose-50 text-rose-600"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {formError || successMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn w-full rounded-md border-0 bg-linear-to-r from-violet-600 to-violet-500 text-base font-semibold text-white shadow-none hover:from-violet-700 hover:to-violet-600"
          >
            {submitting ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          <span className="text-sm font-semibold tracking-wide text-slate-700">
            OR
          </span>
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          type="button"
          disabled={submitting}
          className="btn w-full rounded-md border border-slate-200 bg-white text-slate-700 shadow-none hover:bg-slate-50"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path
              fill="#FFC107"
              d="M43.611 20.083H42V20H24v8h11.303C33.654 32.659 29.285 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C35.033 6.053 29.932 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
            />
            <path
              fill="#FF3D00"
              d="M6.306 14.691l6.571 4.819C14.655 15.108 19 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C35.033 6.053 29.932 4 24 4c-8.837 0-16.485 4.989-20.338 12.309z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5.869 0 10.883-2.002 14.59-5.432l-6.742-5.693C29.809 34.591 27.053 36 24 36c-5.262 0-9.614-3.319-11.286-7.946l-6.522 5.025C9.991 39.55 16.227 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.611 20.083H42V20H24v8h11.303c-1.01 2.916-3.002 5.315-5.455 6.875l.004-.003 6.742 5.693C36.116 39.706 44 33.333 44 24c0-1.341-.138-2.65-.389-3.917z"
            />
          </svg>
          <span className="font-semibold normal-case">
            {submitting ? "Signing Up..." : "Sign Up With Google"}
          </span>
        </button>
      </div>
    </section>
  );
};

export default Register;
