import { useState, useEffect } from "react";
import { API } from "../utils/auth";

const Profile = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          console.error("No token found, please log in.");
          return;
        }

        const response = await fetch(`${API}/api/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Add Bearer prefix
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token]);

  return (
    <>
      <div className="profile-wrapper">
        <div className="container">
          <div className="profile-contents">
            {user ? (
              <>
                <p>Name - {user.fullName}</p>
                <p>Email - {user.email}</p>
                <p>Username - {user.username}</p>
                <p>Phone - {user.phone}</p>
                <p>Are you an admin - {user.isAdmin ? "Yes" : "No"}</p>
              </>
            ) : (
              <p>Loading user data...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
