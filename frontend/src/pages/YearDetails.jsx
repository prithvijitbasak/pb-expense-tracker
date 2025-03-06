import { Link } from "react-router-dom";

const YearDetails = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const monthArray = [];

  for (let month = 0; month < 12; month++) {
    const dateInMonth = new Date(year, month, 1);
    const monthName = dateInMonth.toLocaleString("default", { month: "long" });
    monthArray.push({ name: monthName, index: month });
  }

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
            {monthArray.map((monthData) => (
              <Link
                to={`/month-details?month=${monthData.name}&year=${year}`} // Pass month and year as URL parameters
                key={monthData.index}
              >
                <div className="month-link">
                  <p>{monthData.name}</p>
                  <br />
                  <p>Total = {`X`}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default YearDetails;
