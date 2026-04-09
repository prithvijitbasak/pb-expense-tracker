import "../../assets/styles/DayDetails.css";
import { API } from "../../utils/auth";
import { useSearchParams } from "react-router-dom";
import DayMonthDetails from "./DayMonthDetails";
import useTotalExpense from "../../hooks/useTotalExpense";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "./DataTable"; // Your newly created component

const DayDetails = () => {
  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");

  // Define columns for the DataTable
  const columns = [
    {
      accessorKey: "Serial No.",
      header: "S.No",
      cell: ({ row }) => row.index + 1, // Display the row index + 1 for serial number
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "amount",
      header: "Amount (₹)",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        return (
          <div className="font-medium text-red-600">₹{amount.toFixed(2)}</div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
    }, 
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const dateValue = row.getValue("date");
        const formattedDate = new Date(dateValue).toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );
        return formattedDate;
      },
    },
    {
      accessorKey: "notes",
      header: "Notes",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {  
        const createdAtValue = row.getValue("createdAt");
        const formattedCreatedAt = new Date(createdAtValue).toLocaleString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        );
        return formattedCreatedAt;
      },
    },
  ];

  const fetchExpenses = async (date) => {
    const response = await fetch(
      `${API}/api/expenses/get-expenses-by-date?date=${date}`,
      {
        method: "GET",
        credentials: "include",
      },
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
    enabled: !!date,
  });

  const totalExpense = useTotalExpense("day", { date });

  if (error) {
    return (
      <p className="p-4 text-red-500">
        Error loading expenses: {error.message}
      </p>
    );
  }

  return (
    <div className="mt-6 px-4">
      <h3 className="text-lg font-semibold mb-4">Expense History</h3>
      <DataTable columns={columns} data={expenses} />
    </div>
  );
};

export default DayDetails;
