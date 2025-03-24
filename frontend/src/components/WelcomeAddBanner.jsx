import "../assets/styles/WelcomeAddBanner.css";
import { Link } from "react-router-dom";
import { API } from "../utils/auth";
import { useEffect, useState } from "react";

const WelcomeAddBanner = () => {
  const [name, setName] = useState("Fetching name....");

  const fetchName = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setName(data.fullName);
      } else {
        console.log("Unable to fetch name");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchName();
  }, []);

  return (
    <div className="welcome-add-expense-banner">
      <div className="name-card">
        <p className="welcome-card-text">Welcome,</p>
        <h3 className="profile-name">{name}</h3>
      </div>
      <div className="add-expense-card">
        <p className="add-expense-card-text">Have spent money on something?</p>
        <p className="add-expense-card-text">Add your expenses below &darr;</p>
        <div className="add-expense-btn-div">
          <Link to={"/add-expense"} className="add-expense-btn">
            Add Expense
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAddBanner;
