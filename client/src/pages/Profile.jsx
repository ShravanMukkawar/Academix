import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const processMIS = (mis) => {
  const BRANCH_CODES = { "03": "Computer Engineering" };

  const calculateSemester = (admissionYear) => {
    const currentYear = new Date().getFullYear() % 100;
    const yearDiff = currentYear - admissionYear;
    const semester = yearDiff * 2;
    return [2, 4, 6, 8].includes(semester) ? semester.toString() : "2";
  };

  if (!mis || mis.length !== 9) return { branch: "", semester: "" };

  const year = parseInt(mis.substring(2, 4), 10);
  const branchCode = mis.substring(4, 6);

  return {
    branch: BRANCH_CODES[branchCode] || "Unknown Branch",
    semester: calculateSemester(year),
  };
};

const ProfileSection = ({ title, value, icon }) => (
  <motion.div
    className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-xl mb-4 w-full"
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center space-x-3 sm:space-x-4">
      <div className="p-2 sm:p-3 bg-teal-500/10 rounded-full">{icon}</div>
      <div className="flex-1 min-w-0">
        <h3 className="text-teal-400 text-xs sm:text-sm font-medium mb-1">{title}</h3>
        <p className="text-slate-200 text-base sm:text-lg font-semibold truncate">
          {value || "Not Available"}
        </p>
      </div>
    </div>
  </motion.div>
);

const ProfessionalProfile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    mis: "",
    branch: "",
    semester: "",
  });

  useEffect(() => {
    const fetchUserData = async (mis) => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/users/${mis}`);
        console.log(response);
        return response.data.data.name;
      } catch (error) {
        console.error("Failed to fetch user name:", error);
        return "Not Available";
      }
    };

    const loadUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          const misInfo = processMIS(decodedToken.mis);

          const name = await fetchUserData(decodedToken.mis);
          setUserData({
            name,
            email: decodedToken.email,
            mis: decodedToken.mis,
            branch: misInfo.branch,
            semester: misInfo.semester,
          });
          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error processing token or fetching data:", error);
          setIsLoggedIn(false);
        }
      }
    };

    loadUserData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-900 py-6 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-teal-400 mb-2">Student Profile</h1>
          <p className="text-sm sm:text-base text-slate-400">Your Academic Information Dashboard</p>
        </motion.div>

        {isLoggedIn ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-slate-800/50 p-4 sm:p-8 rounded-xl shadow-2xl"
          >
            <div className="grid gap-4 sm:gap-6">
              <ProfileSection
                title="Full Name"
                value={userData.name}
                icon={
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                }
              />

              <ProfileSection
                title="MIS Number"
                value={userData.mis}
                icon={
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                }
              />

              <ProfileSection
                title="Email Address"
                value={userData.email}
                icon={
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                }
              />

              <ProfileSection
                title="Branch"
                value={userData.branch}
                icon={
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                }
              />

              <ProfileSection
                title="Current Semester"
                value={userData.semester}
                icon={
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-teal-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                }
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-slate-400 p-4 sm:p-8"
          >
            Please log in to view your profile information.
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalProfile;

