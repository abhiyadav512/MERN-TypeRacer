import React, { useEffect, useState } from "react";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getError,
  getIsUserAuth,
  getStatus,
  loginUser,
} from "../../store/Slice/authSlice";

import GoogleLoginButton from "./GoogleLoginButton";

const Login = () => {
  const dispatch = useDispatch();
  const error = useSelector(getError);
  const status = useSelector(getStatus);
  const isAuthUser = useSelector(getIsUserAuth);

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [userRegisterData, setUserRegisterData] = useState({
    email: "",
    password: "",
  });

  const togglePassVisibility = (e) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setUserRegisterData({
      ...userRegisterData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(userRegisterData));
  };

  // Autofill guest user credentials
  const handleGuestLogin = () => {
    setUserRegisterData({
      email: "guests123@gmail.com",
      password: "guests123",
    });
  };

  useEffect(() => {
    if (isAuthUser) {
      navigate("/");
    }
  }, [isAuthUser, navigate]);

  return (
    <div className="flex items-center justify-center bg-lightBackground dark:bg-darkBackground transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 space-y-4 dark:bg-darkBackground rounded-lg transition-colors duration-300"
      >
        <div className="text-center">
          {/* <img
            src="/path/to/your/logo.png"
            alt="Logo"
            className="h-14 mx-auto"
          /> */}
          <h1 className="text-2xl font-bold text-lightText dark:text-darkText mt-4 transition-colors duration-300">
            Login
          </h1>
        </div>

        {/* Email */}
        <div className="relative">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-lightText dark:text-darkText transition-colors duration-300"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={userRegisterData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="mt-1 w-full px-4 py-1.5 bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText border border-gray-300 dark:border-gray-700 rounded transition-colors duration-300"
          />
          {typeof error?.message === "string" && error.message.includes("User not found") && (
            <p className="text-red-500 text-sm mt-2">
              {error.message}. Please try again.
            </p>
          )}
          
          {typeof error?.message === "string" && error.message.includes("Invalid Password") && (
            <p className="text-red-500 text-sm mt-2">
              {error.message}. Please try again.
            </p>
          )}

        </div>

        {/* Password */}
        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-lightText dark:text-darkText transition-colors duration-300"
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            value={userRegisterData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="mt-1 w-full px-4 py-1.5 bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText border border-gray-300 dark:border-gray-700 rounded transition-colors duration-300"
          />
          <button
            onClick={togglePassVisibility}
            type="button"
            className="transition-colors duration-300 absolute top-9 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
          >
            {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
          </button>

          {/* Error Message for Incorrect Password */}
          {error && error.message.includes("Invalid Password") && (
            <p className="text-red-500 text-sm mt-2">
              {error.message}. Please try again.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col w-full gap-2">
          <button
            type="submit"
            disabled={status === "loading"}
            className={`px-4 py-2 text-sm sm:text-base bg-darkBackground dark:bg-lightBackground hover:bg-lightBackground dark:hover:bg-darkBackground text-lightBackground dark:text-darkBackground hover:text-darkBackground dark:hover:text-lightBackground border-2 border-darkBackground dark:border-lightBackground font-semibold rounded-lg transition-colors duration-300 ${status === "loading" ? "opacity-50 cursor-wait" : "opacity-100"
              }`}
          >
            {status === "loading" ? (
              <div className="w-6 h-6 border-t-2 border-b-1 border-lightBackground hover:border-darkBackground dark:border-darkBackground dark:hover:border-lightBackground rounded-full animate-spin mx-auto"></div>
            ) : (
              "Login"
            )}
          </button>

          <GoogleLoginButton status={status} />

          {/* Guest Login Button */}
          <button
            type="button"
            onClick={handleGuestLogin}
            className="mt-2 px-4 py-2 text-sm sm:text-base bg-lightBackground dark:bg-darkBackground text-darkBackground dark:text-lightBackground border border-gray-300 dark:border-gray-700 rounded-lg transition-colors duration-300 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            Login as Guest
          </button>
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="dark:text-lightBackground text-darkBackground hover:underline transition-colors duration-300"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
