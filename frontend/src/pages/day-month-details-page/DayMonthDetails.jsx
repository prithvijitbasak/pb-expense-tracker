import { useState } from "react";
import AllDetailsCard from "../../components/AllDetailsCard";
import "../../assets/styles/MonthDetails.css";
import UpdateExpenseModal from "../../components/UpdateExpenseModal";
import DeleteConfirmBox from "../../components/DeleteConfirmBox";
import monthData from "../../data/monthData.json";
import { ShimmerGrid } from "../../components/ShimmerUI";
import { BritishDate } from "../../utils/formatterFunctions";
import NoExpenseCTA from "../../components/NoExpenseCTA";

const DayMonthDetails = (props) => {
  const {
    typeOfExpense,
    isLoading,
    expenses,
    totalExpense,
    fetchExpenses,
    paramArray,
  } = props;

  let date, month, year;

  if (typeOfExpense === "day") {
    [date] = paramArray;
  } else {
    [month, year] = paramArray;
  }
  const [openModal, setOpenModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openDelConfirm, setOpenDelConfirm] = useState(false);
  const [isGridLayout, setIsGridLayout] = useState(true);

  const handleEditClicked = (expense) => {
    setSelectedExpense(expense);
    setOpenModal(true);
  };

  const handleDelClicked = (expense) => {
    setSelectedExpense(expense);
    setOpenDelConfirm(true);
  };

  const handleExpenseViewToggle = () => {
    setIsGridLayout((prev) => !prev);
  };

  return (
    <div className="month-details-wrapper mb-10">
      <div className="container">
        <div className="month-details-container">
          {typeOfExpense === "day" ? (
            <h2 className="heading-text font-bold tracking-wider text-2xl">
              Expenses of: <BritishDate date={date} />
            </h2>
          ) : (
            <h2 className="heading-text font-bold tracking-wider text-2xl">
              All the expenses of month: {monthData[month]}, {year}
            </h2>
          )}

          <div className="layout-toggle-buttons flex gap-4 justify-start">
            <button
              className={`btn btn-primary cursor-pointer ${isGridLayout ? "border border-amber-600" : ""}`}
              onClick={handleExpenseViewToggle}
            >
              Grid layout
            </button>
            <button
              className={`btn btn-secondary cursor-pointer ${!isGridLayout ? "border border-amber-600" : ""}`}
              onClick={handleExpenseViewToggle}
            >
              Table layout
            </button>
          </div>

          <h4 className="font-bold text-right pb-3 pr-9 text-xl">
            Total ={" "}
            {isLoading ? "Loading total expense..." : `${totalExpense.total}`}
          </h4>

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
              <NoExpenseCTA typeOfExpense={typeOfExpense} />
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
          onUpdated={() =>
            typeOfExpense === "day"
              ? fetchExpenses(date)
              : fetchExpenses(month, year)
          }
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
          onDeleted={() =>
            typeOfExpense === "day"
              ? fetchExpenses(date)
              : fetchExpenses(month, year)
          }
        />
      )}
    </div>
  );
};

export default DayMonthDetails;
