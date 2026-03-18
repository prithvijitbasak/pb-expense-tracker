import DayMonthDetails from "./DayMonthDetails";
import { useEffect, useState } from "react";
import { API } from "../../utils/auth";
import { useSearchParams } from "react-router-dom";
import useTotalExpense from "../../hooks/useTotalExpense";
import { useQuery } from "@tanstack/react-query";

const MonthDetails = () => {
  const [searchParams] = useSearchParams();
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  //fetching using react query
  const {
    data: expenses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["month-details", month, year],
    queryFn: () => fetchExpenses(month, year),
    enabled: !!month && !!year, // ✅ Only fetch when both `month` and `year` are available
  });

  const fetchExpenses = async (month, year) => {
    const url = `${API}/api/expenses/get-expenses-by-month?month=${month}&year=${year}`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }

    const data = await response.json();
    return data.expenses || [];
  };

  const totalExpense = useTotalExpense("month", {
    month: `${month}`,
    year: `${year}`,
  });

  if (error) {
    return <p>Error loading expenses</p>;
  }

  return (
    <>
      <DayMonthDetails
        typeOfExpense="month"
        isLoading={isLoading}
        expenses={expenses}
        totalExpense={totalExpense}
        fetchExpenses={fetchExpenses}
        paramArray={[month, year]} // extremely necessary to tell the component which type of expense is this for day or month
      />
    </>
  );
};

export default MonthDetails;
