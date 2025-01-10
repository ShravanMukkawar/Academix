import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    mis: '',
    password: ''
  });
  const [data, setData] = useState({
    email: "",
    name: "",
    password: "",
    passwordConfirm: "",
    mis: "",
    profilePic: ""
  });

  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (value && !value.endsWith('@coeptech.ac.in')) {
          return 'Email must be from COEP Tech domain (@coeptech.ac.in)';
        }
        break;
      case 'mis':
        if (value && value.length !== 9) {
          return 'MIS must be exactly 9 characters long';
        }
        break;
      case 'password':
        if (value && value.length < 8) {
          return 'Password must be at least 8 characters long';
        }
        break;
      case 'passwordConfirm':
        if (value && value !== data.password) {
          return 'Passwords do not match';
        }
        break;
      default:
        return '';
    }
    return '';
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    
    // Validate the changed field
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));

    // Special case for password confirmation
    if (name === 'password' && data.passwordConfirm) {
      const confirmError = validateField('passwordConfirm', data.passwordConfirm);
      setErrors(prev => ({ ...prev, passwordConfirm: confirmError }));
    }
  };

  const handleUploadSuccess = (url) => {
    setData(prev => ({ ...prev, profilePic: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const formErrors = {
      email: validateField('email', data.email),
      mis: validateField('mis', data.mis),
      password: validateField('password', data.password),
      passwordConfirm: validateField('passwordConfirm', data.passwordConfirm)
    };

    setErrors(formErrors);

    // Check if there are any errors
    if (Object.values(formErrors).some(error => error !== '')) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/register`;
    try {
      const response = await axios.post(URL, data, { withCredentials: true });
      
      if (response.data.status === "success") {
        toast.success("Registration successful");
        localStorage.setItem('token', response.data.token);
        setTimeout(() => {
          setData({ email: "", password: "", passwordConfirm: "", mis: "", name: "", profilePic: "" });
          navigate('/verify-otp');
        }, 1000);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Duplicate Email Found");
      }else  if (error.response?.status === 400) {
        toast.error("Passwords do not match!");
      }else if (error.response?.status === 500) {
        toast.error("There was an error sending the email. Try again later!");
      }else {
        toast.error("Error occurred during registration");
      }
    }
  };

  const inputClass = "mt-1 rounded-lg p-2.5 w-full text-base bg-[#001233] border border-[#0094c6]/30 focus:outline-none focus:ring-2 focus:ring-[#0094c6] transition text-white";
  const labelClass = "text-sm font-medium text-[#0094c6]";

  const fields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "MIS", name: "mis", type: "text" }
  ];

  const passwordFields = [
    { label: "Password", name: "password", show: showPassword, setShow: setShowPassword },
    { label: "Confirm Password", name: "passwordConfirm", show: showConfirmPassword, setShow: setShowConfirmPassword }
  ];

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

        {fields.map((field, index) => (
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
              className={`${inputClass} ${errors[field.name] ? 'border-red-500' : ''}`}
              required
              value={data[field.name]}
              onChange={handleOnChange}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
            )}
          </motion.div>
        ))}

        {passwordFields.map((field, index) => (
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
              className={`${inputClass} ${errors[field.name] ? 'border-red-500' : ''}`}
              required
              value={data[field.name]}
              onChange={handleOnChange}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
            )}
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