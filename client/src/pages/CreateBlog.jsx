import React, { useState } from 'react';
import { X, Pencil, Tags, Send, BookOpen, EyeOff } from 'lucide-react';

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', formData);
      setFormData({ title: '', content: '', tags: [] });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview component
  const PreviewMode = () => (
    <div className="space-y-6 text-white">
      <h1 className="text-4xl font-bold text-white">{formData.title || 'Untitled Post'}</h1>
      
      {formData.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {formData.tags.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-blue-500/20 rounded-full text-sm text-blue-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="prose prose-invert max-w-none">
        {formData.content ? (
          <div className="whitespace-pre-wrap">{formData.content}</div>
        ) : (
          <p className="text-slate-400 italic">No content yet...</p>
        )}
      </div>
    </div>
  );

  // Edit form component
  const EditForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
          <Pencil className="w-4 h-4 mr-2 text-blue-400" />
          Title
        </label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white
                   focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
          placeholder="Enter your post title..."
        />
      </div>

      <div>
        <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
          <Pencil className="w-4 h-4 mr-2 text-blue-400" />
          Content
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white
                   focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200
                   min-h-[200px] resize-y"
          placeholder="Write your post content..."
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center text-sm font-medium text-slate-300">
          <Tags className="w-4 h-4 mr-2 text-blue-400" />
          Tags
        </label>
        <div className="flex gap-2">
          <input
            value={currentTag}
            onChange={(e) => setCurrentTag(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white
                     focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
            placeholder="Add a tag..."
          />
          <button
            onClick={handleAddTag}
            type="button"
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium
                     transition-colors duration-200"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {formData.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm
                       bg-slate-700/50 text-white"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 
                 hover:from-blue-600 hover:to-cyan-600 rounded-xl text-white font-medium 
                 flex items-center justify-center gap-2 transition-all duration-200 
                 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span>Publish Post</span>
          </>
        )}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 rounded-2xl shadow-xl border border-slate-700/50 overflow-hidden backdrop-blur-lg">
          <div className="p-8 bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700/50">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Create New Post
              </h1>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 
                         transition-colors text-white"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Back to Edit
                  </>
                ) : (
                  <>
                    <BookOpen className="w-4 h-4" />
                    Preview
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-8">
            {showPreview ? <PreviewMode /> : <EditForm />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;