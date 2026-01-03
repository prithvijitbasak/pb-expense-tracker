import { createContext, useContext, useState, useEffect } from "react";
import { API } from "../utils/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  const fetchUser = async () => {
    try {
      // as the cookies are HTTP-only so it will
      // automatically passed onto the request if CORS allows it
      const res = await fetch(`${API}/api/users/me`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        setUser(data);
        setIsLogin(true);
      } else {
        setUser(null);
        setIsLogin(false);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
      setIsLogin(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(`${API}/api/auth/logout`, {
        method: "POST", 
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Logout failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // These will run regardless of whether the network request succeeded
      setUser(null);
      window.location.href = "/";
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); // will run only on the initial render

  const contextValue = {
    user,
    setUser,
    isLogin,
    setIsLogin,
    loading,
    fetchUser,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
