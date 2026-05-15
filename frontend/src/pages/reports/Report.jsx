import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../../components/DataTable";
import DataTableShimmer from "../../components/shimmerUIs/DataTableShimmer";
import { alphaNumDate } from "../../utils/formatterFunctions";
import { API } from "@/utils/auth";
import {
  formatDtConven,
  formatInputDate,
} from "../../utils/formatterFunctions";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportDocument from "./ReportDocument";

const Report = () => {
  const [year] = useState(new Date().getFullYear());
  const currDate = new Date();

  const [startDate, setStartDate] = useState(
    formatDtConven(new Date(year, 0, 1)),
  );
  const [endDate, setEndDate] = useState(formatDtConven(currDate));

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
  const totalRecords = data?.pagination?.totalRecords || expenses.length;
  const totalAmount = data?.totalAmount || 0;

  return (
    <div className="p-4">
      <div className="flex justify-between align-center mb-4">
        <div>
          <h2 className="text-xl font-bold">{year} Expense Report</h2>
          <p className="font-semibold pt-1.5">
            {startDate} to {endDate} | Total Records:{" "}
            <span className="text-red-500 font-bold">{totalRecords}</span>
          </p>
        </div>
        <h3 className="text-xl">
          Total Amount:{" "}
          <span className="text-red-700 font-bold">₹{totalAmount}</span>
        </h3>
      </div>

      <div className="flex justify-end">
        <PDFDownloadLink
          document={
            <ReportDocument
              expenses={expenses}
              startDate={startDate}
              endDate={endDate}
            />
          }
          fileName={`${year}_Expense_Report.pdf`}
          className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 inline-block"
        >
          {({ blob, url, loading, error }) =>
            loading ? "Generating PDF..." : "Download PDF"
          }
        </PDFDownloadLink>
      </div>

      <div className="pt-4">
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
    </div>
  );
};

export default Report;
