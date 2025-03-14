import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import AddExpenseDetailsPopUp from "../components/AddExpenseDetailsPopUp";
import "../assets/styles/Dashboard.css";
import { logout } from "../utils/auth";

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
                <p>Profile</p>
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

          <section className="add-expenses">
            <p>Spent money on something!!</p>
            <Link
              to="/add-expense-pop-up-details"
              onClick={handleAddExpenseClick}
            >
              <button>Add Expense</button>
            </Link>
          </section>

          {showAddExpense && (
            <AddExpenseDetailsPopUp onClose={handleCloseAddExpense} />
          )}

          <section className="info-section">
            <div className="day-expenses">
              <h2>This day expenses</h2>
              <p>Total = {}</p>
              <button>See Details</button>
            </div>
            <div className="month-expenses">
              <h2>This month expenses</h2>
              <p>Total = {}</p>
              <button>See Details</button>
            </div>
            <div className="year-expenses">
              <h2>This year expenses</h2>
              <p>Total = {}</p>
              <Link to="/year-details">
                <button>See Details</button>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
