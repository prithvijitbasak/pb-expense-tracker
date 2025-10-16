import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaCirclePlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import logo from "../../images/exp-favicon.png";
import { FiLogOut } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import { logout } from "../utils/auth";

const Sidebar = (props) => {
  const { isOpen, handleCloseArrowClick } = props;

  return (
    <>
      <div
        className={`p-2 fixed bg-[var(--top-color)] h-[100%] overflow-hidden ${
          isOpen ? "w-[250px]" : "w-[80px]"
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
        <Link className="flex gap-x-3 justify-start pt-10 items-center" to={"/"}>
          <div>
            <img src={logo} className="w-[100%] block" />
          </div>
          <h2 className={`text-white font-bold text-lg text-wrap text-center ${!isOpen? "hidden" : ""}`}>
            PB Expense Tracker
          </h2>
        </Link>
        <div className="pt-5 flex flex-col gap-y-4">
          <Link
            className="text-white text-lg items-center flex gap-x-4 py-2"
            to={"/"}
          >
            <MdOutlineSpaceDashboard className="inline" />{" "}
            <span className={`${!isOpen? "hidden" : ""}`}>Dashboard</span>
          </Link>
          <Link
            className="text-white text-lg items-center flex gap-x-4 py-2"
            to={"/add-expense"}
          >
            <FaCirclePlus className="inline" />{" "}
            <span className={`${!isOpen? "hidden" : ""}`}>Add Expense</span>
          </Link>
          <p
            className="text-white text-lg items-center flex gap-x-4 py-2 cursor-pointer"
            to={"/add-expense"}
            onClick={() => {
              logout();
            }}
          >
            <FiLogOut className="inline" /> <span className={`${!isOpen? "hidden" : ""}`}>Logout</span>
          </p>
        </div>
        <div className="fixed bottom-0 pb-7 text-center">
          <Link
            to={"/profile"}
            className="text-white text-lg items-center flex gap-x-4"
          >
            <FaUserCircle className="text-white" />
            <span className={`${!isOpen? "hidden" : ""}`}>Profile</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
