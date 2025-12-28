import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/styles/Login.css";
import { useNavigate } from "react-router-dom";
import { API } from "../utils/auth"; // Import the function
import { toast } from "react-toastify";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { setIsLogin, user, isLogin, fetchUser } = useAuth();

  const [loggedInUser, setLoggedInUser] = useState({
    identifier: "",
    password: "",
  });

  const [viewPassword, setViewPassword] = useState(false);

  const handleViewPassword = () => {
    if (viewPassword === false) setViewPassword(true);
    else setViewPassword(false);
  };

  const navigate = useNavigate();
  const URL = `${API}/api/auth/login`;

  // Redirect if already logged in
  useEffect(() => {
    if (isLogin && user?.username) {
      navigate(`/${user.username}`);
    }
  }, [isLogin, user, navigate]);

  const handleInput = (e) => {
    setLoggedInUser({
      ...loggedInUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Critical: Tell server you're sending JSON
        },
        credentials: "include",
        body: JSON.stringify(loggedInUser),
      });

      const res_data = await response.json();
      if (response.ok) {
        setLoggedInUser({ identifier: "", password: "" });
        setIsLogin(true);
        fetchUser();
        toast.success("Logged in successfully");
      } else {
        console.log("Invalid credentials");
        toast.error("Invalid credentials");
        setLoggedInUser({ identifier: "", password: "" });
      }
    } catch (error) {
      console.error("Login failed", error);
      console.log("server error");
      toast.error("Incorrect login format entered");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#4caf50] to-[#3e8e41] p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
        {/* Heading Section */}
        <div className="text-center mb-6">
          <h3 className="text-3xl font-bold text-white mb-2">Welcome Back!</h3>
          <p className="text-white/80 text-sm">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Identifier Field */}
          <div>
            <input
              type="text"
              name="identifier"
              placeholder="Email / Username / Phone"
              value={loggedInUser.identifier}
              onChange={handleInput}
              required
              className="w-full rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/70 focus:ring-2 focus:ring-[#81c784] focus:outline-none px-4 py-2 transition-all select-none"
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type={viewPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={loggedInUser.password}
              onChange={handleInput}
              required
              className="w-full rounded-lg border border-white/30 bg-white/20 text-white placeholder-white/70 focus:ring-2 focus:ring-[#81c784] focus:outline-none px-4 py-2 pr-10 transition-all select-none"
            />

            {viewPassword ? (
              <FaEyeSlash
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white cursor-pointer"
                onClick={handleViewPassword}
                size={18}
              />
            ) : (
              <FaEye
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white cursor-pointer"
                onClick={handleViewPassword}
                size={18}
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#4caf50] hover:bg-[#45a049] text-white font-semibold rounded-lg py-2 transition-all duration-300 shadow-md hover:shadow-[#4caf50]/40 select-none cursor-pointer"
          >
            Login
          </button>

          {/* Register Section */}
          <div className="text-center mt-4">
            <p className="text-white/80 text-sm">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-white font-medium hover:text-[#c8e6c9] transition-all"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
