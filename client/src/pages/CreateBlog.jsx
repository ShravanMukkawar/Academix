import React, { useState } from 'react';
import { Pencil, Tags, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import RichTextEditor from '../components/Editor';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (newContent) => {
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Title and content are required!");
      return;
    }

    setIsSubmitting(true);
    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/blogs`;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(URL, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === "success") {
        toast.success("Blog post created successfully!");
        setTimeout(() => {
          navigate('/blogs');
        }, 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating blog post");
      console.error("Error creating blog:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#001233] px-4 sm:px-6 lg:px-8 flex items-center justify-center py-8">
      <motion.div 
        className="w-full max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-[#002855] rounded-2xl shadow-2xl overflow-hidden border border-[#003875]">
          <div className="px-8 py-6 bg-gradient-to-r from-[#001845] to-[#002855]">
            <motion.h2 
              className="text-3xl font-bold text-[#00B4D8] text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Create New Blog Post
            </motion.h2>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <motion.div className="space-y-2" whileHover={{ scale: 1.01 }}>
                <label className="flex items-center text-sm font-medium text-gray-300">
                  <Pencil className="w-4 h-4 mr-2 text-[#00B4D8]" />
                  Title
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#001845] border border-[#003875] text-white focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8] outline-none"
                  placeholder="Enter your blog title..."
                  required
                />
              </motion.div>

              {/* Rich Text Editor */}
              <motion.div whileHover={{ scale: 1.01 }}>
                <RichTextEditor
                  value={formData.content}
                  onChange={handleContentChange}
                  label="Content"
                  minHeight="300px"
                  placeholder="Write your blog post here..."
                />
              </motion.div>

              {/* Tags Section */}
              <motion.div className="space-y-2" whileHover={{ scale: 1.01 }}>
                <label className="flex items-center text-sm font-medium text-gray-300">
                  <Tags className="w-4 h-4 mr-2 text-[#00B4D8]" />
                  Tags
                </label>
                <div className="flex gap-2">
                  <input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(e);
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-[#001845] border border-[#003875] text-white focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8] outline-none"
                    placeholder="Add a tag and press Enter..."
                  />
                  <button
                    onClick={handleAddTag}
                    type="button"
                    className="px-4 py-2 bg-[#00B4D8] rounded-xl text-white hover:bg-[#0096c7] transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map(tag => (
                    <motion.span
                      key={tag}
                      className="bg-[#001845] px-3 py-1 rounded-full text-white flex items-center gap-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-[#00B4D8] hover:text-[#0096c7]"
                      >
                        ×
                      </button>
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#00B4D8] hover:bg-[#0096c7] text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors disabled:opacity-70"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <motion.div 
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Create Post</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateBlog;