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
      <p className="title">Title - {title}</p>
      <p className="price">Price - {amount}</p>
      <p className="category">Category - {category}</p>
      <p className="date-of-expense">Date - {date}</p>
      <p className="notes">Notes: {notes}</p>
      <p className="created-date">Added on - {createdAt}</p>
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
