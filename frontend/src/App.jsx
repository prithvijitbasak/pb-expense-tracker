import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import React, { Suspense } from "react";
import MonthDetails from "./pages/day-month-details-page/MonthDetails";
import DayDetails from "./pages/day-month-details-page/DayDetails";
import YearDetails from "./pages/YearDetails";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./components/AddExpense";
import Login from "./pages/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import Register from "./pages/Register";
import MainLayout from "./layouts/MainLayout";
import PublicLayout from "./layouts/PublicLayout";
import Analytics from "./pages/analytics/Analytics";
import ErrorPage from "./pages/ErrorPage";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";

const App = () => {
  const { user, loading, isLogin } = useAuth(); // ✅ Now hook is used inside component

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // calling the profile page using lazy loading to improve performance and reduce initial bundle size
  const Profile = React.lazy(() => {
    return import("./pages/Profile");
  });

  const router = createBrowserRouter([
    {
      element: <MainLayout />,
      children: [
        {
          element: <ProtectedRoute />,
          children: [
            {
              path: "/:username",
              children: [
                { index: true, element: <Dashboard /> },
                {
                  path: "profile",
                  element: (
                    <Suspense fallback={<div>Loading...</div>}>
                      <Profile />
                    </Suspense>
                  ),
                },
                { path: "year-details", element: <YearDetails /> },
                { path: "add-expense", element: <AddExpense /> },
                { path: "day-details", element: <DayDetails /> },
                { path: "month-details", element: <MonthDetails /> },
                { path: "analytics", element: <Analytics /> },
              ],
            },

            // these routes are direct children (not nested under username)
          ],
        },
      ],
    },

    {
      element: <PublicLayout />,
      children: [
        { path: "/login", element: <Login /> },
        { path: "/register", element: <Register /> },
        {
          path: "/",
          element: <HomePage />,
        },
      ],
    },
    {
      path: "/404-error",
      element: <ErrorPage />,
    },
    {
      path: "/:username/*",
      element: <ErrorPage />,
    },
  ]);

  // ✅ This key ensures router rebuilds when user changes
  return <RouterProvider key={user?.username || "guest"} router={router} />;
};

export default App;
