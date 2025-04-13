import { useEffect, useState } from "react";
import { API } from "../utils/auth";
import AllDetailsCard from "../components/AllDetailsCard";
import { useSearchParams } from "react-router-dom";
import "../assets/styles/MonthDetails.css";
import UpdateExpenseModal from "../components/UpdateExpenseModal";

const MonthDetails = () => {
  const [expenses, setExpenses] = useState([]);
  const [searchParams] = useSearchParams();
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const [openModal, setOpenModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // console.log("Fetching expenses for:", month, year);

  const fetchExpenses = async (month, year) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in local storage!");
        return;
      }

      const url = `${API}/api/expenses/get-expenses-by-month?month=${month}&year=${year}`;
      // console.log("API URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseText = await response.text();
      // console.log("Response Status:", response.status);
      // console.log("Response Body:", responseText);

      if (response.ok) {
        const data = JSON.parse(responseText); // ✅ Parse JSON correctly
        // console.log("Expenses Data:", data.expenses);
        setExpenses(data.expenses); // ✅ Extract `expenses` array from response
      } else {
        console.error("Error fetching expenses:", responseText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const handleEditClicked = (expense) => {
    setSelectedExpense(expense);
    setOpenModal(true);
  };

  useEffect(() => {
    if (month && year) {
      fetchExpenses(month, year);
    }
  }, [month, year]); // ✅ Only fetch when `month` or `year` changes

  return (
    <div className="month-details-wrapper">
      <div className="container">
        <div className="month-details-container">
          <h2 className="heading-text font-bold tracking-wider text-2xl">
            All the expenses of month: {month}, {year}
          </h2>

          <div className="expenses-card-container">
            {expenses.length > 0 ? (
              expenses.map((expense, index) => (
                <AllDetailsCard
                  key={index}
                  index={index}
                  expense={expense}
                  checkIsEditClicked={handleEditClicked}
                />
              ))
            ) : (
              <p className="no-expense-text">
                No expenses found for the selected month.
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Edit Modal */}
      {openModal && selectedExpense && (
        <UpdateExpenseModal
          expenseData={selectedExpense}
          onClose={() => {
            setOpenModal(false);
            setSelectedExpense(null);
          }}
          onUpdated={() => fetchExpenses(month, year)}
        />
      )}
    </div>
  );
};

export default MonthDetails;
