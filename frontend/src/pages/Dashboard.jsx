import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import AddExpense from "../components/AddExpense";
import "../assets/styles/Dashboard.css";
import { logout } from "../utils/auth";
import DayDetailsCard from "../components/DayDetailsCard";
import MonthDetailsCard from "../components/MonthDetailsCard";
import YearDetailsCard from "../components/YearDetailsCard";
import WelcomeAddBanner from "../components/WelcomeAddBanner";
import SearchBoxSection from "../components/SearchBoxSection";

const Dashboard = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [isUserImgClicked, setIsUserImgClicked] = useState(false);

  // Refs for tracking the dropdown and button
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleAddExpenseClick = () => {
    setShowAddExpense(true);
  };

  const handleCloseAddExpense = () => {
    setShowAddExpense(false);
  };

  const handleUserImgClicked = () => {
    setIsUserImgClicked((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is outside both dropdown and button, close dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsUserImgClicked(false);
      }
    };

    if (isUserImgClicked) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserImgClicked]);

  return (
    <>
      <div className="dashboard">
        <div className="container">
          <div className="user-logo-div">
            {/* Assign the ref to button */}
            <span
              className="user-logo-span"
              ref={buttonRef}
              onClick={handleUserImgClicked}
            >
              <img src="/images/account.png" alt="" />
            </span>
            {isUserImgClicked && (
              <div className="user-dropdown" ref={dropdownRef}>
                <p>
                  <Link to="/profile">Profile</Link>
                </p>
                <p
                  onClick={() => {
                    logout();
                  }}
                >
                  Logout
                </p>
              </div>
            )}
          </div>
          <header className="dashboard-header">
            <div className="dashboard-header-wrapper">
              <h1>Expense Tracker</h1>
              <h2>Track your day-to-day expenses</h2>
            </div>
          </header>

          <WelcomeAddBanner />

          {showAddExpense && <AddExpense onClose={handleCloseAddExpense} />}

          <div className="info-section">
            <DayDetailsCard />
            <MonthDetailsCard />
            <YearDetailsCard />
          </div>
          <SearchBoxSection />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
