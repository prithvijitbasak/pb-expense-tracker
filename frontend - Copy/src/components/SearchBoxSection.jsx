import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/SearchBoxSection.css";
import { toast } from "react-toastify";

const SearchBoxSection = () => {
  const [rawDate, setRawDate] = useState(""); // Stores the input date in yyyy-mm-dd
  const [formattedDate, setFormattedDate] = useState(""); // Stores the converted dd-mm-yyyy format
  const navigate = useNavigate();

  const handleDate = (e) => {
    const collectedDate = e.target.value;
    setRawDate(collectedDate); // Maintain the yyyy-mm-dd format for the input field

    if (collectedDate) {
      const [year, month, day] = collectedDate.split("-");
      const formatted = `${day}-${month}-${year}`;
      setFormattedDate(formatted); // Store the formatted date
    }
  };

  const handleSearch = () => {
    if (formattedDate) {
      navigate(`/day-details?date=${formattedDate}`);
    } else {
      toast.error("Please select a date!");
    }
  };

  return (
    <div className="search-box-section">
      <div className="search-box">
        <h4 className="search-box-heading">Search Your Previous Expenses</h4>
        <p className="enter-date-prompt">Enter date below</p>
        <input
          type="date"
          onChange={handleDate}
          value={rawDate}
          className="date-field"
        />
        <div className="search-btn-div">
          <button onClick={handleSearch} className="search-btn">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBoxSection;
