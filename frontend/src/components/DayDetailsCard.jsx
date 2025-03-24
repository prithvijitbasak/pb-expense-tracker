import { Link } from "react-router-dom";
import "../assets/styles/DetailsCard.css";
import { useEffect, useState } from "react";
import { API } from "../utils/auth";

const DayDetailsCard = () => {
  const [totalExpenses, setTotalExpenses] = useState(0);

  const fetchTotalExpense = async () => {
    const token = localStorage.getItem("token");

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${today.getFullYear()}`;

    try {
      const response = await fetch(
        `${API}/api/expenses/get-expenses-by-date?date=${formattedDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setTotalExpenses(data.totalExpenses);
      } else {
        console.log("Cannot fetch the expenses");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTotalExpense();
  }, []);

  return (
    <div className="details-card">
      <h3 className="details-heading-text">Today's Expenses</h3>
      <p className="total-text">Total Expenses = {totalExpenses}</p>
      <Link to={"/day-details"} className="details-btn">
        See Details
      </Link>
    </div>
  );
};

export default DayDetailsCard;
