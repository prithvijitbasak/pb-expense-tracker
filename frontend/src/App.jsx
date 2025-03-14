import { BrowserRouter, Routes, Route } from "react-router-dom";
import MonthDetails from "./pages/MonthDetails";
import DayDetails from "./pages/DayDetails";
import YearDetails from "./pages/YearDetails";
import Dashboard from "./pages/Dashboard";
// import Login from "./components/Login";
import AddExpenseDetailsPopUp from "./components/AddExpenseDetailsPopUp";
import Login from "./components/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import Register from "./components/Register";
import Profile from "./pages/Profile";

const App = () => {
  return (
    // <h1>testing</h1>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
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
        </Route>
        <Route path="*" element={<div>No matching route</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
