import { Link } from "react-router-dom";

const NoExpenseCTA = (props) => {
  const { typeOfExpense } = props;
  return (
    <>
      <p className="no-expense-text">
        No expenses found for the selected{" "}
        {typeOfExpense === "day" ? `day` : `month`}.
      </p>
      <p>
        Are there any expense? Then add here:{" "}
        <Link to={"/add-expense"}>Add Expense</Link>
      </p>
    </>
  );
};

export default NoExpenseCTA;
