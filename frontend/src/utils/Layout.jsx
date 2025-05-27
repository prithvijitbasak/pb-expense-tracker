import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <>
      <Outlet />
      <Footer className=""/>
    </>
  );
};

export default Layout;
