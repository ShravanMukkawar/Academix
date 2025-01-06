import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Heart, Clock, Send, ChevronDown, ChevronUp, Reply, Trash, Edit, Check, X, SortAsc } from 'lucide-react';
import toast from 'react-hot-toast';

const Comment = ({ comment, onReply, onDelete, onLike, onUpdate, allComments, depth = 0 }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const user = JSON.parse(localStorage.getItem('user'));
  
  const replies = allComments.filter(c => c.parentComment === comment._id);
  console.log('Parent Comment IDs:', allComments.map(c => c.parentComment));
console.log('Current Comment ID:', comment._id);


  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    onReply(comment._id, replyText);
    setReplyText('');
    setShowReplyInput(false);
  };

  const handleUpdateSubmit = () => {
    if (!editedContent.trim()) return;
    onUpdate(comment._id, editedContent);
    setIsEditing(false);
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

  return (
    <div style={{ marginLeft: `${depth * 20}px` }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[#002855] rounded-xl p-6 border border-[#003875] mb-4"
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <span className="font-medium text-[#00B4D8]">{comment.author?.name}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-400 text-sm">
              {/* {new Date(comment.createdAt).toLocaleDateString()} */}
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onLike(comment._id)}
              className={`p-2 rounded-full ${
                comment.likes?.includes(user._id) ? 'text-red-500' : 'text-gray-400'
              } hover:bg-[#003875] transition-colors flex items-center gap-2`}
            >
              <Heart className={`w-4 h-4 ${comment.likes?.includes(user._id) ? 'fill-current' : ''}`} />
              <span className="text-sm ml-1">{comment.likesCount || 0}</span>
            </button>
            {comment.author?._id === user._id && (
              <>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-gray-400 hover:text-[#00B4D8] transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(comment._id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-gray-400 hover:text-[#00B4D8] transition-colors"
            >
              <Reply className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {isEditing ? (
          <div className="mt-2">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#001845] text-white border border-[#003875]"
              rows="3"
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="p-2 text-gray-400 hover:text-green-500"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-300">{comment.content}</p>
        )}
        
        {showReplyInput && (
          <div className="mt-4 flex space-x-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 px-3 py-1 rounded-lg bg-[#001845] text-white border border-[#003875]"
            />
            <button
              onClick={handleReplySubmit}
              className="px-4 py-1 bg-[#00B4D8] text-white rounded-lg hover:bg-[#0096c7]"
            >
              Reply
            </button>
          </div>
        )}
      </motion.div>

      {replies.length > 0 && (
        <>
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-gray-400 hover:text-[#00B4D8] mb-2 flex items-center"
          >
            {showReplies ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span className="ml-1">{replies.length} replies</span>
          </button>
          
          {showReplies && (
            <div className="space-y-4">
              {replies.map((reply) => (
                <Comment
                  key={reply._id}
                  comment={reply}
                  onReply={onReply}
                  onDelete={onDelete}
                  onLike={onLike}
                  onUpdate={onUpdate}
                  allComments={allComments}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const SingleBlog = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [sort, setSort] = useState('-createdAt');

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [blogId,sort]);

  const fetchBlog = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/blogs/${blogId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setBlog(response.data.data.blog);
      const user = JSON.parse(localStorage.getItem('user'));
      setIsLiked(response.data.data.blog.likes.includes(user._id));
      setLikesCount(response.data.data.blog.likesCount);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch blog");
      setLoading(false);
    }
  }; 
  
  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/comments/${blogId}/comments?sort=${sort}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setComments(response.data.data.comments);
    } catch (error) {
      toast.error("Failed to fetch comments");
    }
  };

  const handleBlogLike = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/blogs/${blogId}/like`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      toast.error("Failed to like blog");
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/comments/${commentId}/like`,
        {},
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      await fetchComments();
    } catch (error) {
      toast.error("Failed to like comment");
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/comments/${blogId}/comments`,
        { content: newComment },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNewComment('');
      await fetchComments();
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleReply = async (parentCommentId, content) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/comments/${blogId}/comments`,
        { 
          content,
          parentComment: parentCommentId
        },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      await fetchComments();
      toast.success("Reply added successfully");
    } catch (error) {
      toast.error("Failed to add reply");
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/comments/${blogId}/comments/${commentId}`,
        { content },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      await fetchComments();
      toast.success("Comment updated successfully");
    } catch (error) {
      toast.error("Failed to update comment");
    }
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

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/v1/comments/${blogId}/comments/${commentId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      await fetchComments();
      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete comment");
    }
  };

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
    <div className="min-h-screen bg-[#001233] px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#002855] rounded-xl p-8 shadow-lg border border-[#003875]"
        >
          <h1 className="text-4xl font-bold text-[#00B4D8] mb-4">{blog?.title}</h1>
          
          <div className="flex items-center justify-between mb-6">
            <div className="text-gray-400">
              <span className="mr-2">By</span>
              <span className="text-[#00B4D8]">{blog?.author?.name}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Clock className="w-4 h-4 mr-2" />
              {formatDate(blog.createdAt)}
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-6">
            {blog?.content}
          </div>

          <div className="flex items-center justify-between border-t border-[#003875] pt-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBlogLike}
                className={`p-2 rounded-full ${
                  isLiked ? 'text-red-500' : 'text-gray-400'
                } hover:bg-[#003875] transition-colors`}
              >
                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <span className="text-gray-400">{likesCount} likes</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {blog?.tags?.map((tag) => (
                <span 
                  key={tag}
                  className="bg-[#001845] text-[#00B4D8] px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.article>

        <div className="mt-8">
          <div className="flex space-x-4 mb-6">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 rounded-xl bg-[#002855] text-white border border-[#003875] focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] outline-none"
            />
            <button
              onClick={handleComment}
              className="px-6 py-2 bg-[#00B4D8] text-white rounded-xl hover:bg-[#0096c7] transition-colors flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </button>
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
          <div className="space-y-4">
            {comments.filter(c => !c.parentComment).map((comment) => (
              <Comment
                key={comment._id}
                comment={comment}
                onReply={handleReply}
                onDelete={handleDeleteComment}
                onLike={handleCommentLike}
                onUpdate={handleUpdateComment}
                allComments={comments}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleBlog;