import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="ml-[250px] flex-1 p-2">
          <Outlet />
        </div>
      </div>
      {/* <Footer className=""/> */}
    </>
  );
};

export default Layout;
