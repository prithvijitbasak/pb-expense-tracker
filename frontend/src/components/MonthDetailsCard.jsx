import { Link } from "react-router-dom";
import "../assets/styles/DetailsCard.css";
import { useAuth } from "../context/AuthContext";
import useTotalExpense from "@/hooks/useTotalExpense";

const MonthDetailsCard = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const { user } = useAuth();

  const { total, loading, error } = useTotalExpense("month", {
    month,
    year,
  });

  return (
    <div className="details-card">
      <h3 className="details-heading-text">This Month Expenses</h3>
      <p className="total-text">
        Total Expenses ={" "}
        {loading ? "Loading..." : error ? "Error loading expenses" : total}
      </p>
      <Link
        to={`/${user.username}/month-details?month=${month}&year=${year}`}
        className="details-btn"
      >
        See Details
      </Link>
    </div>
  );
};

export default MonthDetailsCard;