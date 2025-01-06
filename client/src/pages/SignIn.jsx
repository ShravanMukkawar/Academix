import { useState } from 'react';
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
        dispatch(loginSuccess(userData)); // Dispatch user data to Redux
        localStorage.setItem('token', response.data.token);

        setTimeout(() => {
          setData({
            password: "",
            email: ""
          });
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

  return (
    <div className='h-screen flex justify-center items-center relative overflow-hidden'>
      <div
        className='absolute inset-0 bg-cover bg-center'
        style={{
          backgroundImage: `url('/1153643.webp')`,
          filter: 'blur(8px)',
          zIndex: -1
        }}
      ></div>

      <Toaster position="top-right" reverseOrder={false} />

      <form onSubmit={handleSubmit} className='relative w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-xl bg-black bg-opacity-90 shadow-lg flex flex-col p-8'>
        <h1 className='font-sans text-2xl font-bold mb-6 text-center text-blue-700'>Sign In</h1>

        <label className="text-xs text-gray-600" htmlFor="email">Email or MIS</label>
        <input
          type="text"
          id="email"
          name="email"
          className="mt-1 rounded-md p-2 w-full text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
          value={data.email}
          onChange={handleOnChange}
        />

        <div className='flex justify-between items-center mt-5'>
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
          className="rounded-md p-2 mb-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition w-full"
          required
          value={data.password}
          onChange={handleOnChange}
        />

        <div className='flex justify-between'>
          <Link to={"/signup"} className='text-xs cursor-pointer hover:text-blue-600 text-gray-600 font-semibold underline'>
            SignUp
          </Link>
          <Link to={"/forgot-password"} className='text-xs cursor-pointer hover:text-blue-600 text-gray-600 font-semibold underline'>
            Forgot Password?
          </Link>
        </div>

        <button type="submit"
          className="bg-blue-600 mt-4 rounded-md p-2 text-white font-semibold hover:bg-blue-700 transition duration-200"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default SignIn;
