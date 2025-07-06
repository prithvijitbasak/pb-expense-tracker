import { useEffect, useState } from "react";
import { API } from "../utils/auth";
import AllDetailsCard from "../components/AllDetailsCard";
import { useSearchParams } from "react-router-dom";
import "../assets/styles/MonthDetails.css";
import UpdateExpenseModal from "../components/UpdateExpenseModal";
import DeleteConfirmBox from "../components/DeleteConfirmBox";
import monthData from "../data/monthData.json";
import useTotalExpense from "../hooks/useTotalExpense";

const MonthDetails = () => {
  const [expenses, setExpenses] = useState([]);
  const [searchParams] = useSearchParams();
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const [openModal, setOpenModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openDelConfirm, setOpenDelConfirm] = useState(false);

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

  const handleDelClicked = (expense) => {
    setSelectedExpense(expense);
    setOpenDelConfirm(true);
  };

  useEffect(() => {
    if (month && year) {
      fetchExpenses(month, year);
    }
  }, [month, year]); // ✅ Only fetch when `month` or `year` changes

  const { total, loading, error } = useTotalExpense("month", {
    month: `${month}`,
    year: `${year}`,
  });

  return (
    <div className="month-details-wrapper mb-10">
      <div className="container">
        <div className="month-details-container">
          <h2 className="heading-text font-bold tracking-wider text-2xl">
            All the expenses of month: {monthData[month]}, {year}
          </h2>

          <h4 className="font-bold text-right pb-3 pr-9">
            Total ={" "}
            {loading
              ? "Loading total expense..."
              : error
              ? "Error fetching total"
              : `${total}`}
          </h4>

          <div className="expenses-card-container">
            {expenses.length > 0 ? (
              expenses.map((expense, index) => (
                <AllDetailsCard
                  key={index}
                  index={index}
                  expense={expense}
                  checkIsEditClicked={handleEditClicked}
                  checkIsDelClicked={handleDelClicked}
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

      {/* Delete confirm box */}
      {openDelConfirm && selectedExpense && (
        <DeleteConfirmBox
          expenseData={selectedExpense}
          onClose={() => {
            setOpenDelConfirm(true);
            setSelectedExpense(null);
          }}
          onDeleted={() => fetchExpenses(month, year)}
        />
      )}
    </div>
  );
};

export default MonthDetails;
