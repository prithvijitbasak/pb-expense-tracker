import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Login.css";
import { useNavigate } from "react-router-dom";
import { API } from "../utils/auth"; // Import the function
import { toast } from "react-toastify";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { setToken, setIsLogin, user } = useAuth();

  const [registeredUser, setRegisteredUser] = useState({
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
    setRegisteredUser({ ...registeredUser, [e.target.name]: e.target.value });
  };

  const [viewPassword, setViewPassword] = useState(false);

  const handleViewPassword = () => {
    if (viewPassword === false) setViewPassword(true);
    else setViewPassword(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  console.log(registeredUser);

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      // ⭐ MUST include this for cookies to work
      credentials: "include",

      body: JSON.stringify(registeredUser),
    });

    const res_data = await response.json();

    if (response.ok) {
      // ⭐ Since token is stored in cookies, we do NOT store anything manually
      setIsLogin(true);
      setToken("logged-in"); // optional flag, you may remove if not needed

      // Reset form
      setRegisteredUser({
        fullName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
      });

      toast.success("Registration successful");
      navigate("/");
    } else {
      console.error("Error response:", res_data);
      setError(res_data.message || "Registration failed. Try again.");
      toast.error(res_data.message);
    }
  } catch (error) {
    console.error("Registration failed", error);
    setError("Something went wrong. Please try again.");
    toast.error("Something went wrong. Please try again.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gray-50">
      {/* Form Container */}
      <div className="w-full max-w-md bg-white shadow-xl rounded-lg p-8 sm:p-10 border border-gray-200">
        
        {/* Form Header */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-extrabold text-gray-900">
            Create an account
          </h3>
          <p className="mt-2 text-base text-gray-600">Enter your details below</p>
        </div>
        <p className="text-sm text-right my-2 italic text-red-600 font-medium pe-2 tracking-wide">All fields are required</p>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Input Fields - using border-theme-focus for custom focus rings */}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={registeredUser.fullName}
            onChange={handleInput}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out select-none border-theme-focus"
          />
          <input
            type="text"
            name="username"
            placeholder="Choose a username"
            value={registeredUser.username}
            onChange={handleInput}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out select-none border-theme-focus"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={registeredUser.email}
            onChange={handleInput}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out select-none border-theme-focus"
          />
          <input
            type="tel" 
            name="phone"
            placeholder="Phone"
            value={registeredUser.phone}
            onChange={handleInput}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out select-none border-theme-focus"
          />

          {/* Password Input with Toggle */}
          <div className="relative">
            <input
              type={viewPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={registeredUser.password}
              onChange={handleInput}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out select-none pr-12 border-theme-focus" 
            />
            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition duration-150"
              onClick={handleViewPassword}
              aria-label={viewPassword ? "Hide password" : "Show password"}
            >
              {viewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
          </div>
          {/* Confirming the password */}
          {/* <div className="relative">
            <input
              type={viewPassword ? "text" : "password"}
              name="password"
              placeholder="Confirm password"
              value={registeredUser.password}
              onChange={handleInput}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out select-none pr-12 border-theme-focus" 
            />
            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition duration-150"
              onClick={handleViewPassword}
              aria-label={viewPassword ? "Hide password" : "Show password"}
            >
              {viewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
          </div> */}

          {/* Submit Button - using bg-theme for custom background color */}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white select-none transition duration-300 ease-in-out transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 bg-theme border-theme-focus cursor-pointer"
          >
            Sign Up
          </button>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
              {error}
            </p>
          )}

          {/* Login Link - using text-theme for custom link color */}
          <div className="text-center pt-4 border-t mt-5 border-gray-100">
            <p className="text-sm text-gray-600">
              Are you having an account? <br className="sm:hidden" />
              <Link
                to="/login"
                className="font-medium hover:underline transition duration-150 text-theme" 
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
