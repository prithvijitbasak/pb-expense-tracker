import { useEffect, useState } from "react";
import { API } from "../../utils/auth";
import AllDetailsCard from "../../components/AllDetailsCard";
import { useSearchParams } from "react-router-dom";
import "../../assets/styles/MonthDetails.css";
import UpdateExpenseModal from "../../components/UpdateExpenseModal";
import DeleteConfirmBox from "../../components/DeleteConfirmBox";
import monthData from "../../data/monthData.json";
import { ShimmerGrid } from "../../components/ShimmerUI";

const DayMonthYearDetails = (props) => {
  const { typeOfExpense, isLoading, expenses, totalExpense, fetchExpenses, paramArray } = props;
  const [month, year] = paramArray;
  const [openModal, setOpenModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openDelConfirm, setOpenDelConfirm] = useState(false);

  const handleEditClicked = (expense) => {
    setSelectedExpense(expense);
    setOpenModal(true);
  };

  const handleDelClicked = (expense) => {
    setSelectedExpense(expense);
    setOpenDelConfirm(true);
  };

  return (
    <div className="month-details-wrapper mb-10">
      <div className="container">
        <div className="month-details-container">
          {/* <h2 className="heading-text font-bold tracking-wider text-2xl">
            All the expenses of month: {monthData[month]}, {year}
          </h2> */}

          {/* <h4 className="font-bold text-right pb-3 pr-9 text-xl">
            Total ={" "}
            {loading
              ? "Loading total expense..."
              : error
              ? "Error fetching total"
              : `${total}`}
          </h4> */}

          <div className="expenses-card-container">
            {isLoading ? (
              // ✅ Case 1: When data is being fetched
              <ShimmerGrid />
            ) : expenses.length > 0 ? (
              // ✅ Case 2: When expenses exist
              expenses.map((expense, index) => (
                <AllDetailsCard
                  key={expense._id || index} // Prefer unique id if available
                  index={index}
                  expense={expense}
                  checkIsEditClicked={handleEditClicked}
                  checkIsDelClicked={handleDelClicked}
                />
              ))
            ) : (
              // ✅ Case 3: When no expenses found
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

export default DayMonthYearDetails;
