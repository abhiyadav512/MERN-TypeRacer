import React from "react";
import { Link } from "react-router-dom";
import {

  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and Description */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <Link to="/">
            <img
              src="/TypeRaceLogo.svg"
              alt="Logo"
              className="h-8 w-8 object-contain dark:invert"
            />
          </Link>
          <p className="text-center md:text-left text-sm">
            TypeRacer – Speed. Accuracy. Victory.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <Link
            to="/"
            className="hover:underline transition-colors duration-300"
          >
            Home
          </Link>

        </div>

        {/* Social Media Links */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/abhi_yadav512"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/abhishek-yadav-407331311"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 "
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="  text-center py-4">
        <p className="text-sm">
          © {new Date().getFullYear()} TypeRacer. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
