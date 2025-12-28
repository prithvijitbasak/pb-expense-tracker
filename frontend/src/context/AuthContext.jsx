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
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
