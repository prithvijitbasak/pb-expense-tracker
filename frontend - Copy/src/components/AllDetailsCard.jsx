import PropTypes from "prop-types";
import "../assets/styles/AllDetailsCard.css";
import { formatDateTime, formatDtConven } from "../utils/formatterFunctions";
import { useEffect, useState } from "react";

const AllDetailsCard = ({
  index,
  expense,
  checkIsEditClicked,
  checkIsDelClicked,
}) => {
  const { title, amount, category, date, notes, createdAt, updatedAt } =
    expense;

  const [editTime, showEditTime] = useState(false);

  const handleEditClick = () => {
    checkIsEditClicked(expense); // Pass the whole expense to parent
  };

  const handleDelClick = () => {
    checkIsDelClicked(expense);
  };

  const checkIfEdited = (createdAt, updatedAt) => {
    if (new Date(createdAt).getTime() !== new Date(updatedAt).getTime()) {
      showEditTime(true);
    } else {
      showEditTime(false);
    }
  };

  useEffect(() => {
    checkIfEdited(createdAt, updatedAt);
  }, [createdAt, updatedAt]);

  return (
    <div
      className="expense-card flex flex-col justify-between gap-4"
      key={index}
    >
      <div className="pb-3">
        <p className="title">
          <span className="font-bold tracking-wider">Title:</span> {title}
        </p>
        <p className="price">
          <span className="font-bold tracking-wider">Price:</span> ₹{amount}
        </p>
        <p className="category">
          <span className="font-bold tracking-wider">Category:</span> {category}
        </p>
        <p className="date">
          <span className="font-bold tracking-wider">Date of expense:</span>{" "}
          {formatDtConven(date)}
        </p>
        <p className="notes">
          <span className="font-bold tracking-wider">Notes:</span> {notes}
        </p>
        <p className="created-date">
          <span className="font-bold tracking-wider">Added on:</span>{" "}
          {formatDateTime(createdAt)}
        </p>
      </div>
      <div
        className={`edit-delete-btn flex ${
          editTime ? "justify-between" : "justify-end"
        } gap-4 items-end`}
      >
        {editTime && (
          <p className="text-xs font-normal">
            Last edited at: {formatDateTime(updatedAt)}{" "}
          </p>
        )}
        <div className="flex justify-between gap-3">
          <button
            className="rounded bg-green-500 px-2 font-medium cursor-pointer edit-btn"
            onClick={() => {
              handleEditClick();
              console.log("opening the edit modal");
            }}
          >
            Edit
          </button>
          <button
            className="rounded bg-red-500 px-3 py-3 font-medium cursor-pointer delete-btn"
            onClick={() => {
              handleDelClick();
              console.log("Opening the delete confirm box");
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

AllDetailsCard.propTypes = {
  index: PropTypes.number,
  expense: PropTypes.object.isRequired,
  checkIsEditClicked: PropTypes.func.isRequired,
  checkIsDelClicked: PropTypes.func.isRequired,
};

export default AllDetailsCard;
