import { useState } from "react";
import "../assets/styles/Login.css"
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../store/auth";
// import { toast } from "react-toastify";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  // const navigate = useNavigate();
  // const { storeTokenInLS, API } = useAuth();

  const API = import.meta.env.VITE_APP_API_URI;

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
        identifier: user.email, // Use 'email' as the identifier
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
        // storeTokenInLS(res_data.token);
        // toast.success("Login successful");
        console.log("Login successful");
        setUser({ email: "", password: "" });
        // navigate("/");
      } else {
        // toast.error(
        //   res_data.extraDetails ? res_data.extraDetails : res_data.message
        // );
        console.log("Invalid credentials");
        setUser({ email: "", password: "" });
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const requestData = {
  //       identifier: user.email, // Use 'email' as the identifier
  //       password: user.password,
  //     };

  //     console.log("Request Data:", requestData);

  //     const response = await fetch(`${URL}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(requestData),
  //     });

  //     const res_data = await response.json();
  //     console.log("Response Data:", res_data);
  //   } catch (error) {
  //     console.error("Login failed:", error);
  //   }
  // };

  return (
    <>
      <div className="login-form-wrapper">
        <div className="container">
          <div className="login-form-contents">
            <h3>Are you already a previous user?</h3>
            <p>Enter you details below</p>
            <form action="" className="expense-login-form">
              <input
                type="text"
                placeholder="Enter your email/username/phone number"
              />
              <input type="text" placeholder="Password" />
              <button type="submit" className="submit-btn">Login</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
