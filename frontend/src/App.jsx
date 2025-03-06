import { BrowserRouter, Routes, Route } from "react-router-dom";
import MonthDetails from "./pages/MonthDetails";
import DayDetails from "./pages/DayDetails";
import YearDetails from "./pages/YearDetails";
import Dashboard from "./pages/Dashboard";
// import Login from "./components/Login";
import AddExpenseDetailsPopUp from "./components/AddExpenseDetailsPopUp";
import Login from "./components/Login";

const App = () => {
  return (
    // <h1>testing</h1>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/year-details" element={<YearDetails />} />
        {/* Custom route for MonthDetails */}
        <Route path="/month-details" element={<MonthDetails />} />
        {/* Custom route for DayDetails under MonthDetails  */}
        <Route
          path="/month-details-:monthName-:year/day-details"
          element={<DayDetails />}
        />
        <Route
          path="/add-expense-pop-up-details"
          element={<AddExpenseDetailsPopUp />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route path="*" element={<div>No matching route</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
