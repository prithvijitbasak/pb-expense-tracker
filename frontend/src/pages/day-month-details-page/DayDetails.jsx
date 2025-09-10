import { useEffect, useState } from "react";
import "../../assets/styles/DayDetails.css";
import { API } from "../../utils/auth";
import { useSearchParams } from "react-router-dom";
import AllDetailsCard from "../../components/AllDetailsCard";
import UpdateExpenseModal from "../../components/UpdateExpenseModal";
import DeleteConfirmBox from "../../components/DeleteConfirmBox";
import DayMonthYearDetails from "./DayMonthYearDetails";
import useTotalExpense from "../../hooks/useTotalExpense";

const DayDetails = () => {
  const [expenses, setExpenses] = useState([]);
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchExpenses(date);
  }, [date]);

  const fetchExpenses = async (date) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false); // ✅ always reset loading
    }
  };

  const totalExpense = useTotalExpense("day", {
    date: `${date}`,
  });

  return (
    <>
      <DayMonthYearDetails
        typeOfExpense="day"
        isLoading={isLoading}
        expenses={expenses}
        totalExpense={totalExpense}
        fetchExpenses={fetchExpenses}
        paramArray={[date]}
      />
    </>
  );
};

export default DayDetails;
