import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API } from "../utils/auth";

const YearDetails = () => {
  const [searchParams] = useSearchParams();
  const year = searchParams.get("year"); // getting 'year' query param from URL

  const monthArray = [];
  for (let month = 0; month < 12; month++) {
    const dateInMonth = new Date(year, month, 2);
    const monthName = dateInMonth.toLocaleString("default", { month: "long" });
    monthArray.push({ name: monthName, index: month });
  }

  console.log(monthArray);

  const [monthlyExpenses, setMonthlyExpenses] = useState({});

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          `${API}/api/expenses/get-expenses-by-year?year=${year}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Set the monthlyExpenses directly from API response
          setMonthlyExpenses(data.monthlyExpenses || {});
        } else {
          console.error("Failed to fetch expenses for the year");
          setMonthlyExpenses({});
        }
      } catch (error) {
        console.error("Error while fetching expenses:", error);
        setMonthlyExpenses({});
      }
    };

    fetchExpenses();
  }, [year]);

  return (
    <>
      <section className="year-wrapper">
        <div className="container">
          <div className="year font-bold text-2xl">Year - {year}</div>
        </div>
      </section>

      <section className="months-wrapper">
        <div className="container">
          <div className="month-grid">
            {monthArray.map((monthData) => {
              const monthFormatted = (monthData.index + 1)
                .toString()
                .padStart(2, "0");

              return (
                <Link
                  to={`/month-details?month=${monthFormatted}&year=${year}`}
                  key={monthData.index}
                >
                  <div className="month-link">
                    <p className="text-2xl font-bold pb-3">{monthData.name}</p>
                    <p className="text">
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
