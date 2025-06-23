import React from "react";
import { Link } from "react-router-dom";


const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-[#f5f8ff] to-[#fefefe] py-16 px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        {/* LEFT TEXT CONTENT */}
        <div className="max-w-xl">
          <p className="text-sm text-blue-600 font-medium mb-3">
            🏛 Digital Government Initiative
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Your Voice, <span className="text-blue-600">Our Priority</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            File complaints, track progress, and engage with government services
            through our secure, transparent digital platform. Making governance
            accessible to every citizen.
          </p>
          <div className="flex gap-4 flex-wrap">
<Link to={"/report"}>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              File Your Complaint →
            </button>
</Link>
            <button className="border border-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:border-gray-500">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-10 flex-wrap">
            <div>
              <p className="text-xl font-bold text-gray-900">10,000+</p>
              <p className="text-sm text-gray-600">Complaints Filed</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">24hrs</p>
              <p className="text-sm text-gray-600">Avg. Response</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">95%</p>
              <p className="text-sm text-gray-600">Resolution Rate</p>
            </div>
          </div>
        </div>

        {/* RIGHT CARD UI */}
        <div className="bg-blue-50 p-6 rounded-3xl shadow-md space-y-4 w-full max-w-md">
          <div className="bg-white rounded-xl px-4 py-3 shadow flex flex-col">
            <span className="text-sm font-semibold text-green-600">
              ● Complaint Submitted
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Your complaint has been received and assigned ID: #GV2024001
            </span>
          </div>
          <div className="bg-white rounded-xl px-4 py-3 shadow flex flex-col">
            <span className="text-sm font-semibold text-blue-600">
              ● Under Review
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Department reviewing your case. Expected resolution: 3–5 days
            </span>
          </div>
          <div className="bg-white rounded-xl px-4 py-3 shadow flex flex-col">
            <span className="text-sm font-semibold text-orange-500">
              ● Action Taken
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Resolution implemented. Feedback requested for case closure.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
