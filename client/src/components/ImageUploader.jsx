import React, { useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import uploadFile from "../utils/UploadFiles";

const Loading = () => (
  <div className="flex items-center justify-center">
    <div className="w-5 h-5 border-2 border-teal-400 rounded-full border-t-transparent animate-spin"></div>
  </div>
);

const ImageUploader = ({ onUploadSuccess }) => {
  const [uploadPhoto, setUploadPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUploadProfilePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setLoading(true);
      const uploadPhoto = await uploadFile(file);
      if (onUploadSuccess) {
        onUploadSuccess(uploadPhoto.secure_url);
      }
      setUploadPhoto(file);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      try {
        setLoading(true);
        const uploadPhoto = await uploadFile(file);
        if (onUploadSuccess) {
          onUploadSuccess(uploadPhoto.secure_url);
        }
        setUploadPhoto(file);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const clearUpload = () => {
    setUploadPhoto("");
    if (onUploadSuccess) {
      onUploadSuccess("");
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative rounded-lg transition-all duration-300 ${
          loading ? "pointer-events-none opacity-70" : ""
        }`}
      >
        <label
          htmlFor="profilePic"
          className={`relative block ${
            dragActive
              ? "border-teal-400 bg-teal-50/5"
              : "border-teal-200/20 hover:border-teal-400/40"
          } cursor-pointer rounded-lg transition-all duration-300`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center">
            {loading ? (
              <div className="flex flex-col items-center space-y-2">
                <Loading />
                <p className="text-sm text-teal-400">Uploading...</p>
              </div>
            ) : uploadPhoto ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="relative">
                  <Camera className="w-8 h-8 text-teal-400" />
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      clearUpload();
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
                <p className="text-sm text-teal-400 truncate max-w-[200px]">
                  {uploadPhoto.name}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <Upload className="w-8 h-8 text-teal-400" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-teal-400">
                    Drop your image here, or{" "}
                    <span className="text-teal-300 underline">browse</span>
                  </p>
                  <p className="text-xs text-teal-400/70">
                    Supports PNG, JPEG or JPG
                  </p>
                </div>
              </div>
            )}
          </div>
        </label>
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          id="profilePic"
          name="profilePic"
          className="hidden"
          onChange={handleUploadProfilePhoto}
          disabled={loading}
        />
      </div>
    </div>
  );
};

export default ImageUploader;