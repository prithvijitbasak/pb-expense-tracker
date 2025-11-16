import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { API } from "../../utils/auth";

const WeeklyExpenseChart = () => {
  const [last7DaysData, setLast7DaysData] = useState([]);
  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL || "http://localhost:5001"; // optional fallback

  useEffect(() => {
    const fetchLast7DaysData = async () => {
      try {
        const res = await fetch(`${API}/api/expenses/analytics/last7days`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setLast7DaysData(data);
        } else {
          console.error("Failed to fetch weekly analytics");
        }
      } catch (error) {
        console.error("Error fetching weekly analytics:", error);
      }
    };

    fetchLast7DaysData();
  }, [API, token]); // ✅ Runs only once when component mounts

  return (
    <div className="mx-4 md:mx-10 my-6 bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-[#4caf50] mb-4">
        Weekly Expense Overview
      </h2>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={last7DaysData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" tick={{ fill: "#6b7280" }} />
            <YAxis tick={{ fill: "#6b7280" }} />
            <Tooltip
              cursor={{ fill: "rgba(76, 175, 80, 0.1)" }}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />

            {/* Each Bar represents a category, stacked together */}
            <Bar dataKey="Savings" stackId="a" fill="#c8e6c9" />
            <Bar dataKey="Food" stackId="a" fill="#4caf50" />
            <Bar dataKey="Transport" stackId="a" fill="#81c784" />
            <Bar dataKey="Grocery" stackId="a" fill="#c8e6c9" />
            <Bar dataKey="Shopping" stackId="a" fill="#a5d6a7" />
            <Bar dataKey="Bill" stackId="a" fill="#c8e6c9" />
            <Bar dataKey="Medicine" stackId="a" fill="#c8e6c9" />
            <Bar dataKey="Entertainment" stackId="a" fill="#c8e6c9" />
            <Bar dataKey="Other" stackId="a" fill="#c8e6c9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyExpenseChart;
