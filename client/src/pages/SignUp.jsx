import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    email: "", name: "", password: "", passwordConfirm: "", mis: "", profilePic: ""
  });

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadSuccess = (url) => {
    setData(prev => ({ ...prev, profilePic: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/register`;
    try {
      const response = await axios.post(URL, {
        email: data.email,
        name: data.name,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
        mis: data.mis,
        profilePic: data.profilePic
      }, { withCredentials: true });
      
      if (response.data.status === "success") {
        toast.success("Registration successful");
        localStorage.setItem('token', response.data.token);
        setTimeout(() => {
          setData({ email: "", password: "", passwordConfirm: "", mis: "", name: "", profilePic: "" });
          navigate('/verify-otp');
        }, 1000);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during registration.");
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
          Register
        </motion.h1>

        {[
          { label: "Name", name: "name", type: "text" },
          { label: "Email", name: "email", type: "email" },
          { label: "MIS", name: "mis", type: "text" }
        ].map((field, index) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="mt-3"
          >
            <label className={labelClass} htmlFor={field.name}>{field.label}</label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              className={inputClass}
              required
              value={data[field.name]}
              onChange={handleOnChange}
            />
          </motion.div>
        ))}

        {[
          { label: "Password", name: "password", show: showPassword, setShow: setShowPassword },
          { label: "Confirm Password", name: "passwordConfirm", show: showConfirmPassword, setShow: setShowConfirmPassword }
        ].map((field, index) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="mt-3"
          >
            <div className='flex justify-between items-center'>
              <label className={labelClass} htmlFor={field.name}>{field.label}</label>
              <button
                type="button"
                onClick={() => field.setShow(!field.show)}
                className="text-xs text-[#0094c6]/80 flex items-center hover:text-[#0094c6] transition-colors"
              >
                {field.show ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
                <span className='ml-1'>{field.show ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <input
              type={field.show ? 'text' : 'password'}
              id={field.name}
              name={field.name}
              className={inputClass}
              required
              value={data[field.name]}
              onChange={handleOnChange}
            />
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-3"
        >
          <label className={labelClass}>Profile Photo</label>
          <div className="mt-1 p-2 border border-[#0094c6]/30 rounded-lg h-24 flex items-center justify-center bg-[#001233]">
            <ImageUploader onUploadSuccess={handleUploadSuccess} />
          </div>
        </motion.div>

        <motion.button
          type="submit"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-[#0094c6] mt-5 rounded-lg p-2.5 text-white text-base font-semibold hover:bg-[#0094c6]/80 transition duration-300 shadow-lg hover:shadow-xl"
        >
          Register
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className='flex justify-between items-center mt-4'
        >
          <span className='text-sm text-[#0094c6]/80'>Already have an account?</span>
          <button
            type="button"
            onClick={() => navigate('/signin')}
            className='text-sm hover:text-[#0094c6] text-[#0094c6]/80 font-medium transition-colors'
          >
            Sign In
          </button>
        </motion.div>
      </motion.form>
    </div>
  );
};

export default SignUp;