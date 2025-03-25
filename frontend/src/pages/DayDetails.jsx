import { useEffect, useState } from "react";
import "../assets/styles/DayDetails.css";
import { API } from "../utils/auth";

const DayDetails = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${today.getFullYear()}`;

    setSelectedDate(formattedDate);
    fetchExpenses(formattedDate);
  }, []);

  const fetchExpenses = async (date) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API}/api/expenses/get-expenses-by-date?date=${date}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setExpenses(data.expenses || []);
      } else {
        console.log("Unable to fetch the expenses");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="day-details-wrapper">
      <div className="container">
        <div className="day-details-contents">
          <h2 className="date">Date - {selectedDate}</h2>
          {expenses.length > 0 ? (
            expenses.map((expense, index) => (
              <div className="expense-card" key={index}>
                <p className="title">Title - {expense.title}</p>
                <p className="price">Price - {expense.amount}</p>
              </div>
            ))
          ) : (
            <p>No expenses found for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayDetails;
