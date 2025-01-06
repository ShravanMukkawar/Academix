import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from './Avatar';
import { logout } from '../redux/userSlice';

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const user = useSelector((state) => state.user.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
            handleLogout();
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser && Object.keys(parsedUser).length > 0) {
                setIsAuthenticated(true);
            } else {
                handleLogout();
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            handleLogout();
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
    };
    useEffect(() => {
        checkAuth();
    }, [user]); 

    const linkVariants = {
        hover: {
            scale: 1.05,
            color: "#60A5FA",
            transition: { type: 'spring', stiffness: 300 },
        },
        tap: { scale: 0.95 },
    };

    const mobileMenuVariants = {
        closed: { opacity: 0, height: 0 },
        open: { opacity: 1, height: 'auto' },
    };

    const dropdownVariants = {
        closed: { opacity: 0, y: -10, display: 'none' },
        open: { opacity: 1, y: 0, display: 'block' },
    };

    return (
        <nav className="bg-gray-900 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-20">
                    {/* Mobile menu button */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <motion.button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
                            aria-expanded={mobileMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            <motion.svg
                                className="block h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                animate={mobileMenuOpen ? { rotate: 90 } : { rotate: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </motion.svg>
                        </motion.button>
                    </div>

                    {/* Logo */}
                    <div className="flex-1 flex items-center justify-center sm:items-center sm:justify-start">
                        <motion.div
                            className="flex-shrink-0 text-white text-2xl font-bold"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Link to="/" className="flex items-center">
                                <motion.svg
                                    className="h-8 w-8 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                    />
                                </motion.svg>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                                    Academix
                                </span>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                        <motion.div variants={linkVariants} whileHover="hover" whileTap="tap" className="flex items-center">
                            <Link
                                to="/"
                                className="text-gray-300 px-3 py-2 rounded-md text-xl font-medium hover:bg-gray-700 transition-colors duration-200"
                            >
                                Home
                            </Link>
                        </motion.div>
                        <motion.div variants={linkVariants} whileHover="hover" whileTap="tap" className="flex items-center">
                            <Link
                                to="/getr"
                                className="text-gray-300 px-3 py-2 rounded-md text-xl font-medium hover:bg-gray-700 transition-colors duration-200"
                            >
                                Resources
                            </Link>
                        </motion.div>
                        <motion.div variants={linkVariants} whileHover="hover" whileTap="tap" className="flex items-center">
                            <Link
                                to="/calendar"
                                className="text-gray-300 px-3 py-2 rounded-md text-xl font-medium hover:bg-gray-700 transition-colors duration-200"
                            >
                                Calendar
                            </Link>
                        </motion.div>
                        <motion.div variants={linkVariants} whileHover="hover" whileTap="tap" className="flex items-center">
                            <Link
                                to="/sfeedback"
                                className="text-gray-300 px-3 py-2 rounded-md text-xl font-medium hover:bg-gray-700 transition-colors duration-200"
                            >
                                Feedback
                            </Link>
                        </motion.div>
                        <motion.div onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)} >
                        {/* User Section */}
                        {isAuthenticated && user ? (

                            <div className="relative">
                                <div className="flex items-center cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                    <span className="text-gray-300 px-3 py-2 rounded-md text-xl font-medium">
                                        Hello, {user.name.split(' ')[0]}
                                    </span>
                                    <Avatar width={40} height={40} name={user.name} imageUrl={user.profilePic}/>
                                </div>
                                <AnimatePresence>
                                {dropdownOpen && (
                                    <motion.div
                                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800/95 backdrop-blur-sm ring-1 ring-black ring-opacity-5 top-full z-50"
                                         variants={dropdownVariants}
                                        initial="closed"
                                        animate="open"
                                        exit="closed"
                                    >
                                        <a
                                            href="/profile"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors duration-200 text-lg font-medium"
                                        >
                                            Profile
                                        </a>
                                        <a
                                            onClick={handleLogout}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors duration-200 text-lg font-medium"
                                        >
                                            logout
                                        </a>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            </div>
                         
                        ): (
                            <motion.div variants={linkVariants} whileHover="hover" whileTap="tap">
                                <button
                                    onClick={() => navigate('/signin')}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Login
                                </button>
                            </motion.div>
                        )}</motion.div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className="sm:hidden"
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={mobileMenuVariants}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800">
                            <Link
                                to="/"
                                className="text-gray-300 block px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/getr"
                                className="text-gray-300 block px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Resources
                            </Link>
                            <Link
                                to="/calendar"
                                className="text-gray-300 block px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Calendar
                            </Link>
                            <Link
                                to="/sfeedback"
                                className="text-gray-300 block px-3 py-2 rounded-md text-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Feedback
                            </Link>
                        </div>
                        
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;









