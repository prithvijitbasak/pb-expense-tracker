import { useEffect, useState } from "react";
import "../assets/styles/DayDetails.css";
import { API } from "../utils/auth";
import { useSearchParams } from "react-router-dom";
import AllDetailsCard from "../components/AllDetailsCard";
import UpdateExpenseModal from "../components/UpdateExpenseModal";
import DeleteConfirmBox from "../components/DeleteConfirmBox";

const DayDetails = () => {
  const [expenses, setExpenses] = useState([]);
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");
  const [openModal, setOpenModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openDelConfirm, setOpenDelConfirm] = useState(false);

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

  const handleEditClicked = (expense) => {
    setSelectedExpense(expense);
    setOpenModal(true);
  };

  const handleDelClicked = (expense) => {
    setSelectedExpense(expense);
    setOpenDelConfirm(true);
  };

  return (
    <div className="day-details-wrapper mb-10">
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
                  index={index}
                  expense={expense}
                  checkIsEditClicked={handleEditClicked}
                  checkIsDelClicked={handleDelClicked}
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

      {/* Edit Modal */}
      {openModal && selectedExpense && (
        <UpdateExpenseModal
          expenseData={selectedExpense}
          onClose={() => {
            setOpenModal(false);
            setSelectedExpense(null);
          }}
          onUpdated={() => fetchExpenses(date)}
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
          onDeleted={() => fetchExpenses(date)}
        />
      )}
    </div>
  );
};

export default DayDetails;
