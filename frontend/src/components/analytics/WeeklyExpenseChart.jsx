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
import CustomTooltip from "./CustomTooltip";

const WeeklyExpenseChart = () => {
  const [last7DaysData, setLast7DaysData] = useState([]);

  useEffect(() => {
    const fetchLast7DaysData = async () => {
      try {
        const res = await fetch(`${API}/api/expenses/analytics/last7days`, {
          method: "GET",
          credentials: "include",
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
  }, [API]); // ✅ Runs only once when component mounts

  const CATEGORY_COLORS = {
    Savings: "#2e7d32", // Green – positive / savings
    Food: "#f57c00", // Orange – daily consumption
    Transport: "#1976d2", // Blue – movement / travel
    Grocery: "#388e3c", // Green – essentials
    Shopping: "#8e24aa", // Purple – discretionary spending
    Bill: "#d32f2f", // Red – obligations / payments
    Medicine: "#0097a7", // Teal – health / care
    Entertainment: "#fbc02d", // Yellow – fun / leisure
    Other: "#616161", // Grey – uncategorized
  };

  return (
    <div className="mx-4 md:mx-10 my-8 bg-white shadow-xl rounded-3xl p-6 md:p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[#4caf50]">
          Weekly Expense Overview
        </h2>
        <span className="text-sm text-gray-400">Last 7 days</span>
      </div>

      <div className="w-full h-[320px] md:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={last7DaysData} barSize={36} barGap={4}>
            <CartesianGrid
              strokeDasharray="3 6"
              stroke="#7d7c7c"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={false}
            />

            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} tickLine={false} />

            <Tooltip
              cursor={{ fill: "rgba(76, 175, 80, 0.08)" }}
              content={<CustomTooltip />}
            />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: "12px", paddingBottom: "10px" }}
            />

            {/* Bars generated with unique category colors */}
            {Object.entries(CATEGORY_COLORS).map(([category, color], index) => (
              <Bar
                key={category}
                dataKey={category}
                stackId="a"
                fill={color}
                radius={index === 0 ? [6, 6, 0, 0] : 0}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyExpenseChart;
