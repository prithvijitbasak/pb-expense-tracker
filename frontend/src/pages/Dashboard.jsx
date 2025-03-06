import { Link } from "react-router-dom";
import { useState } from "react";
import AddExpenseDetailsPopUp from "../components/AddExpenseDetailsPopUp";
import "../assets/styles/Dashboard.css"

const Dashboard = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);

  const handleAddExpenseClick = () => {
    setShowAddExpense(true);
  };

  const handleCloseAddExpense = () => {
    setShowAddExpense(false);
  };



  return (
    <>
      <div className="dashboard">
        <div className="container">
          <div className="user-logo-div">
            <span className="user-logo-span"><img src="\images\account.png" alt="" /></span>
          </div>
          <header className="dashboard-header">
            <div className="dashboard-header-wrapper">
              <h1>Expense Tracker</h1>
              <h2>Track your day to day expenses</h2>
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

          {showAddExpense && <AddExpenseDetailsPopUp onClose={handleCloseAddExpense} />}

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
