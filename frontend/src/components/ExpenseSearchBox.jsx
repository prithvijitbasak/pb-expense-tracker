import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const ExpenseSearchBox = (props) => {
  const { searchType } = props;
  const [rawDate, setRawDate] = useState(""); // Stores the input date in yyyy-mm-dd
  const [formattedDate, setFormattedDate] = useState(""); // Stores the converted dd-mm-yyyy format
  const [inputMonth, setInputMonth] = useState("");
  const [inputYear, setInputYear] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleDate = (e) => {
    const collectedDate = e.target.value;
    setRawDate(collectedDate); // Maintain the yyyy-mm-dd format for the input field

    if (collectedDate) {
      const [year, month, day] = collectedDate.split("-");
      const formatted = `${day}-${month}-${year}`;
      setFormattedDate(formatted); // Store the formatted date
    }
  };

  const handleMonth = (e) => {
    const collectedMonth = e.target.value;
    if (collectedMonth) {
      const [year, month] = collectedMonth.split("-");
      setInputMonth(month);
      setInputYear(year);
      console.log("Collected Month:", month, "Collected Year:", year);
    }
  };

  const handleSearch = () => {
    if (formattedDate || (inputMonth && inputYear)) {
      if (searchType === "month") {
        navigate(
          `/${user.username}/month-details?month=${inputMonth}&year=${inputYear}`,
        );
      } else {
        navigate(`/${user.username}/day-details?date=${formattedDate}`);
      }
    } else {
      toast.error("Please select a date!");
    }
  };
  return (
    <div className="px-4 py-4 bg-white shadow-[var(--global-box-shadow)] rounded-md">
      <p className="font-medium text-center pb-4">
        {searchType === "month" ? "Search By Month" : "Search By Date"}
      </p>
      {searchType === "month" ? (
        <input
          type="month"
          onChange={handleMonth}
          className="px-2 py-2 rounded-md border border-black"
        />
      ) : (
        <input
          type="date"
          onChange={handleDate}
          value={rawDate}
          className="block width-[80%] mx-auto px-2 py-2 rounded-md border border-black"
        />
      )}
      <div className="text-center">
        <button
          onClick={handleSearch}
          className="mt-4 bg-[var(--top-color)] hover:bg-white text-white hover:text-[var(--top-color)] font-bold py-2 px-4 rounded cursor-pointer border border-2 border-[var(--top-color)]"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default ExpenseSearchBox;
