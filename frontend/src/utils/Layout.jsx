import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleCloseArrowClick = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          handleCloseArrowClick={handleCloseArrowClick}
        />
        <div className={`${isSidebarOpen ? "ml-[250px]" : "ml-[80px]"} flex-1 p-2 transition-[margin-left] duration-300`}>
          <Outlet />
        </div>
      </div>
      {/* <Footer className=""/> */}
    </>
  );
};

export default Layout;
