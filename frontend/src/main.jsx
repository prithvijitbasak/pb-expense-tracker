import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import { AuthProvider } from "./store/auth.jsx";
// import { ToastContainer, Bounce } from "react-toastify"; // Ensure Bounce is imported
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <div>testing</div> */}
    <App />
    {/* <ToastContainer/> */}
  </React.StrictMode>
);
