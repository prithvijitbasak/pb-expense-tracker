import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "../day-month-details-page/DataTable";
import DataTableShimmer from "../../components/shimmerUIs/DataTableShimmer";
import { alphaNumDate } from "../../utils/formatterFunctions";
import { API } from "@/utils/auth";

const Report = () => {
  const { user } = useAuth();
  const [year] = useState(new Date().getFullYear());
  const startDate = `01-01-${year}`;
  const endDate = `31-12-${year}`;

  const fetchReportData = async (startDate, endDate, page = 1) => {
    const response = await fetch(
      `${API}/api/expenses/reports/date-range?startDateParam=${startDate}&endDateParam=${endDate}&page=${page}&limit=10`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    // Manual check for HTTP errors (400s, 500s)
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Return the whole object to access total count/meta
  };

  // Inside your component
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    // Include page in queryKey so TanStack Query tracks it separately
    queryKey: ["day-expenses", startDate, endDate, page],
    queryFn: () => fetchReportData(startDate, endDate, page),
    enabled: !!startDate && !!endDate,
    // Keeps previous data on screen while fetching new page
    placeholderData: (previousData) => previousData,
  });

  const expenses = data?.expenses || [];

  const columns = [
    {
      accessorKey: "S.No",
      header: () => <div className="text-center">S.No</div>, // Center header
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>, // Center cell
    },
    {
      accessorKey: "title",
      header: () => <div className="text-center">Title</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("title")}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-center">Amount (₹)</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        return (
          <div className="font-medium text-red-600 text-center">
            ₹{amount.toFixed(2)}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: () => <div className="text-center">Category</div>,
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("category")}</div>
      ),
    },
    {
      accessorKey: "date",
      header: () => <div className="text-center">Date</div>,
      cell: ({ row }) => {
        const dateValue = row.getValue("date");
        const formattedDate = alphaNumDate(dateValue);
        return <div className="text-center">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "notes",
      header: () => <div className="text-center">Notes</div>,
      cell: ({ row }) => {
        // Limit notes to 40 characters for better display in the table
        const notes = row.getValue("notes") || "";
        return (
          <div className="text-center">
            {notes.length > 40 ? notes.substring(0, 40) + "..." : notes}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => <div className="text-center">Expense Added On</div>,
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
          },
        );
        return <div className="text-center">{formattedCreatedAt}</div>;
      },
    },
  ];

  if (isError) {
    return (
      <p className="p-4 text-red-500">
        Error loading expenses: {error.message}
      </p>
    );
  }

  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">{year} Expense Report</h2>
      <p>
        {startDate} to {endDate} |{" "}
      </p>
      {isLoading ? (
        <DataTableShimmer />
      ) : (
        <DataTable
          columns={columns}
          data={expenses}
          pageCount={totalPages}
          pageIndex={page}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
};

export default Report;
