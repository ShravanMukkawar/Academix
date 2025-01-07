//search blog not working
//work on it
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, X, Search, SortAsc, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const BlogListing = () => {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    tags: []
  });
  const [sort, setSort] = useState('-createdAt');
  const [tagInput, setTagInput] = useState('');
  const navigate=useNavigate();
  const fetchBlogs = async (page) => {
    try {
      const tagsQuery = filters.tags.length 
        ? `&tags=${filters.tags.map(tag => tag.toLowerCase()).join(',')}` 
        : '';
      const searchQuery = filters.search ? `&search=${filters.search}` : '';

      
      const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/blogs?page=${page}&limit=10&sort=${sort}${tagsQuery}${searchQuery}`;
      
      const token = localStorage.getItem('token');
      const response = await axios.get(URL, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });

      setBlogs(response.data.data.blogs);
      setTotalPages(Math.ceil(response.data.totalCount / 10));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs");
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    fetchBlogs(currentPage);
  }, [currentPage, filters, sort]);

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
      hour12: true, // Use 12-hour format with AM/PM
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
             <a 
               href="/signin" 
               className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
             >
               Login
             </a>
             <a 
               href="/signup" 
               className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
             >
               Sign Up
             </a>
           </motion.div>
         </motion.div>
       </div>
     );
   }  

  return (
    <div className="min-h-screen bg-[#001233] px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <motion.h1 
          className="text-4xl font-bold text-[#00B4D8] mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Blog Posts
        </motion.h1>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 rounded-xl bg-[#002855] text-white w-full border border-[#003875] focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] outline-none"
              />
            </div>
            
            <div className="relative min-w-[160px]">
              <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-xl bg-[#002855] text-white w-full border border-[#003875] focus:border-[#00B4D8] outline-none appearance-none"
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="title">Title A-Z</option>
                <option value="-title">Title Z-A</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Add tags (press Enter)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="px-4 py-2 rounded-xl bg-[#002855] text-white w-full border border-[#003875] focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] outline-none"
            />
            {filters.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="bg-[#003875] text-[#00B4D8] px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button 
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <motion.div 
              className="w-8 h-8 border-4 border-[#00B4D8] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {blogs.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                No blogs found matching your criteria
              </div>
            ) : (
              blogs.map((blog) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#002855] rounded-xl p-6 shadow-lg border border-[#003875] hover:border-[#00B4D8] transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <Link 
                      to={`/blogs/${blog._id}`}
                      className="group"
                    >
                      <h2 className="text-2xl font-semibold text-[#00B4D8] group-hover:text-[#0096c7] transition-colors">
                        {blog.title}
                      </h2>
                    </Link>
                    <div className="text-gray-400 text-sm">
                      <span className="mr-2">~</span>
                      <span>{blog.author?.name || 'Unknown'}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-400 text-sm mt-2">
                    <Clock className="w-4 h-4 mr-2" />
                    {formatDate(blog.createdAt)}
                  </div>

                  <p className="text-gray-300 my-4">
                    {truncateContent(blog.content)}
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
                </motion.div>
              ))
            )}

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
      {/* Floating Action Button with Tooltip */}
      <div className="fixed bottom-8 right-16">
        <div className='flex flex-col items-center gap-0'>

        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-20 -translate-x-1/2 bg-[#002855] text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap shadow-lg"
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
          className="w-14 h-14 bg-[#00B4D8] hover:bg-[#0096c7] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
          >
          <Plus className="w-6 h-6 text-white" />
        </motion.button>
          </div>
      </div>
    </div>
  );
};

export default BlogListing;