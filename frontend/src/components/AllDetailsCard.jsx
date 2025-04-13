import PropTypes from "prop-types";
import "../assets/styles/AllDetailsCard.css";
import { formatDateTime, formatDtConven } from "../utils/formatterFunctions";

const AllDetailsCard = ({ index, expense, checkIsEditClicked }) => {
  const { title, amount, category, date, notes, createdAt, updatedAt } =
    expense;

  const handleEditClick = () => {
    checkIsEditClicked(expense); // Pass the whole expense to parent
  };

  return (
    <div className="expense-card flex flex-col justify-between" key={index}>
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
        <p className="updated-date">
          <span className="font-bold tracking-wider">Updated on:</span>{" "}
          {formatDateTime(updatedAt)}
        </p>
      </div>
      <div className="edit-delete-btn flex justify-end gap-4">
        <button
          className="rounded bg-green-500 px-2 font-medium cursor-pointer edit-btn"
          onClick={() => {
            handleEditClick();
            console.log("opening the edit modal");
          }}
        >
          Edit
        </button>
        <button className="rounded bg-red-500 px-3 py-3 font-medium cursor-pointer delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
};

AllDetailsCard.propTypes = {
  index: PropTypes.number,
  expense: PropTypes.object.isRequired,
  checkIsEditClicked: PropTypes.func.isRequired,
};

export default AllDetailsCard;
