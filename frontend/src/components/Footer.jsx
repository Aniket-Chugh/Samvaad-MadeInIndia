import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">

        <div>
          <h2 className="text-lg font-semibold mb-2">About</h2>
          <p className="text-sm text-gray-100">
            Samvaad Complaint System helps citizens raise and track complaints easily, making governance more transparent and efficient.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/raise-complaint" className="hover:underline">Raise Complaint</Link></li>
            <li><Link to="/track-status" className="hover:underline">Track Status</Link></li>
            <li><Link to="/admin" className="hover:underline">Admin Login</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Contact</h2>
          <p className="text-sm">
            📧 Email: oneaniket13@gmail.com<br />
          </p>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="text-center text-sm py-3 bg-blue-700">
        &copy; {new Date().getFullYear()} SAMVAAD. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
