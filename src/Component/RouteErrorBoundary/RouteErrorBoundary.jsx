import { Link, useRouteError, isRouteErrorResponse } from "react-router";

const RouteErrorBoundary = () => {
  const error = useRouteError();
  const status = isRouteErrorResponse(error) ? error.status : 500;
  const message = isRouteErrorResponse(error)
    ? error.data || error.statusText || "Something went wrong."
    : "Unable to load data. Please try again.";

  return (
    <section className="mx-auto mt-10 max-w-2xl rounded-xl border border-red-200 bg-red-50 p-6 text-red-900 shadow-sm">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-3 text-sm">Status: {status}</p>
      <p className="mt-2">{message}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          to="/"
          className="rounded-md bg-red-700 px-4 py-2 text-white hover:bg-red-800"
        >
          Go Home
        </Link>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md border border-red-700 px-4 py-2 text-red-800 hover:bg-red-100"
        >
          Retry
        </button>
      </div>
    </section>
  );
};

export default RouteErrorBoundary;