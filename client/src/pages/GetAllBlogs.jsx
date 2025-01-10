import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, X, Search, SortAsc, Plus, Heart, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import HTMLContent from '../components/HTMLContent';

const BlogListing = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [searchInputs, setSearchInputs] = useState({
    title: '',
    author: ''
  });
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    tags: []
  });
  const [sort, setSort] = useState('-createdAt');
  const [tagInput, setTagInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    // Get current user ID from token or API
    const getCurrentUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUserId(response.data.data.user._id);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    if (token) getCurrentUser();
  }, []);


  const fetchBlogs = async (page) => {
    try {
      const token = localStorage.getItem('token');
      let URL;
      
      if (filters.title || filters.author) {
        URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/blogs/search?title=${filters.title || ''}&author=${filters.author || ''}`;
      } else {
        const tagsQuery = filters.tags.length 
          ? `&tags=${filters.tags.map(tag => tag.toLowerCase()).join(',')}` 
          : '';
        URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/blogs?page=${page}&limit=10&sort=${sort}${tagsQuery}`;
      }

      const response = await axios.get(URL, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (filters.title || filters.author) {
        setBlogs(response.data.data.blogs);
        setTotalPages(1);
      } else {
        setBlogs(response.data.data.blogs);
        setTotalPages(Math.ceil(response.data.totalCount / 10));
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      if (error.response?.status === 404) {
        setBlogs([]);
        setTotalPages(1);
      } else {
        toast.error("Failed to fetch blogs");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    fetchBlogs(currentPage);
  }, [currentPage, filters, sort]);

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      title: searchInputs.title,
      author: searchInputs.author
    }));
    setCurrentPage(1);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setFilters(prev => ({
        ...prev,
        tags: [...new Set([...prev.tags, tagInput.trim()])]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength).trim() + '...';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return `${formattedDate} ${formattedTime}`;
  };

  if (!isLoggedIn) {
    if (loading) {
      return (
        <div className="min-h-screen bg-[#001233] flex justify-center items-center">
          <motion.div 
            className="w-8 h-8 border-4 border-[#00B4D8] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      );
    }
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#001233] to-[#001845]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl bg-red-500/10 border border-red-500/20 rounded-2xl p-12 text-center backdrop-blur-sm"
        >
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-red-400 mb-6"
          >
            Login Required
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-8"
          >
            Please login or sign up to access Blogs Feature
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center space-x-6"
          >
            <Link 
              to="/signin" 
              className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              Sign Up
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#001233] px-2 sm:px-4 md:px-6 lg:px-8 py-6 md:py-12">
      <div className="max-w-5xl mx-auto">
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#00B4D8] mb-4 sm:mb-6 md:mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Blog Posts
        </motion.h1>

        {/* Search and Filter Section */}
        <div className="mb-6 space-y-4">
          {/* Search Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchInputs.title}
                onChange={(e) => setSearchInputs(prev => ({ ...prev, title: e.target.value }))}
                className="pl-10 pr-4 py-2 rounded-xl bg-[#002855] text-white w-full border border-[#003875] focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] outline-none"
              />
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by author..."
                value={searchInputs.author}
                onChange={(e) => setSearchInputs(prev => ({ ...prev, author: e.target.value }))}
                className="pl-10 pr-4 py-2 rounded-xl bg-[#002855] text-white w-full border border-[#003875] focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] outline-none"
              />
            </div>

            <div className="relative">
              <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl bg-[#002855] text-white w-full border border-[#003875] focus:border-[#00B4D8] outline-none appearance-none"
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="-likesCount">Most Liked</option>
                <option value="-viewsCount">Most Viewed</option>
              </select>
            </div>

            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-[#00B4D8] hover:bg-[#0096c7] text-white rounded-xl transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>

          {/* Tags Section */}
          <div className="space-y-2">
            <div className="relative">
              <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Add a tag (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                disabled={filters.tags.length>0}
                className="pl-10 pr-4 py-2 rounded-xl bg-[#002855] text-white w-full border border-[#003875] focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] outline-none"
              />
            </div>

            {filters.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 rounded-xl bg-[#002855]/50">
                {filters.tags.map(tag => (
                  <motion.span 
                    key={tag}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="bg-[#003875] text-[#00B4D8] px-3 py-1 rounded-full text-sm flex items-center group"
                  >
                    {tag}
                    <button 
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div 
              className="w-8 h-8 border-4 border-[#00B4D8] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
{blogs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          No blogs found matching your criteria
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {blogs.map((blog) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#002855] rounded-xl p-4 md:p-6 shadow-lg border border-[#003875] hover:border-[#00B4D8] transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <Link 
                  to={`/blogs/${blog._id}`}
                  className="group"
                >
                  <h2 className="text-xl md:text-2xl font-semibold text-[#00B4D8] group-hover:text-[#0096c7] transition-colors">
                    {blog.title}
                  </h2>
                </Link>
                <div className="text-gray-400 text-sm">
                  <span className="mr-2">~</span>
                  <span>{blog.author?.name || 'Unknown'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-gray-400 text-sm mt-2">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {formatDate(blog.createdAt)}
                </div> 
              </div>

              <p className="text-gray-300 my-4">

              <HTMLContent content={truncateContent(blog.content)} />
              </p>

              <div className="flex flex-wrap gap-2">
                {blog.tags?.map((tag) => (
                  <span 
                    key={tag} 
                    className="bg-[#001845] text-[#00B4D8] px-3 py-1 rounded-full text-sm"
                  >
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </span>
                ))}
              </div>

              {/* Engagement Stats */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#003875]">
                <button
                  className="flex items-center gap-1.5 group"
                  disabled={!isLoggedIn}
                >
                  <Heart
                    className={`w-5 h-5 transform transition-all duration-200 group-hover:scale-110 ${
                      blog.likes?.includes(currentUserId)
                        ? 'fill-red-500 text-red-500' 
                        : 'text-gray-400  '
                    }`}
                  />
                  <span className={`text-sm ${
                    blog.likes?.includes(currentUserId) 
                      ? 'text-red-500' 
                      : 'text-gray-400  '
                  }`}>
                    {blog.likesCount || 0}
                  </span>
                </button>

                <div className="flex items-center gap-1.5 text-gray-400">
                  <Eye className="w-5 h-5" />
                  <span className="text-sm">{blog.viewsCount || 0}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

            {/* Pagination */}
            {blogs.length > 0 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-[#002855] text-[#00B4D8] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#003875] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-white">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-[#002855] text-[#00B4D8] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#003875] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-8 md:right-16">
        <div className="flex flex-col items-center gap-0">
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-16 -translate-x-1/2 bg-[#002855] text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-lg"
              >
                Create Blog
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#002855] rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onClick={() => navigate('/createBlog')}
            className="w-12 h-12 sm:w-14 sm:h-14 bg-[#00B4D8] hover:bg-[#0096c7] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default BlogListing;