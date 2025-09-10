import DayMonthYearDetails from "./DayMonthYearDetails";
import { useEffect, useState } from "react";
import { API } from "../../utils/auth";
import { useSearchParams } from "react-router-dom";
import useTotalExpense from "../../hooks/useTotalExpense";

const MonthDetails = () => {
  const [expenses, setExpenses] = useState([]);
  const [searchParams] = useSearchParams();
  const month = searchParams.get("month");
  const year = searchParams.get("year");
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

  const totalExpense = useTotalExpense("month", {
    month: `${month}`,
    year: `${year}`,
  });

  useEffect(() => {
    if (month && year) {
      fetchExpenses(month, year);
    }
  }, [month, year]); // ✅ Only fetch when `month` or `year` changes

  return (
    <>
      <DayMonthYearDetails
        typeOfExpense="month"
        isLoading={isLoading}
        expenses={expenses}
        totalExpense={totalExpense}
        fetchExpenses={fetchExpenses}
        paramArray={[month, year]}
      />
    </>
  );
};

export default MonthDetails;
