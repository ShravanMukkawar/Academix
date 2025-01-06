import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast  from 'react-hot-toast';
import { loginSuccess } from '../redux/userSlice';
import { useDispatch } from 'react-redux';

const VerifyOtp = () => {
    const [data, setData] = useState({
        otp:""
    });    
    const token=localStorage.getItem('token')
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

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/verifySignupEmailOTP`;
    try {
        const response = await axios.post(URL, {
        Emailotp: data.otp
        },{ headers: { 'authorization': `Bearer ${token}` }},{
        withCredentials: true
        });
        
        if (response.data.status === "success") {
            const userData = response.data.data.oldUser;
            dispatch(loginSuccess(userData)); // Dispatch the user state to Redux
        setTimeout(() => {
            toast.success("verification successful");
                setData({
                    otp:""
            });
            navigate('/'); // Redirect to the login page
        }, 1000);
        } else {
        toast.error("Registration failed. Please try again.");
        }
    } catch (error) {
        toast.error("An error occurred during registration.");
        console.log(">>", error);
        navigate('/register')
    }
    };

    return (
    <>
        <div className='flex justify-center items-center h-screen w-screen bg-black'>
        <form onSubmit={handleSubmit} className='relative w-1/4 max-w-md dark:text-white dark:bg-blue-950 h-auto rounded-2xl bg-slate-200 bg-opacity-90 flex flex-col p-6 shadow-lg'>
            <h1 className='font-sans text-2xl font-bold mb-6 text-center'>verify otp</h1>
            <label className="text-xs text-slate-500 dark:text-white" htmlFor="otp">OTP</label>
            <input
            type="text"
            id="otp"
            name="otp"
            className=" bg-slate-200 mt-1 rounded p-2 w-full text-sm text-black"
            required
            value={data.otp}
            onChange={handleOnChange}
            />
            <button type="submit"
            className="bg-slate-500 mt-3 rounded-3xl p-2 text-white font-semibold hover:bg-slate-800"
            >
            Verify
            </button>
 
        </form>
        </div>
    </>
    );
};
    
    

export default VerifyOtp