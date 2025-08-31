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

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ExpenseBarChart = () => {
  const expenseData = {
    Savings: 67,
    Food: 98,
    Transport: 120,
    Grocery: 200,
    Bill: 150,
    Medicine: 75,
    Shopping: 300,
    Entertainment: 180,
    Other: 90,
  };

  // Extract categories and values
  const labels = Object.keys(expenseData);
  const values = Object.values(expenseData);

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
      legend: { display: false }, // hide legend since we only have one dataset
      title: {
        display: true,
        text: "Expenses by Category",
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

export default ExpenseBarChart;
