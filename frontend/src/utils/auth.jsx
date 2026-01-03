import { jwtDecode } from "jwt-decode";
const API = import.meta.env.VITE_APP_API_URI;

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true;
  }
};

export { API };
