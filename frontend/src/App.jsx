import { BrowserRouter, Routes, Route } from "react-router-dom";
import MonthDetails from "./pages/day-month-details-page/MonthDetails";
import DayDetails from "./pages/day-month-details-page/DayDetails";
import YearDetails from "./pages/YearDetails";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./components/AddExpense";
import Login from "./components/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import Register from "./components/Register";
import Profile from "./pages/Profile";
import Layout from "./utils/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes with Footer */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/year-details" element={<YearDetails />} />
            <Route path="/add-expense" element={<AddExpense />} />
          </Route>
          <Route path="/day-details" element={<DayDetails />} />
          <Route path="/month-details" element={<MonthDetails />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<div>No matching route</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
