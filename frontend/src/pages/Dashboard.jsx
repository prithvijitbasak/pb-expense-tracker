import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import AddExpense from "../components/AddExpense";
import "../assets/styles/Dashboard.css";
import { logout } from "../utils/auth";
import DayDetailsCard from "../components/DayDetailsCard";
import MonthDetailsCard from "../components/MonthDetailsCard";
import YearDetailsCard from "../components/YearDetailsCard";
import WelcomeAddBanner from "../components/WelcomeAddBanner";
import SearchBoxSection from "../components/SearchBoxSection";
import DashBanner from "../components/DashBanner";
import ClockCard from "../components/ClockCard";
import DashboardAnalytics from "../components/DashboardAnalytics";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [isUserImgClicked, setIsUserImgClicked] = useState(false);

  // Refs for tracking the dropdown and button
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // const handleAddExpenseClick = () => {
  //   setShowAddExpense(true);
  // };

  const handleCloseAddExpense = () => {
    setShowAddExpense(false);
  };

  const handleUserImgClicked = () => {
    setIsUserImgClicked((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is outside both dropdown and button, close dropdown
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsUserImgClicked(false);
      }
    };

    if (isUserImgClicked) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserImgClicked]);

  return (
    <>
      

      <DashBanner />

      <div className="mt-7 flex justify-end">
        <ClockCard />
      </div>

      <WelcomeAddBanner />

      {showAddExpense && <AddExpense onClose={handleCloseAddExpense} />}

      <div className="info-section">
        <DayDetailsCard />
        <MonthDetailsCard />
        <YearDetailsCard />
      </div>
      <SearchBoxSection />
      <DashboardAnalytics />
    </>
  );
};

export default Dashboard;
