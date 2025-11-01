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

const WeeklyExpenseChart = () => {
  // Sample Data (You’ll replace this with your API data)
  const data = [
    { day: "Mon", Food: 300, Travel: 150, Shopping: 80, Bills: 100 },
    { day: "Tue", Food: 250, Travel: 200, Shopping: 120, Bills: 90 },
    { day: "Wed", Food: 200, Travel: 180, Shopping: 100, Bills: 110 },
    { day: "Thu", Food: 280, Travel: 170, Shopping: 90, Bills: 130 },
    { day: "Fri", Food: 320, Travel: 190, Shopping: 70, Bills: 120 },
    { day: "Sat", Food: 400, Travel: 250, Shopping: 160, Bills: 100 },
    { day: "Sun", Food: 350, Travel: 200, Shopping: 150, Bills: 130 },
  ];

  return (
    <div className="mx-4 md:mx-10 my-6 bg-white shadow-lg rounded-2xl p-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-[#4caf50] mb-4">
        Weekly Expense Overview
      </h2>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={40}>
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
            <Bar dataKey="Food" stackId="a" fill="#4caf50" />
            <Bar dataKey="Travel" stackId="a" fill="#81c784" />
            <Bar dataKey="Shopping" stackId="a" fill="#a5d6a7" />
            <Bar dataKey="Bills" stackId="a" fill="#c8e6c9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyExpenseChart;
