import { useRouteError, Link } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError(); // captures the route error object (if any)
    console.error(error);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full">
        {/* Main 404 Heading */}
        <h1 className="text-8xl font-extrabold text-[#4caf50] mb-4">404</h1>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Oops! Page not found.
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          {error?.statusText ||
            error?.message ||
            "The page you’re looking for doesn’t exist or was moved."}
        </p>

        {/* Go Home Button */}
        <Link
          to="/"
          className="inline-block bg-[#4caf50] text-white font-medium py-2 px-6 rounded-full transition-transform transform hover:scale-105 hover:shadow-lg"
        >
          Go Home
        </Link>
      </div>

      <p className="mt-8 text-gray-500 text-sm">
        © {new Date().getFullYear()} | Expense Tracker
      </p>
    </div>
  );
};

export default ErrorPage;
