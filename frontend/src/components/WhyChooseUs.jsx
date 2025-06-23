import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  TimerReset,
  SearchCheck,
  Users,
  Brain,
} from "lucide-react";

const reasons = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
    title: "Secure & Verified",
    desc: "All complaints and data are encrypted and verified to prevent misuse.",
  },
  {
    icon: <TimerReset className="w-8 h-8 text-green-600" />,
    title: "Quick Resolution",
    desc: "Smart routing & auto-priority ensures your complaints are resolved quickly.",
  },
  {
    icon: <SearchCheck className="w-8 h-8 text-purple-600" />,
    title: "Transparent System",
    desc: "Track complaint history, resolution proof & trust scores openly.",
  },
  {
    icon: <Users className="w-8 h-8 text-yellow-600" />,
    title: "Community First",
    desc: "Built for citizens, societies & admins to collaborate and improve.",
  },
  {
    icon: <Brain className="w-8 h-8 text-red-600" />,
    title: "AI-Powered Categorization",
    desc: "Our AI checks if your uploaded image is original, analyzes title & description, and auto-categorizes the complaint with the right priority.",
  },
];

export default function WhyChooseUs() {
  return (
    <div className="bg-gray-50 py-16 px-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Why Choose Our Complaint System?
      </h2>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {reasons.map((reason, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-md p-6 border hover:shadow-xl transition"
          >
            <div className="flex items-center gap-4 mb-3">
              {reason.icon}
              <h3 className="text-xl font-semibold">{reason.title}</h3>
            </div>
            <p className="text-gray-600">{reason.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
