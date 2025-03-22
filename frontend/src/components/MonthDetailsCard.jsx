import { Link } from "react-router-dom";
import "../assets/styles/DetailsCard.css";
const MonthDetailsCard = () => {
  return (
    <div className="details-card">
      <h3 className="details-heading-text">This Month Expenses</h3>
      <p className="total-text">Total Expenses = </p>
      <Link to={"/month-details"} className="details-btn">See Details</Link>
    </div>
  );
};

export default MonthDetailsCard;
