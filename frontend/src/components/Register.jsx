import { useEffect, useState } from "react";
import "../assets/styles/Login.css";
import { useNavigate } from "react-router-dom";
import { API } from "../utils/auth"; // Import the function

const Register = () => {
  const [user, setUser] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const URL = `${API}/api/auth/register`;

  const handleInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user), // ✅ Fixed incorrect `userData`
      });

      const res_data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", res_data.token);
        setUser({
          fullName: "",
          username: "",
          email: "",
          phone: "",
          password: "",
        });
        console.log("Registration successful");
        navigate("/login");
      } else {
        console.error("Error response:", res_data); // ✅ Log error response
        setError(res_data.message || "Registration failed. Try again.");
      }
    } catch (error) {
      console.error("Registration failed", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-form-wrapper">
      <div className="container">
        <div className="login-form-contents">
          <h3>Create an account</h3>
          <p>Enter your details below</p>
          <form className="expense-login-form" onSubmit={handleSubmit}>
            <input type="text" name="fullName" placeholder="Full Name" value={user.fullName} onChange={handleInput} required />
            <input type="text" name="username" placeholder="Choose a username" value={user.username} onChange={handleInput} required />
            <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleInput} required />
            <input type="text" name="phone" placeholder="Phone" value={user.phone} onChange={handleInput} required />
            <input type="password" name="password" placeholder="Password" value={user.password} onChange={handleInput} required />
            <button type="submit" className="submit-btn">Sign Up</button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};


export default Register;
