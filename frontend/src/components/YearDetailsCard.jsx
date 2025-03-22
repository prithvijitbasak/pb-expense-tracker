import { Link } from "react-router-dom";
import "../assets/styles/DetailsCard.css";
const YearDetailsCard = () => {
  return (
    <div className="details-card">
      <h3 className="details-heading-text">This Year Expenses</h3>
      <p className="total-text">Total Expenses = </p>
      <Link to={"/year-details"} className="details-btn">See Details</Link>
    </div>
  );
};

export default YearDetailsCard;
