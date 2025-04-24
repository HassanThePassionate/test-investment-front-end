import Header from "@/components/header/Header";
import { Outlet } from "react-router-dom";
import Footer from "../Footer";
const Layout = () => {
  return (
    <>
      <Header />
      <div className='py-[40px] px-6 sm:px-12 min-w-[320px] mb-12 max-w-[1440px] my-0 mx-auto w-full'>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
