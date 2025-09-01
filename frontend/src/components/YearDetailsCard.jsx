import { Link } from "react-router-dom";
import "../assets/styles/DetailsCard.css";
import { API } from "../utils/auth";
import { useEffect, useState } from "react";

const YearDetailsCard = () => {
  const [totalExpense, setTotalExpense] = useState(null);

  const currentYear = new Date().getFullYear();
  useEffect(() => {
    const fetchTotalYearExpense = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${API}/api/expenses/get-expenses-by-year?year=${currentYear}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const totalExpenses = data.totalExpenses;
          setTotalExpense(totalExpenses);
          // console.log(totalExpenses);
        }
      } catch (error) {
        console.error("The error is: ", error);
      }
    };

    fetchTotalYearExpense();
  }, [currentYear]);

  return (
    <div className="details-card">
      <h3 className="details-heading-text">This Year Expenses</h3>
      <p className="total-text">Total Expenses = {totalExpense}</p>
      <Link to={`/year-details?year=${currentYear}`} className="details-btn">
        See Details
      </Link>
    </div>
  );
};

export default YearDetailsCard;
