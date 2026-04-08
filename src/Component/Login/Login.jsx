import { use, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contaxts/AuthContexts";

const Login = () => {
  const { user, loading, signInUser, signInWithGoogle, resetPassword } =
    use(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [from, navigate, user]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setFormError("Email and password are required.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);

    try {
      await signInUser(trimmedEmail, trimmedPassword);
      setSuccessMessage("Login successful.");
      navigate(from, { replace: true });
    } catch (error) {
      setFormError(error?.message || "Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setFormError("");
    setSuccessMessage("");

    try {
      await signInWithGoogle();
      setSuccessMessage("Login successful.");
      navigate(from, { replace: true });
    } catch (error) {
      setFormError(error?.message || "Google sign-in failed.");
    }
  };

  const handlePasswordReset = async () => {
    setFormError("");
    setSuccessMessage("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setFormError("Enter your email first to reset the password.");
      return;
    }

    try {
      await resetPassword(trimmedEmail);
      setSuccessMessage(`Password reset email sent to ${trimmedEmail}.`);
    } catch (error) {
      setFormError(error?.message || "Unable to send reset email.");
    }
  };

  if (user && !loading) {
    return <Navigate to={from} replace />;
  }

  return (
    <section className="min-h-[calc(100vh-72px)] bg-linear-to-br from-slate-50 via-white to-slate-100 px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-105 rounded-xl bg-white px-8 py-9 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">Login</h1>
          <p className="mt-2 text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-violet-500 hover:text-violet-600"
            >
              Register Now
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="smsowkothasan@gmail.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              className="input input-bordered w-full rounded-md border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={handlePasswordReset}
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Forgot password?
          </button>

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
            disabled={submitting || loading}
            className="btn w-full rounded-md border-0 bg-linear-to-r from-violet-600 to-violet-500 text-base font-semibold text-white shadow-none hover:from-violet-700 hover:to-violet-600 disabled:border-0 disabled:bg-violet-300"
          >
            {submitting || loading ? "Signing In..." : "Sign In"}
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
          type="button"
          onClick={handleGoogleLogin}
          disabled={submitting || loading}
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
            {submitting || loading ? "Signing In..." : "Sign In With Google"}
          </span>
        </button>
      </div>
    </section>
  );
};

export default Login;
