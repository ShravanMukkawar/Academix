import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Import Navbar
import YouTubePlaylist from './pages/YouTubePlaylist';
import FileUpload from './pages/upload.jsx';
import Home from './pages/Home';
import FetchResourcesPage from './pages/getResource.jsx';
import FeedbackPage from './pages/Feedback.jsx';
import FeedbackForm from './pages/SubmitFeed.jsx';
import UpdateResourcesPage from './pages/UpdateResource.jsx';
import CalendarComponent from './pages/Calendar.jsx';
import { Analytics } from "@vercel/analytics/react"
import ProtectedRoute from "./utils/ProtectedRoute.jsx"; 
import SignUp from './pages/SignUp.jsx';
import Temp from './pages/temp.jsx';
import VerifyOtp from './pages/VerifyOtp.jsx';
import SignIn from './pages/SignIn.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
<<<<<<< HEAD
import CreateBlog from './pages/CreateBlog.jsx';
import BlogListing from './pages/GetAllBlogs.jsx';
import SingleBlog from './pages/BlogPage.jsx';
=======
import ProfessionalProfile from './pages/Profile.jsx';
>>>>>>> 3e07c4f14f77adf13f6e5883bcc63794febc7003

const App = () => {
  const requiredPassword = import.meta.env.VITE_REACT_APP_PASSWORD;
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 overflow-auto">
          <Routes>
          <Route
              path="/upload"
              element={
                <ProtectedRoute requiredPassword={requiredPassword}>
                  <FileUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/updater"
              element={
                <ProtectedRoute requiredPassword={requiredPassword}>
                  <UpdateResourcesPage />
                </ProtectedRoute>
              }
            />
            {/* <Route path="/updater" element={<UpdateResourcesPage />} /> */}
            <Route path="/yt/:id" element={<YouTubePlaylist />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:id" element={<ResetPassword />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/" element={<Home />} />
            <Route path="/getr" element={<FetchResourcesPage />} />
            <Route path="/seefeedback" element={<FeedbackPage />} />
            <Route path="/sfeedback" element={<FeedbackForm />} />
            <Route path="/calendar" element={<CalendarComponent />} />
<<<<<<< HEAD
            <Route path="/createBlog" element={<CreateBlog />} />
            <Route path="/blogs" element={<BlogListing />} />
            <Route path="/blogs/:blogId" element={<SingleBlog />} />
=======
            <Route path="/profile" element={<ProfessionalProfile/>} />
>>>>>>> 3e07c4f14f77adf13f6e5883bcc63794febc7003
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
