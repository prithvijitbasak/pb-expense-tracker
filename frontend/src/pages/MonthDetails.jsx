import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const MonthDetails = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const dayArray = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const [startingDay, setStartingDay] = useState(0);
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  const dayOfTheFirstDate = () => {
    const date = new Date();
    const monthName = searchParams.get("month"); // Get the month name from query params
    const monthNumber = getMonthNumber(monthName); // Convert month name to month number
    date.setMonth(monthNumber - 1); // Set the month in date (months are 0-indexed in JavaScript)

    date.setDate(1);
    const dayOfTheWeek = date.getDay();
    console.log("this is the day of the week number: ", dayOfTheWeek);
    setStartingDay(dayOfTheWeek);
    const lastDayOfMonth = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    setDaysInMonth(lastDayOfMonth);
    console.log(dayArray[dayOfTheWeek]);
  };

  // Function to convert month name to month number
  const getMonthNumber = (monthName) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months.indexOf(monthName) + 1; // Adding 1 to match JavaScript's 0-based indexing for months
  };

  useEffect(() => {
    dayOfTheFirstDate();
  }, [month, year]); // Added dependencies

  return (
    <>
      <section className="calendar-table">
        <div className="container">
          <div className="month-header">
            <h1>
              Details of Month - {month}, {year}
            </h1>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {dayArray.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 3, 4].map((row) => (
                  <tr key={row}>
                    {dayArray.map((day, index) => {
                      const date = row * 7 + index - startingDay + 1;
                      const isToday =
                        date === currentDate.getDate() &&
                        currentDate.getMonth() + 1 === getMonthNumber(month) &&
                        currentDate.getFullYear().toString() === year;
                      return (
                        <td
                          key={index}
                          style={{
                            backgroundColor: isToday ? "#00ffff" : "inherit",
                          }}
                        >
                          {date > 0 && date <= daysInMonth ? (
                            <Link to="/month-details/day-details">{date}</Link>
                          ) : (
                            ""
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
};

export default MonthDetails;
