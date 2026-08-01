import { useState } from "react";
import { API } from "../../utils/auth";
import { Link, useSearchParams } from "react-router-dom";
import UpdateExpenseModal from "../../components/UpdateExpenseModal";
import DeleteConfirmBox from "../../components/DeleteConfirmBox";
import useTotalExpense from "../../hooks/useTotalExpense";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "../../components/DataTable";
import { FaEdit } from "react-icons/fa";
import DataTableShimmer from "../../components/shimmerUIs/DataTableShimmer";
import { MdDelete, MdSkipPrevious, MdSkipNext } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { alphaNumDate } from "../../utils/formatterFunctions";
import monthData from "../../data/monthData.json";

const MonthDetails = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const month = searchParams.get("month");
  const year = searchParams.get("year");
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [openDelConfirm, setOpenDelConfirm] = useState(false);
  const { user } = useAuth();

  const handleEditClicked = (expense) => {
    setSelectedExpense(expense);
    setOpenModal(true);
  };

  const handleDelClicked = (expense) => {
    setSelectedExpense(expense);
    setOpenDelConfirm(true);
  };

  const columns = [
    {
      accessorKey: "S.No",
      header: () => <div className="text-center">S.No</div>,
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
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
    {
      accessorKey: "edit",
      header: () => <div className="text-center">Edit</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <button
            className="text-blue-500 hover:text-blue-700 cursor-pointer text-xl"
            onClick={() => handleEditClicked(row.original)}
          >
            <FaEdit className="inline" />
          </button>
        </div>
      ),
    },
    {
      accessorKey: "delete",
      header: () => <div className="text-center">Delete</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <button
            className="text-red-500 hover:text-red-700 cursor-pointer text-xl"
            onClick={() => handleDelClicked(row.original)}
          >
            <MdDelete className="inline" />
          </button>
        </div>
      ),
    },
  ];

  const fetchExpenses = async (month, year, currentPage = 1) => {
    const url = `${API}/api/expenses/get-expenses-by-month?month=${month}&year=${year}&page=${currentPage}&limit=10`;

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }

    const data = await response.json();
    return data;
  };

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["month-expenses", month, year, page],
    queryFn: () => fetchExpenses(month, year, page),
    enabled: !!month && !!year,
    placeholderData: (previousData) => previousData,
  });

  const expenses = data?.expenses || [];

  const totalExpense = useTotalExpense("month", {
    month: `${month}`,
    year: `${year}`,
  });

  const totalPages = data?.totalPages || 1;
  const totalRecords = data?.totalRecords || expenses.length;

  if (error) {
    return (
      <p className="p-4 text-red-500">
        Error loading expenses: {error.message}
      </p>
    );
  }

  const currentMonthDate = new Date(Number(year), Number(month) - 1, 1);
  const prevMonthDate = new Date(currentMonthDate);
  prevMonthDate.setMonth(currentMonthDate.getMonth() - 1);
  const nextMonthDate = new Date(currentMonthDate);
  nextMonthDate.setMonth(currentMonthDate.getMonth() + 1);

  const previousMonth = String(prevMonthDate.getMonth() + 1).padStart(2, "0");
  const previousYear = prevMonthDate.getFullYear();
  const nextMonth = String(nextMonthDate.getMonth() + 1).padStart(2, "0");
  const nextYear = nextMonthDate.getFullYear();
  const formattedMonthLabel = monthData[month] || month;

  return (
    <div className="mt-6 px-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold mb-4">Expense History</h3>
        <div className="text-md text-muted-foreground mb-2">
          Total Expenses for {formattedMonthLabel} {year}:{" "}
          <span className="font-medium text-red-600">
            ₹ {totalExpense.loading ? "Loading..." : totalExpense.total.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex justify-end items-center mb-6 px-2 gap-x-3.5 pt-3">
        <Link
          to={`/${user.username}/month-details?month=${previousMonth}&year=${previousYear}`}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all duration-200 active:scale-95 shadow-sm border border-gray-200"
        >
          <MdSkipPrevious className="text-xl" />
          <span className="text-sm font-medium">Prev</span>
        </Link>

        <Link
          to={`/${user.username}/month-details?month=${nextMonth}&year=${nextYear}`}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all duration-200 active:scale-95 shadow-sm border border-gray-200"
        >
          <span className="text-sm font-medium">Next</span>
          <MdSkipNext className="text-xl" />
        </Link>
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        Showing page {page} of {totalPages} • Total records: {totalRecords}
      </div>

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

      {openModal && selectedExpense && (
        <UpdateExpenseModal
          expenseData={selectedExpense}
          onClose={() => {
            setOpenModal(false);
            setSelectedExpense(null);
          }}
          onUpdated={() => {
            queryClient.invalidateQueries({ queryKey: ["month-expenses", month, year, page] });
          }}
        />
      )}

      {openDelConfirm && selectedExpense && (
        <DeleteConfirmBox
          expenseData={selectedExpense}
          onClose={() => {
            setOpenDelConfirm(false);
            setSelectedExpense(null);
          }}
          onDeleted={() => {
            queryClient.invalidateQueries({ queryKey: ["month-expenses", month, year, page] });
          }}
        />
      )}
    </div>
  );
};

export default MonthDetails;
