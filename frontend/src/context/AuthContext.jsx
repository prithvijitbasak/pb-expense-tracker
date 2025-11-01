import { createContext, useEffect, useState, useContext } from "react";
import { API } from "../utils/auth";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLogin, setIsLogin] = useState(!!token);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      // If no token exists, stop loading immediately
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API}/api/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else if (response.status === 401) {
          // Handle expired/invalid token
          localStorage.removeItem("token");
          setToken(null);
          setIsLogin(false);
          setUser(null);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        // ✅ Stop loading in all cases (success or failure)
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        setIsLogin,
        user,
        setUser,
        token,
        setToken,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);
