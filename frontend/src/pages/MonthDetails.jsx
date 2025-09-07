import { useEffect, useState } from "react";
import { API } from "../utils/auth";
import AllDetailsCard from "../components/AllDetailsCard";
import { useSearchParams } from "react-router-dom";
import "../assets/styles/MonthDetails.css";
import UpdateExpenseModal from "../components/UpdateExpenseModal";
import DeleteConfirmBox from "../components/DeleteConfirmBox";
import monthData from "../data/monthData.json";
import useTotalExpense from "../hooks/useTotalExpense";
import { ShimmerGrid } from "../components/ShimmerUI";

const MonthDetails = () => {
  const [expenses, setExpenses] = useState([]);
  const [searchParams] = useSearchParams();
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const [openModal, setOpenModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openDelConfirm, setOpenDelConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // console.log("Fetching expenses for:", month, year);

  const fetchExpenses = async (month, year) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in local storage!");
        setIsLoading(false); // ✅ prevent infinite loading
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

      if (response.ok) {
        const data = await response.json(); // ✅ parse JSON directly
        setExpenses(data.expenses || []); // ✅ default to [] if undefined
      } else {
        const errorText = await response.text();
        console.error("Error fetching expenses:", errorText);
        setExpenses([]); // ✅ optional: clear expenses on error
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setExpenses([]); // ✅ optional: prevent stale data
    } finally {
      setIsLoading(false); // ✅ always reset loading
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

export default MonthDetails;
