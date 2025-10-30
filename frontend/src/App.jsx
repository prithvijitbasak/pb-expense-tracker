import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MonthDetails from "./pages/day-month-details-page/MonthDetails";
import DayDetails from "./pages/day-month-details-page/DayDetails";
import YearDetails from "./pages/YearDetails";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./components/AddExpense";
import Login from "./components/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import Register from "./components/Register";
import Profile from "./pages/Profile";
import MainLayout from "./layouts/MainLayout";
import PublicLayout from "./layouts/PublicLayout";
import ErrorPage from "./pages/ErrorPage";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        element: <ProtectedRoute />, // acts as a wrapper for authentication
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "/profile", element: <Profile /> },
          { path: "/year-details", element: <YearDetails /> },
          { path: "/add-expense", element: <AddExpense /> },
          { path: "/day-details", element: <DayDetails /> },
          { path: "/month-details", element: <MonthDetails /> },
        ],
      },
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

// ✅ Use RouterProvider
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
