import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const ResetPassword = () => {
  const [data, setData] = useState({
    password: "",
    passwordConfirm: ""
  });
  const { id } = useParams(); // Extract the dynamic ID from the URL
  const navigate = useNavigate();

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

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/resetPassword/${id}`;
    try {
      const response = await axios.patch(URL, {
        password: data.password,
        passwordConfirm: data.passwordConfirm
      });

      if (response.data.status === "success") {
        toast.success("Password reset successful.");
        setTimeout(() => {
          setData({
            password: "",
            passwordConfirm: ""
          });
          navigate('/signin'); // Redirect to login page
        }, 1000);
      } else {
        toast.error(response.data.message || "Failed to reset password.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error in Reset Password:", error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/1153643.webp')`,
          filter: 'blur(8px)',
          zIndex: -1
        }}
      ></div>

      <Toaster position="top-right" reverseOrder={false} />

      <form
        onSubmit={handleSubmit}
        className="relative w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4 rounded-xl bg-black bg-opacity-90 shadow-lg flex flex-col p-8"
      >
        <h1 className="font-sans text-2xl font-bold mb-6 text-center text-blue-700">Reset Password</h1>

        <label className="text-xs text-gray-600" htmlFor="password">New Password</label>
        <input
          type="password"
          id="password"
          name="password"
          className="mt-1 rounded-md p-2 w-full text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
          value={data.password}
          onChange={handleOnChange}
        />

        <label className="text-xs text-gray-600 mt-4" htmlFor="passwordConfirm">Confirm Password</label>
        <input
          type="password"
          id="passwordConfirm"
          name="passwordConfirm"
          className="mt-1 rounded-md p-2 w-full text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          required
          value={data.passwordConfirm}
          onChange={handleOnChange}
        />

        <button
          type="submit"
          className="bg-blue-600 mt-6 rounded-md p-2 text-white font-semibold hover:bg-blue-700 transition duration-200"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
