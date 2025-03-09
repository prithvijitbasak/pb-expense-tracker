export const isAuthenticated = () => {
    const token = localStorage.getItem("token"); // Check if token exists
    return !!token; // Convert token existence to boolean (true if logged in)
  };
  