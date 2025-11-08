import { Navigate, Outlet, useParams } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }

  const { username } = useParams();
  const { user } = useAuth(); // you should have stored username when logging in

  // ✅ If the URL username doesn't match the logged-in user's username
  if (username && username !== user.username) {
    return <Navigate to="/404-error" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
