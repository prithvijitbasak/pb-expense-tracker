import { Navigate, Outlet, useParams, useLocation } from "react-router-dom";
// import { isAuthenticated } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {

  const { username } = useParams();
  const { user, loading } = useAuth();
  const location = useLocation();

  // console.log("showing the username from useParams");
  // console.log(username);

  // 1. While the /status API is pending, show nothing or a spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 2. If the API finished and there is no user, redirect to login
  if (!user) {
    // We save the current location so we can redirect them back after they login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ If the URL username doesn't match the logged-in user's username
  if (username && username !== user.username) {
    return <Navigate to="/404-error" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
