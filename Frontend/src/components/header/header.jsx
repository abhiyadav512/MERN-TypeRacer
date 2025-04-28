import React, {  useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import ThemeToggle from "./ThemeToggle";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getIsUserAuth, logout } from "../../store/Slice/authSlice"; // Assuming you have logout action
import { getProfile } from "../../store/Slice/profileSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate
  const isAuthUser = useSelector(getIsUserAuth);
  const { profile } = useSelector(getProfile);
  // console.log(profile.username);
  const [menuOpen, setMenuOpen] = useState(false); // For mobile menu
 
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    dispatch(logout()); // Dispatch logout action to logout the user
    setMenuOpen(false);
    navigate("/login"); // Redirect user to login page after logout
  };


  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-lightBackground dark:bg-darkBackground transition-colors duration-300">
      {/* Logo */}
      <Link to="/">
        <img src="/TypeRaceLogo.svg" alt="Logo" className="h-7 w-7 object-contain dark:invert" />
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        <Link
          to={`/profile/${profile.username}`}
          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <img src={profile.profilePicture} alt="PrfileIMG" className="h-10 w-10 object-contain rounded-full" />
        </Link>
        {isAuthUser ? (
          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Login
          </Link>
        )}
        <div className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="flex md:hidden items-center">
        <button onClick={handleMenuToggle} className="focus:outline-none">
          {menuOpen ? (
            <IoMdClose
              size={24}
              className="text-lightText dark:text-darkText"
            />
          ) : (
            <IoMdMenu size={24} className="text-lightText dark:text-darkText" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-14 left-0 w-full bg-lightBackground dark:bg-darkBackground transition-colors duration-300 md:hidden z-50 shadow-lg">
          <div className="flex flex-col items-center space-y-4 py-4">
            <Link
              to={`/profile/${profile.username}`}
              className="text-lightText dark:text-darkText hover:text-blue-500"
              onClick={() => setMenuOpen(false)} // Close mobile menu after clicking Profile
            >
              Profile
            </Link>
            
            {isAuthUser ? (
              <button
                onClick={handleLogout}
                className="block px-4 py-2  text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)} // Close mobile menu after clicking Login
                className="block px-4 py-2  text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Login
              </Link>
            )}

            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
