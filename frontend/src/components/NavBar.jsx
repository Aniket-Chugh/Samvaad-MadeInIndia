import React, { useState } from "react";
import { Menu, X, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Features", link: "#features" },
    { name: "About", link: "#about" },
    { name: "Contact", link: "#contact" },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
              <Shield className="text-white w-6 h-6" />
            </div>
            <Link to={"/"}>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Samvaad</h1>
              <p className="text-xs text-gray-500">Complaint System</p>
            </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.link}
                className="text-gray-700 hover:text-blue-600 text-sm font-medium transition"
              >
                {item.name}
              </a>
            ))}
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition"
            >
             Get Started
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button onClick={() => setOpen(!open)} className="text-gray-700">
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white px-4 pb-4 pt-2 space-y-2 border-t border-gray-200 shadow">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.link}
              className="block text-gray-700 hover:text-blue-600 font-medium transition"
              onClick={() => setOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <a
            href="/report"
            className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
            onClick={() => setOpen(false)}
          >
            File Complaint
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
