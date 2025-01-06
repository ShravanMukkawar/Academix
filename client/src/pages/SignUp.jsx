import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    name: "",
    password: "",
    passwordConfirm: "",
    mis: "",
    profilePic:""
  });

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUploadSuccess = (url) => {
    setData((prevData) => ({
        ...prevData,
        profilePic: url, // Update profilePic with the secure URL
      }));
    console.log('Received secure URL:', url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/register`;
    console.log('URL:', URL);
    try {
      const response = await axios.post(URL, {
        email: data.email,
        name: data.name,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
        mis: data.mis,
        profilePic: data.profilePic
      },{
        withCredentials: true
      });
      
      if (response.data.status === "success") {
        toast.success("Registration successful");
        localStorage.setItem('token', response.data.token);

        setTimeout(() => {
          setData({
            email: "",
            password: "",
            passwordConfirm: "",
            mis: "",
            name: "",
            profilePic:""
          });
          navigate('/verify-otp'); // Redirect to the verification page
        }, 1000);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred during registration.");
      console.log(">>", error);
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className='flex justify-center items-center h-screen w-screen'>
        <form onSubmit={handleSubmit} className='relative w-1/3 max-w-md   h-auto rounded-2xl bg-black shadow-lg p-8'>
          <h1 className='font-sans text-2xl font-bold mb-6 text-center text-blue-700'>Register</h1>
          
          <label className="text-xs text-gray-600" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            className="mt-1 rounded-md p-2 w-full text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
            value={data.name}
            onChange={handleOnChange}
          />

          <label className="text-xs text-gray-600" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 rounded-md p-2 w-full text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
            value={data.email}
            onChange={handleOnChange}
          />
          
          <label className="text-xs text-gray-600 mt-3" htmlFor="mis">MIS</label>
          <input
            type="text"
            id="mis"
            name="mis"
            className="mt-1 rounded-md p-2 w-full text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
            value={data.mis}
            onChange={handleOnChange}
          />

          <div className='flex justify-between items-center mt-3'>
            <label className="text-xs text-gray-600" htmlFor="password">Password</label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-gray-600 flex items-center"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              <span className='ml-1'> {showPassword ? 'Hide' : 'Show'}</span>
            </button>
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            className="mt-1 rounded-md p-2 mb-2 w-full text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
            value={data.password}
            onChange={handleOnChange}
          />

          <div className='flex justify-between items-center mt-3'>
            <label className="text-xs text-gray-600" htmlFor="passwordConfirm">Confirm Password</label>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-xs text-gray-600 flex items-center"
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              <span className='ml-1'> {showConfirmPassword ? 'Hide' : 'Show'}</span>
            </button>
          </div>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="passwordConfirm"
            name="passwordConfirm"
            className="mt-1 rounded-md p-2 mb-2 w-full text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
            value={data.passwordConfirm}
            onChange={handleOnChange}
          />
          <ImageUploader onUploadSuccess={handleUploadSuccess}/>

          <button type="submit"
            className="bg-blue-600 mt-3 rounded-md p-2 text-white font-semibold hover:bg-blue-700 transition duration-200"
          >
            Register
          </button>

          <div className='flex justify-between items-center mt-4'>
            <p className='text-xs text-gray-600'>
              Already have an account?
            </p>
            <div 
              onClick={()=>{navigate('/signin')}} 
              className='text-xs cursor-pointer hover:text-blue-600 text-blue-700 font-semibold underline'
            >
              Sign In
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;
