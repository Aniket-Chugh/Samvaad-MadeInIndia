import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const citizenFeatures = [
  "Scan QR at Worksites",
  "Top Citizens, Testimonials",
  "Election Time Tool (pro)",
  "Report Fake News",
  "Local Discussion Rooms",
];

const govtFeatures = [
  "Auto-Priority Tagging",
  "1-Click Assignment",
  "Complaint Status Tracker",
  "Upload Proof of Resolution",
  "Voice & Text Posts",
  "Auto Notifications",
  "Post Pinning",
  "Analytics Dashboard",
  "Public Trust Scores",
];

export default function FeaturesSection() {
  const [forCitizen, setForCitizen] = useState(true);

  const currentList = forCitizen ? citizenFeatures : govtFeatures;

  return (
    <div className="bg-white flex flex-col md:flex-row p-8 gap-6">
      {/* Left Buttons */}
      <div className="md:w-1/3">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Explore Features</h2>
        <div className="flex flex-col gap-4">
          <button
            className={`py-2 px-4 rounded-md font-semibold ${
              forCitizen ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setForCitizen(true)}
          >
            For Citizens
          </button>
          <button
            className={`py-2 px-4 rounded-md font-semibold ${
              !forCitizen ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setForCitizen(false)}
          >
            For Govt / Flat Owners
          </button>
        </div>
      </div>

      {/* Right Features List with Animation */}
      <div className="md:w-2/3">
        <AnimatePresence mode="wait">
          <motion.div
            key={forCitizen ? "citizen" : "govt"}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {currentList.map((feature, idx) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="bg-gray-100 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md"
              >
                <p className="font-medium text-gray-800">{feature}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
