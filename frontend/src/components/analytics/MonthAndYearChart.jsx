import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { API } from "../../utils/auth";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthAndYearChart = ({ typeOfChart, month, year }) => {
  const [expenseData, setExpenseData] = useState([]);

  const fetchURL =
    typeOfChart === "month"
      ? `${API}/api/expenses/analytics/month?month=${month}&year=${year}`
      : `${API}/api/expenses/analytics/year?&year=${year}`;

  // Fetch data from API
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        
        const response = await fetch(fetchURL, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setExpenseData(data); // now data is an array
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, [typeOfChart, month, year]);

  if (!expenseData.length) {
    return <p>Loading...</p>;
  }

  // Extract categories and values dynamically
  const labels = expenseData.map((item) => item.category);
  const values = expenseData.map((item) => item.totalAmount);

  // Chart.js data
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Expenses",
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.6)", // bar color
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart.js options
  const options = {
    responsive: true,
    plugins: {
      legend: { display: true }, // hide legend since we only have one dataset
      title: {
        display: true,
        text: "Expenses by Category",
        position: "bottom",
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Categories" },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: "Amount (₹)" },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default MonthAndYearChart;
