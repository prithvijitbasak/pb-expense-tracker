import ExpenseSearchBox from "./ExpenseSearchBox";

const SearchBoxSection = () => {
  return (
    <>
      <h4 className="text-lg font-bold text-center pb-2 pt-8">
        Search Your Previous Expenses
      </h4>
      <div className="flex justify-center gap-10">
        <ExpenseSearchBox searchType="date"/>
        <ExpenseSearchBox searchType="month"/>
      </div>
    </>
  );
};

export default SearchBoxSection;
