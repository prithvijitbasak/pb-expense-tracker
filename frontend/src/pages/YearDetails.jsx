import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { API } from "../utils/auth";

const YearDetails = () => {
  const [searchParams] = useSearchParams();
  const year = searchParams.get("year"); // Getting 'year' from the URL query parameter
  const monthArray = []; // An array to store all months of the year

  // Loop to create month data
  for (let month = 0; month < 12; month++) {
    const dateInMonth = new Date(year, month, 1); // Create a date for each month (1st day)
    const monthName = dateInMonth.toLocaleString("default", { month: "long" }); // Get full month name like January, February
    monthArray.push({ name: monthName, index: month }); // Store month name and month index (0 to 11)
  }

  const [monthlyExpenses, setMonthlyExpenses] = useState({});

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");
      let tempExpenses = {};

      for (let month = 0; month < 12; month++) {
        const monthFormatted = month.toString().padStart(2, "0");

        try {
          const response = await fetch(
            `${API}/api/expenses/get-expenses-by-month?month=${monthFormatted}&year=${year}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            tempExpenses[monthFormatted] = data.totalExpenses || 0;
          } else {
            tempExpenses[monthFormatted] = 0;
          }
        } catch (error) {
          console.error(error);
          tempExpenses[monthFormatted] = 0;
        }
      }

      setMonthlyExpenses(tempExpenses);
    };

    fetchExpenses();
  }, [year]);

  console.log(monthArray);

  return (
    <>
      <section className="year-wrapper">
        <div className="container">
          <div className="year">Year - {year}</div>
        </div>
      </section>
      <section className="months-wrapper">
        <div className="container">
          <div className="month-grid">
            {monthArray.map((monthData) => {
              const monthFormatted = monthData.index
                .toString()
                .padStart(2, "0");

              return (
                <Link
                  to={`/month-details?month=${monthFormatted}&year=${year}`}
                  key={monthData.index}
                >
                  <div className="month-link">
                    <p>{monthData.name}</p>
                    <br />
                    <p>
                      Total = {monthlyExpenses[monthFormatted] ?? "Loading..."}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default YearDetails;
