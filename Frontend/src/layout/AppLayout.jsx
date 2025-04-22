import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header/header";
import { useDispatch } from "react-redux";
import Footer from "../components/Footer";
import { setTheme } from "../store/Slice/themeSlice";

const AppLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    dispatch(setTheme(savedTheme));
  }, [dispatch]);
  return (
    <div className=" min-h-screen bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText transition-colors duration-300">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
