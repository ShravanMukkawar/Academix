import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/userSlice';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/login`;
    try {
      const response = await axios.post(URL, {
        userkey: data.email,
        password: data.password,
      }, {
        withCredentials: true
      });

      if (response.data.status === "success") {
        toast.success("Successful login");
        const userData = response.data.data.user;
        dispatch(loginSuccess(userData));
        localStorage.setItem('token', response.data.token);

        setTimeout(() => {
          setData({ password: "", email: "" });
          navigate('/');
        }, 1000);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error("Please check your email and password");
      console.log(">>", error);
    }
  };

  const inputClass = "mt-1 rounded-lg p-2.5 w-full text-base bg-[#001233] border border-[#0094c6]/30 focus:outline-none focus:ring-2 focus:ring-[#0094c6] transition text-white";
  const labelClass = "text-sm font-medium text-[#0094c6]";

  return (
    <div className='min-h-screen flex justify-center items-center p-4 bg-[#000B1D]'>
      <Toaster position="top-right" reverseOrder={false} />

      <motion.form
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className='w-full max-w-sm rounded-xl bg-[#001233] border border-[#0094c6]/20 shadow-lg flex flex-col p-6'
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='font-sans text-3xl font-bold mb-5 text-center text-[#0094c6]'
        >
          Sign In
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-3"
        >
          <label className={labelClass} htmlFor="email">Email or MIS</label>
          <input
            type="text"
            id="email"
            name="email"
            className={inputClass}
            required
            value={data.email}
            onChange={handleOnChange}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='mt-3'
        >
          <div className='flex justify-between items-center'>
            <label className={labelClass} htmlFor="password">Password</label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-[#0094c6]/80 flex items-center hover:text-[#0094c6] transition-colors"
            >
              {showPassword ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
              <span className='ml-1'>{showPassword ? 'Hide' : 'Show'}</span>
            </button>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            className={inputClass}
            required
            value={data.password}
            onChange={handleOnChange}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className='flex justify-between mt-4'
        >
          <Link to="/signup" className='text-sm hover:text-[#0094c6] text-[#0094c6]/80 font-medium transition-colors'>
            Sign Up
          </Link>
          <Link to="/forgot-password" className='text-sm hover:text-[#0094c6] text-[#0094c6]/80 font-medium transition-colors'>
            Forgot Password?
          </Link>
        </motion.div>

        <motion.button
          type="submit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#0094c6] mt-5 rounded-lg p-2.5 text-white text-base font-semibold hover:bg-[#0094c6]/80 transition duration-300 shadow-lg hover:shadow-xl"
        >
          Sign In
        </motion.button>
      </motion.form>
    </div>
  );
};

export default SignIn;