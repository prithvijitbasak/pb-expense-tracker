import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import logo from "../../images/exp-favicon.png";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { IoIosAnalytics } from "react-icons/io";
import { useAuth } from "../context/AuthContext";
import { TbReportAnalytics } from "react-icons/tb";

const Sidebar = (props) => {
  const { isOpen, handleCloseArrowClick } = props;
  const { user, loading, logout } = useAuth();

  // Show shimmer while loading user data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg font-medium">Loading profile...</p>
      </div>
    );
  }

  //  If not loading but user data missing (e.g. not logged in)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No user data found. Please log in again.
      </div>
    );
  }

  return (
    <>
      <div
        className={`p-2 fixed bg-[var(--top-color)] h-[100%] overflow-hidden ${
          isOpen ? "w-[250px]" : "w-[70px]"
        } left-0 top-0 transition-[width] duration-300 ease-in-out`}
      >
        {
          <FaArrowLeftLong
            className={`absolute top-4 right-3.5 cursor-pointer text-white ${
              !isOpen ? "rotate-180" : ""
            }`}
            onClick={handleCloseArrowClick}
          />
        }
        <Link
          className={`flex gap-x-3 pt-10 items-center ${
            !isOpen ? "justify-center" : "justify-start "
          }`}
          to={"/"}
        >
          <div>
            <img src={logo} className="w-[100%] block" />
          </div>
          <h2
            className={`text-white font-bold text-lg text-wrap text-center ${
              !isOpen ? "hidden" : ""
            }`}
          >
            PB Expense Tracker
          </h2>
        </Link>
        <div className="pt-5 flex flex-col gap-y-4">
          <Link
            className={`text-white text-lg items-center flex gap-x-4 py-2 ${
              !isOpen ? "justify-center" : "justify-left"
            }`}
            to={`/${user.username}`}
          >
            <MdOutlineSpaceDashboard className="inline" />{" "}
            <span className={`${!isOpen ? "hidden" : ""}`}>Dashboard</span>
          </Link>
          <Link
            className={`text-white text-lg items-center flex gap-x-4 py-2 ${
              !isOpen ? "justify-center" : "justify-left"
            }`}
            to={`/${user.username}/analytics`}
          >
            <IoIosAnalytics className="inline" />{" "}
            <span className={`${!isOpen ? "hidden" : ""}`}>Analytics</span>
          </Link>
          <Link
            className={`text-white text-lg items-center flex gap-x-4 py-2 ${
              !isOpen ? "justify-center" : "justify-left"
            }`}
            to={`/${user.username}/add-expense`}
          >
            <FaCirclePlus className="inline" />{" "}
            <span className={`${!isOpen ? "hidden" : ""}`}>Add Expense</span>
          </Link>
          <Link
            className={`text-white text-lg items-center flex gap-x-4 py-2 ${
              !isOpen ? "justify-center" : "justify-left"
            }`}
            to={`/${user.username}/reports`}
          >
            <TbReportAnalytics  className="inline" />{" "}
            <span className={`${!isOpen ? "hidden" : ""}`}>Reports</span>
          </Link>
          <p
            className={`text-white text-lg items-center flex gap-x-4 py-2 cursor-pointer ${
              !isOpen ? "justify-center" : "justify-left"
            }`}
            onClick={() => {
              logout();
            }}
          >
            <FiLogOut className="inline" />{" "}
            <span className={`${!isOpen ? "hidden" : ""}`}>Logout</span>
          </p>
        </div>
        <div
          className={`absolute bottom-0 pb-7 text-center ${
            !isOpen ? "left-1/2 transform -translate-x-1/2" : ""
          }`}
        >
          <Link
            to={`/${user.username}/profile`}
            className="text-white text-lg items-center flex gap-x-4"
          >
            <FaUserCircle className="text-white" />
            <span className={`${!isOpen ? "hidden" : ""}`}>
              {user.fullName}
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
