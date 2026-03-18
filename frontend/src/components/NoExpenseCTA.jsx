import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NoExpenseCTA = (props) => {
  const { typeOfExpense } = props;
  const { user } = useAuth();
  return (
    <>
      <p className="no-expense-text">
        No expenses found for the selected{" "}
        {typeOfExpense === "day" ? `day` : `month`}.
      </p>
      <p>
        Are there any expense? Then add here:{" "}
        <Link to={`/${user?.username}/add-expense`}>Add Expense</Link>
      </p>
    </>
  );
};

export default NoExpenseCTA;
