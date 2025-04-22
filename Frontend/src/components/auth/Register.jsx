import React, { useState } from "react";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getError, getStatus, registerUser } from "../../store/Slice/authSlice";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const error = useSelector(getError);
  const status = useSelector(getStatus);

  const [userRegisterData, setUserRegisterData] = useState({
    username: "",
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
    
    // Dispatch registration if validation passes
    dispatch(registerUser(userRegisterData)).then((action) => {
      if (action.type === "auth/registerUser/fulfilled") {
        navigate("/login");
      }
    });
  };

  return (
    <div className=" flex items-center justify-center bg-lightBackground dark:bg-darkBackground transition-colors duration-300">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 space-y-4  dark:bg-darkBackground rounded-lg transition-colors duration-300"
      >
        {/* Logo */}
        <div className="text-center">
          <img
            src="/path/to/your/logo.png"
            alt="Logo"
            className="h-14 mx-auto"
          />
          <h1 className="text-2xl font-bold text-lightText dark:text-darkText mt-4 transition-colors duration-300">
            Register
          </h1>
        </div>

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-lightText dark:text-darkText transition-colors duration-300"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            value={userRegisterData.username}
            onChange={handleChange}
            required
            placeholder="Enter your username"
            className="mt-1 w-full px-4 py-1.5 bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText border border-gray-300 dark:border-gray-700 rounded transition-colors duration-300"
          />
          {error?.message === "Username already in use" && (
            <p className="text-red-500 text-sm mt-2">
              {error.message} Please try again.
            </p>
          )}
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
          {error?.message === "Email already in use" && (
            <p className="text-red-500 text-sm mt-2">
              {error.message} Please try again.
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
            className="absolute top-9 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none transition-colors duration-300"
          >
            {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          className={`w-full py-2 bg-darkBackground dark:bg-lightBackground hover:bg-lightBackground dark:hover:bg-darkBackground text-lightBackground dark:text-darkBackground hover:text-darkBackground dark:hover:text-lightBackground border-2 border-darkBackground dark:border-lightBackground font-semibold rounded-lg transition-colors duration-300 ${status === "loading" ? "opacity-50 cursor-wait" : "opacity-100"
            }`}
        >
          {status === "loading" ? (
            <div className="w-6 h-6 border-t-2 border-b-1 border-lightBackground hover:border-darkBackground dark:border-darkBackground dark:hover:border-lightBackground rounded-full animate-spin mx-auto"></div>
          ) : (
            "Register"
          )}
        </button>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="dark:text-lightBackground text-darkBackground hover:underline transition-colors duration-300"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
