import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const BRANCH_CODES = {
  "03": "Computer Engineering",
};

const calculateSemester = (admissionYear) => {
  const currentYear = new Date().getFullYear() % 100;
  const yearDiff = currentYear - admissionYear;
  const semester = yearDiff * 2;
  
  return [2, 4, 6].includes(semester) ? semester.toString() : "2";
};

const processMIS = (mis) => {
  if (!mis || mis.length !== 9) return null;
  
  const misString = mis.toString();
  const year = parseInt(misString.substring(2, 4));
  const branchCode = misString.substring(4, 6);
  
  return {
    branch: BRANCH_CODES[branchCode] || "",
    semester: calculateSemester(year)
  };
};

const extractPlaylistId = (url) => {
  const regex = /list=([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const branches = ["Computer Engineering"];
const semesters = ["2", "4", "6"];

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 w-full max-w-md">
      <div className="h-12 w-full bg-gray-700 rounded-lg" />
      <div className="h-12 w-full bg-gray-700 rounded-lg" />
      <div className="h-12 w-full bg-gray-700 rounded-lg" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-700 rounded" />
        <div className="h-4 w-5/6 bg-gray-700 rounded" />
        <div className="h-4 w-4/6 bg-gray-700 rounded" />
      </div>
    </div>
  );
}

function ResourceList({ selectedSubject, filteredResources }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl bg-gray-800 border-gray-700 rounded-2xl shadow-xl border"
    >
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-3xl font-bold text-blue-400">
          Resources for {selectedSubject}
        </h2>
      </div>
      <div className="p-6">
        <div className="h-96 overflow-y-auto pr-4">
          <ul className="space-y-6">
            {filteredResources.map((chapter) => (
              <motion.li
                key={chapter._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-700 rounded-xl p-6"
              >
                <h3 className="font-semibold text-xl mb-4 text-gray-100">
                  {chapter.name}
                </h3>
                <ul className="space-y-3">
                  {chapter.resources.length > 0 ? (
                    chapter.resources.map((res, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center"
                      >
                        <span className="w-3 h-3 bg-blue-400 rounded-full mr-3" />
                        {res.type === "youtube" ? (
                          <Link
                            to={`/yt/${extractPlaylistId(res.link)}?from=${res.from}&to=${res.to}`}
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline text-lg"
                          >
                            {res.type} - {res.linkName || res.link}
                          </Link>
                        ) : (
                          <a
                            href={res.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline text-lg"
                          >
                            {res.type} - {res.linkName || res.link}
                          </a>
                        )}
                      </motion.li>
                    ))
                  ) : (
                    <p className="text-gray-400 text-lg">
                      No resources available for this chapter.
                    </p>
                  )}
                </ul>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

const FetchResourcesPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({ branch: "", semester: "" });
  const [resources, setResources] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchResources = async (branch, semester) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/resources?branch=${branch}&semester=${semester}`
      );
      if (!response.ok) throw new Error("Failed to fetch resources");
      const data = await response.json();
      setResources(data || []);
      const uniqueSubjects = [...new Set(data.map((resource) => resource.subject.name))];
      setSubjects(uniqueSubjects);
    } catch (err) {
      setError("An error occurred while fetching resources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const misInfo = processMIS(decodedToken.mis);
        if (misInfo?.branch && misInfo?.semester) {
          setFormData({
            branch: misInfo.branch,
            semester: misInfo.semester
          });
          fetchResources(misInfo.branch, misInfo.semester);
        }
      } catch (err) {
        console.error("Error processing token:", err);
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { branch, semester } = formData;
    fetchResources(branch, semester);
  };

  const filteredResources = resources.filter(
    (resource) => resource.subject.name === selectedSubject
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#001233] to-[#001845]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl bg-red-500/10 border border-red-500/20 rounded-2xl p-12 text-center backdrop-blur-sm"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-red-400 mb-6"
          >
            Login Required
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-8"
          >
            Please login or sign up to access study resources
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center space-x-6"
          >
            <a 
              href="/signin" 
              className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Login
            </a>
            <a 
              href="/signup" 
              className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Sign Up
            </a>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#001233] to-[#001845]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-800 border-gray-700 rounded-2xl shadow-xl border mb-8"
      >
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-blue-400">Study Resources</h1>
          <p className="mt-2 text-gray-400">
            Select your branch and semester to explore resources
          </p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Branch</label>
              <select
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-gray-700 border-gray-600 text-gray-100 cursor-not-allowed"
                value={formData.branch}
                disabled
              >
                <option value="">Select a Branch</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Semester</label>
              <select
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-gray-700 border-gray-600 text-gray-100 cursor-not-allowed"
                value={formData.semester}
                disabled
              >
                <option value="">Select a Semester</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors font-medium"
            >
              {loading ? "Fetching..." : "Fetch Resources"}
            </motion.button>
          </form>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-4 w-full max-w-md bg-red-900/20 border border-red-900/30 text-red-400 rounded-xl p-4"
          >
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="mt-6">
          <LoadingSkeleton />
        </div>
      )}

      <AnimatePresence>
        {resources.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-6 w-full max-w-md bg-gray-800 border-gray-700 rounded-2xl shadow-xl border"
          >
            <div className="p-6">
              <select
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none bg-gray-700 border-gray-600 text-gray-100"
                onChange={(e) => setSelectedSubject(e.target.value)}
                value={selectedSubject}
              >
                <option value="">Select a Subject</option>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSubject && filteredResources.length > 0 && (
          <div className="mt-6">
            <ResourceList
              selectedSubject={selectedSubject}
              filteredResources={filteredResources}
            />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {resources.length === 0 && !loading && !error && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-6 font-medium text-gray-400"
          >
            No resources found.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FetchResourcesPage;