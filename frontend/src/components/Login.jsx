import { useEffect, useState } from "react";
import "../assets/styles/Login.css";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth"; // Import the function

const Login = () => {
  const [user, setUser] = useState({
    identifier: "",
    password: "",
  });

  const API = import.meta.env.VITE_APP_API_URI;
  const navigate = useNavigate();
  const URL = `${API}/api/auth/login`;

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/"); // Redirect to home if user is already logged in
    }
  }, [navigate]);

  const handleInput = (e) => {
    setUser({
      ...user,
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
        body: JSON.stringify(user),
      });

      const res_data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", res_data.token); // Store token in localStorage
        setUser({ identifier: "", password: "" });
        navigate("/"); // Redirect to home
      } else {
        console.log("Invalid credentials");
        setUser({ identifier: "", password: "" });
      }
    } catch (error) {
      console.error("Login failed", error);
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
              value={user.identifier}
              onChange={handleInput}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleInput}
              required
            />
            <button type="submit" className="submit-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
