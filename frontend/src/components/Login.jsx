import { useState } from "react";
import "../assets/styles/Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({
    identifier: "", // Can be email, phone, or username
    password: "",
  });

  const API = import.meta.env.VITE_APP_API_URI;

  const navigate = useNavigate();
  const URL = `${API}/api/auth/login`;

  const handleInput = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        identifier: user.identifier, // Accepts email, phone, or username
        password: user.password,
      };

      const response = await fetch(`${URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log("Login form", response);

      const res_data = await response.json();
      if (response.ok) {
        console.log("Response from server", res_data);

        console.log("Login successful");
        setUser({ identifier: "", password: "" });
        navigate("/");
      } else {
        console.log("Invalid credentials");
        setUser({ identifier: "", password: "" });
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <>
      <div className="login-form-wrapper">
        <div className="container">
          <div className="login-form-contents">
            <h3>Are you already a previous user?</h3>
            <p>Enter your details below</p>
            <form action="" className="expense-login-form" onSubmit={handleSubmit}>
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
    </>
  );
};

export default Login;
