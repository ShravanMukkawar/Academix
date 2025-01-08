import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { loginSuccess } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { HiOutlineMail } from 'react-icons/hi';

const VerifyOtp = () => {
  const [data, setData] = useState({
    otp: ""
  });
  
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers and limit to 6 characters
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (data.otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/verifySignupEmailOTP`;
    try {
      const response = await axios.post(URL, {
        Emailotp: data.otp
      }, {
        headers: { 'authorization': `Bearer ${token}` },
        withCredentials: true
      });

      if (response.data.status === "success") {
        const userData = response.data.data.oldUser;
        dispatch(loginSuccess(userData));
        toast.success("Email verification successful!");
        setData({ otp: "" });
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed. Please try again.");
      console.error("Verification error:", error);
      navigate('/register');
    }
  };

  return (
    <div className='min-h-screen flex justify-center items-center p-4 bg-[#000B1D]'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-full max-w-md'
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className='bg-[#001233] rounded-xl p-8 shadow-xl border border-[#0094c6]/20'
        >
          <div className='flex flex-col items-center mb-6'>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className='w-16 h-16 bg-[#0094c6]/10 rounded-full flex items-center justify-center mb-4'
            >
              <HiOutlineMail className='w-8 h-8 text-[#0094c6]' />
            </motion.div>
            <h1 className='text-2xl font-bold text-[#0094c6] text-center'>Email Verification</h1>
            <p className='mt-2 text-center text-gray-400 text-sm'>
              We've sent a verification code to your email address. Please check your inbox and enter the code below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className="block text-sm font-medium text-[#0094c6] mb-2" htmlFor="otp">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 bg-[#001233] border border-[#0094c6]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0094c6] text-white text-center text-lg tracking-widest"
                required
                value={data.otp}
                onChange={handleOnChange}
                maxLength={6}
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#0094c6] text-white rounded-lg py-3 font-medium transition duration-200 hover:bg-[#0094c6]/90 focus:outline-none focus:ring-2 focus:ring-[#0094c6] focus:ring-offset-2 focus:ring-offset-[#001233]"
            >
              Verify Email
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VerifyOtp;