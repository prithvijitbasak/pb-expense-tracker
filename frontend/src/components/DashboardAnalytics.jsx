import { useEffect, useState } from "react";
import MonthChart from "./MonthChart";
import YearChart from "./YearChart";

const DashboardAnalytics = () => {
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);

  useEffect(() => {
    const currYear = new Date().getFullYear();
    setYear(currYear);
    const currMonth = new Date().getMonth() + 1;
    setMonth(currMonth);
  }, []);

  return (
    <div className="flex justify-between pt-12">
      <div className="w-xl">
        <h3 className="bold text-center pb-4 underline underline-offset-2">
          Expenses of this month
        </h3>
        {month &&
          year && ( // ✅ conditional render
            <MonthChart month={month} year={year} />
          )}
      </div>
      <div className="w-xl">
        <h3 className="bold text-center pb-4 underline underline-offset-2">
          Expenses of this year
        </h3>
        {year && ( // ✅ conditional render
            <YearChart year={year} />
          )}
      </div>
    </div>
  );
};

export default DashboardAnalytics;
