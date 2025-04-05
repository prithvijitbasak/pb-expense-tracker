import PropTypes from "prop-types";

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
    <div className="expense-card" key={index}>
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
        <span className="font-bold tracking-wider">Added on:</span> {createdAt}
      </p>
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
