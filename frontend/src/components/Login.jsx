import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../assets/styles/Login.css";
import { useNavigate } from "react-router-dom";
import { API, isAuthenticated } from "../utils/auth"; // Import the function
import { toast } from "react-toastify";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { setToken, setIsLogin, user } = useAuth();

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
    if (isAuthenticated()) {
      navigate(`/${res_data.username}`); // Redirect to home if user is already logged in
    }
  }, [navigate]);

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
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loggedInUser),
      });

      const res_data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", res_data.token); // Store token in localStorage
        setLoggedInUser({ identifier: "", password: "" });
        navigate(`/${res_data.username}`); // Redirect to home
        setToken(res_data.token);
        setIsLogin(true);
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
    <div className="login-form-wrapper">
      <div className="container">
        <div className="login-form-contents">
          <h3>Are you already a previous user?</h3>
          <p>Enter your details below</p>
          <form className="expense-login-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="identifier"
              placeholder="Email/Username/Phone"
              value={loggedInUser.identifier}
              onChange={handleInput}
              required
              className="select-none"
            />
            <div className="relative">
              <input
                type={viewPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={loggedInUser.password}
                onChange={handleInput}
                required
                className="select-none"
              />
              {viewPassword ? (
                <FaEye
                  className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={handleViewPassword}
                />
              ) : (
                <FaEyeSlash
                  className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={handleViewPassword}
                />
              )}
            </div>
            <button type="submit" className="submit-btn select-none">
              Login
            </button>
            <div className="signup-div">
              <p className="signup-text">
                Don&apos;t have an account? <br />
                <Link to="/register" className="signup-link">
                  {" "}
                  Register
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
