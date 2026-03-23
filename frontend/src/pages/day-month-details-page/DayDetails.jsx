import { useEffect, useState } from "react";
import "../../assets/styles/DayDetails.css";
import { API } from "../../utils/auth";
import { useSearchParams } from "react-router-dom";
import AllDetailsCard from "../../components/AllDetailsCard";
import UpdateExpenseModal from "../../components/UpdateExpenseModal";
import DeleteConfirmBox from "../../components/DeleteConfirmBox";
import DayMonthDetails from "./DayMonthDetails";
import useTotalExpense from "../../hooks/useTotalExpense";
import { useQuery } from "@tanstack/react-query";

const DayDetails = () => {
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");

  const fetchExpenses = async (date) => {
    const response = await fetch(
      `${API}/api/expenses/get-expenses-by-date?date=${date}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }

    const data = await response.json();
    return data.expenses || [];
  };

  const {
    data: expenses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["day-expenses", date],
    queryFn: () => fetchExpenses(date),
    enabled: !!date, // when date is available, then only fetch the expenses
  });

  const totalExpense = useTotalExpense("day", { date });

  if (error) {
    return <p>Error loading expenses</p>;
  }

  return (
    <DayMonthDetails
      typeOfExpense="day"
      isLoading={isLoading}
      expenses={expenses}
      totalExpense={totalExpense}
      paramArray={[date]}
    />
    
  );
};

export default DayDetails;
