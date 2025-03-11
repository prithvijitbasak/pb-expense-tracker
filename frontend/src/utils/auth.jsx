const API = import.meta.env.VITE_APP_API_URI; // Export API URL

const isAuthenticated = () => {
    const token = localStorage.getItem("token"); // Check if token exists
    return !!token; // Convert token existence to boolean (true if logged in)
  };

  // Logout function to remove the token and reload the page
 const logout = () => {
  localStorage.removeItem("token"); // Remove token from localStorage
  window.location.reload(); // Reload page to reflect logout
};
  

  export {API, isAuthenticated, logout};