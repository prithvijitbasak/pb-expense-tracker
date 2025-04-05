import PropTypes from "prop-types";
import "../assets/styles/AllDetailsCard.css";

const AllDetailsCard = ({
  index,
  title,
  amount,
  category,
  date,
  notes,
  createdAt,
}) => {
  return (
    <div className="expense-card flex flex-col justify-between" key={index}>
      <div className="pb-3">
        <p className="title">
          <span className="font-bold tracking-wider">Title</span> - {title}
        </p>
        <p className="price">
          <span className="font-bold tracking-wider">Price</span> - ₹{amount}
        </p>
        <p className="category">
          <span className="font-bold tracking-wider">Category:</span> {category}
        </p>
        <p className="date-of-expense">
          <span className="font-bold tracking-wider">Date:</span> {date}
        </p>
        <p className="notes">
          <span className="font-bold tracking-wider">Notes:</span> {notes}
        </p>
        <p className="created-date">
          <span className="font-bold tracking-wider">Added on:</span>{" "}
          {createdAt}
        </p>
      </div>
      <div className="edit-delete-btn flex justify-end gap-4">
        <button className="rounded bg-green-500 px-2 font-medium cursor-pointer edit-btn">
          Edit
        </button>
        <button className="rounded bg-red-500 px-3 py-3  px-[5px] font-medium cursor-pointer delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
};

// Define PropTypes for the component
// its for prop validation
AllDetailsCard.propTypes = {
  index: PropTypes.number,
  title: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  notes: PropTypes.string,
  createdAt: PropTypes.string.isRequired,
};

export default AllDetailsCard;
