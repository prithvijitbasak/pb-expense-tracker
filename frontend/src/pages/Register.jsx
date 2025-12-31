import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/Login.css";
import { useNavigate } from "react-router-dom";
import { API } from "../utils/auth";
import { toast } from "react-toastify";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { setIsLogin, fetchUser } = useAuth();

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
  const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

  const handleViewPassword = () => {
    if (viewPassword === false) setViewPassword(true);
    else setViewPassword(false);
  };

  const handleViewConfirmPassword = () => {
    if (viewConfirmPassword === false) setViewConfirmPassword(true);
    else setViewConfirmPassword(false);
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

        //  MUST include this for cookies to work
        credentials: "include",

        body: JSON.stringify(registeredUser),
      });

      const res_data = await response.json();

      if (response.ok) {
        //  token is stored in cookies, we do NOT store anything manually
        setIsLogin(true);

        // fetching the new user on context
        // line is extremely crucial to fetch the user on global context
        // otherwise after registration it wont redirect to the dashboard
        await fetchUser();

        // Reset form
        setRegisteredUser({
          fullName: "",
          username: "",
          email: "",
          phone: "",
          password: "",
        });

        toast.success("Registration successful");
        navigate(`/${res_data.username}`);
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
          <p className="mt-2 text-base text-gray-600">
            Enter your details below
          </p>
        </div>
        <p className="text-sm text-right my-2 italic text-red-600 font-medium pe-2 tracking-wide">
          All fields are required
        </p>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Fields */}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={registeredUser.fullName}
            onChange={handleInput}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out select-none border-theme-focus"
          />
          <div className="relative group">
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              value={registeredUser.username}
              onChange={handleInput}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out select-none border-theme-focus"
            />

            {/* Info Icon */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-help text-gray-400 hover:text-theme transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>

              {/* Tooltip Message */}
              <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 shadow-xl z-10">
                <ul className="list-disc pl-4 space-y-1">
                  <li>The username must have at least 3 characters</li>
                  <li>The username can only be up to 50 characters</li>
                  <li>
                    The username must be lowercase and contain only letters or
                    numbers
                  </li>
                </ul>
                {/* Small arrow for tooltip */}
                <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
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
          <div className="relative">
            <input
              type={viewConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={registeredUser.confirmPassword}
              onChange={handleInput}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out select-none pr-12 border-theme-focus ${
                registeredUser.confirmPassword &&
                registeredUser.password !== registeredUser.confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            <span
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer transition duration-150"
              onClick={handleViewConfirmPassword}
              aria-label={
                viewConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {viewConfirmPassword ? (
                <FaEyeSlash size={20} />
              ) : (
                <FaEye size={20} />
              )}
            </span>
          </div>
          <div></div>

          {/* Submit Button - Logic added for disabling and fading */}
          <button
            type="submit"
            disabled={
              !registeredUser.password ||
              registeredUser.password !== registeredUser.confirmPassword
            }
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white select-none transition duration-300 ease-in-out transform bg-theme border-theme-focus focus:outline-none focus:ring-2 focus:ring-offset-2 
          ${
            registeredUser.password &&
            registeredUser.password === registeredUser.confirmPassword
              ? "hover:scale-[1.01] cursor-pointer opacity-100"
              : "opacity-50 cursor-not-allowed"
          }`}
          >
            Sign Up
          </button>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center mt-2 p-2 bg-red-50 rounded-lg border border-red-200">
              {error}
            </p>
          )}

          {/* Login Link */}
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
