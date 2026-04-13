import { useState } from "react";
import { API } from "../../utils/auth";
import { useSearchParams } from "react-router-dom";
import UpdateExpenseModal from "../../components/UpdateExpenseModal";
import DeleteConfirmBox from "../../components/DeleteConfirmBox";
import useTotalExpense from "../../hooks/useTotalExpense";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "./DataTable";
import { FaEdit } from "react-icons/fa";
import DataTableShimmer from "../../components/shimmerUIs/DataTableShimmer";
import { MdDelete } from "react-icons/md";
import { MdSkipPrevious } from "react-icons/md";
import { MdSkipNext } from "react-icons/md";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatDtConven, alphaNumDate } from "../../utils/formatterFunctions";

const DayDetails = () => {
  // it is used to invalidate the query after updating an expense,
  // so that the data is refetched and the table is updated with the latest data without needing a manual refresh
  const queryClient = useQueryClient();

  const [searchParams] = useSearchParams();
  const date = searchParams.get("date");

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

  // Define columns for the DataTable
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
          <div className="font-medium text-red-600 text-center">₹{amount.toFixed(2)}</div>
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
        return <div className="text-center">{notes.length > 40 ? notes.substring(0, 40) + "..." : notes}</div>;
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
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <button
              className="text-blue-500 hover:text-blue-700 cursor-pointer text-xl"
              onClick={() => handleEditClicked(row.original)}
            >
              <FaEdit className="inline" />
            </button>
          </div>
        );
      },
    },
    {
      accessorKey: "delete",
      header: () => <div className="text-center">Delete</div>,
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <button
              className="text-red-500 hover:text-red-700 cursor-pointer text-xl"
              onClick={() => handleDelClicked(row.original)}
            >
              <MdDelete className="inline" />
            </button>
          </div>
        );
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

  // for displaying the date is dd mon yyyy format
  // the {date} is in dd-mm-yyyy format so Date() will not work directly, we need to split and rearrange it
  const [day, month, year] = date.split("-");
  const currentDate = new Date(year, month - 1, day);

  // Create copies so you don't mutate the original currentDate
  let prev = new Date(currentDate);
  let next = new Date(currentDate);

  // Increment/Decrement by 1 full day
  prev.setDate(currentDate.getDate() - 1);
  next.setDate(currentDate.getDate() + 1);

  const previousDate = formatDtConven(prev);
  const nextDate = formatDtConven(next);
  const formattedDate = new Date(year, month - 1, day).toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );

  return (
    <div className="mt-6 px-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold mb-4">Expense History</h3>
        <div className="text-md text-muted-foreground mb-2">
          Total Expenses for {formattedDate}:{" "}
          <span className="font-medium text-red-600">
            ₹{" "}
            {totalExpense.loading
              ? "Loading..."
              : totalExpense.total.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex justify-end items-center mb-6 px-2 gap-x-3.5 pt-3">
        <Link
          to={`/${user.username}/day-details?date=${previousDate}`}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all duration-200 active:scale-95 shadow-sm border border-gray-200"
        >
          <MdSkipPrevious className="text-xl" />
          <span className="text-sm font-medium">Prev</span>
        </Link>

        <Link
          to={`/${user.username}/day-details?date=${nextDate}`}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all duration-200 active:scale-95 shadow-sm border border-gray-200"
        >
          <span className="text-sm font-medium">Next</span>
          <MdSkipNext className="text-xl" />
        </Link>
      </div>
      {isLoading ? (
        <DataTableShimmer />
      ) : (
        <DataTable columns={columns} data={expenses} />
      )}

      {/* Edit Modal */}
      {openModal && selectedExpense && (
        <UpdateExpenseModal
          expenseData={selectedExpense}
          onClose={() => {
            setOpenModal(false);
            setSelectedExpense(null);
          }}
          onUpdated={() => {
            queryClient.invalidateQueries({ queryKey: ["day-expenses", date] });
          }}
        />
      )}

      {/* Delete confirm box */}
      {openDelConfirm && selectedExpense && (
        <DeleteConfirmBox
          expenseData={selectedExpense}
          onClose={() => {
            setOpenDelConfirm(false);
            setSelectedExpense(null);
          }}
          onDeleted={() => {
            queryClient.invalidateQueries({ queryKey: ["day-expenses", date] });
          }}
        />
      )}
    </div>
  );
};

export default DayDetails;
