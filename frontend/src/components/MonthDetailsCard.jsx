import { Link } from "react-router-dom";
import "../assets/styles/DetailsCard.css";
import { useEffect, useState } from "react";
import { API } from "../utils/auth";

const MonthDetailsCard = () => {
  const [totalExpense, setTotalExpense] = useState(0);

  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const fetchTotalExpenseOfMonth = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${API}/api/expenses/get-expenses-by-month?month=${month}&year=${year}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTotalExpense(data.totalExpenses);
      }
    } catch (error) {
      console.log("Unable to fetch the expenses: ", error);
    }
  };

  useEffect(() => {
    fetchTotalExpenseOfMonth();
  });

  return (
    <div className="details-card">
      <h3 className="details-heading-text">This Month Expenses</h3>
      <p className="total-text">Total Expenses = {totalExpense}</p>
      <Link to={"/month-details"} className="details-btn">
        See Details
      </Link>
    </div>
  );
};

export default MonthDetailsCard;
