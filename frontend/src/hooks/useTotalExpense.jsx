import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../utils/auth";

// type: 'day', 'month', or 'year'
const useTotalExpense = (type, values = {}) => {
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buildURL = () => {
      if (type === "day" && values.date) {
        return `${API}/api/expenses/get-expenses-by-date?date=${values.date}`;
      }
      if (type === "month" && values.month && values.year) {
        return `${API}/api/expenses/get-expenses-by-month?month=${values.month}&year=${values.year}`;
      }
      if (type === "year" && values.year) {
        return `${API}/api/expenses/get-expenses-by-year?year=${values.year}`;
      }
      return null;
    };

    const fetchTotal = async () => {
      const url = buildURL();
      if (!url) {
        setError("Missing required parameters.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setTotal(response.data.totalExpenses || 0);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch total expense");
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTotal();
  }, [type, JSON.stringify(values)]); // watch both type and values

  return { total, loading, error };
};

export default useTotalExpense;
