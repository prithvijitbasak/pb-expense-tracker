import { useState, useEffect } from "react";
import { API } from "../utils/auth";
import "../assets/styles/Profile.css";

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
          <h2 className="profile-heading">My Profile</h2>
            {user ? (
              <>
                <p className="profile-data"><span className="bold-font">Full name</span> - {user.fullName}</p>
                <p className="profile-data"><span className="bold-font">Username</span> - {user.username}</p>
                <p className="profile-data"><span className="bold-font">Email</span> - {user.email}</p>
                <p className="profile-data"><span className="bold-font">Phone</span> - {user.phone}</p>
                <p className="profile-data"><span className="bold-font">Are you an admin</span> - {user.isAdmin ? "Yes" : "No"}</p>
              </>
            ) : (
              <p className="fetching-text">Loading user data...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
