import { jwtDecode } from "jwt-decode";
const API = import.meta.env.VITE_APP_API_URI;

const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login"; // Redirect instead of reloading
};

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true;
  }
};

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  if (isTokenExpired(token)) {
    logout(); // Auto-logout if expired
    return false;
  }

  return true;
};

export { API, isAuthenticated, logout };
