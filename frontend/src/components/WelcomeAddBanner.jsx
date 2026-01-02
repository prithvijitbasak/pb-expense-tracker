import "../assets/styles/WelcomeAddBanner.css";
import { Link } from "react-router-dom";
import { ShimmerBar } from "./ShimmerUI";
import { useAuth } from "../context/AuthContext";

const WelcomeAddBanner = () => {
  const { user } = useAuth();
  
  return (
    <div className="welcome-add-expense-banner">
      <div className="name-card">
        <p className="welcome-card-text">Welcome,</p>
        <h3 className="profile-name">{!user?.fullName ? <ShimmerBar /> : user?.fullName}</h3>
      </div>
      <div className="add-expense-card">
        <p className="add-expense-card-text">Have spent money on something?</p>
        <p className="add-expense-card-text">Add your expenses below &darr;</p>
        <div className="add-expense-btn-div">
          <Link
            to={`/${user.username}/add-expense`}
            className="add-expense-btn"
          >
            Add Expense
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeAddBanner;
