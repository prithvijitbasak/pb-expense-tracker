import { useEffect, useState } from "react";
import "../assets/styles/DayDetails.css";
import { API } from "../utils/auth";
import { useSearchParams } from "react-router-dom";
import AllDetailsCard from "../components/AllDetailsCard";
import { formatDateTime } from "../utils/formatterFunctions";

const DayDetails = () => {
  const [expenses, setExpenses] = useState([]);
  // const [selectedDate, setSelectedDate] = useState("");
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date"); // Extract the date from query params

  useEffect(() => {
    fetchExpenses(date);
  }, [date]);

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
          <h2 className="heading-date heading-text font-bold tracking-wider text-2xl">
            Expenses of: {date || "No date selected"}
          </h2>
          <div className="expenses-card-container">
            {expenses.length > 0 ? (
              expenses.map((expense, index) => (
                <AllDetailsCard
                  key={index}
                  title={expense.title}
                  amount={expense.amount}
                  category={expense.category}
                  notes={expense.notes}
                  createdAt={formatDateTime(expense.createdAt)}
                  updatedAt={formatDateTime(expense.updatedAt)}
                />
              ))
            ) : (
              <p className="no-expense-text">
                No expenses found for this date.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayDetails;
