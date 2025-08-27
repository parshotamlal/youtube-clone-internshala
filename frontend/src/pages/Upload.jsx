import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from "react-hook-form";

import Loader, { ButtonLoader } from "../components/Loader";
import axios from "axios";
// Initialize Supabase client
import supabase from "../../supabaseconfig/client";
const Upload = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      video: null,
    },
  });

  // Watch video field to show preview
  const watchedVideo = watch("video");

  // Loading states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Error handling
  const [uploadError, setUploadError] = useState("");

  // Custom validation for video file
  const validateVideoFile = (fileList) => {
    if (!fileList || fileList.length === 0) {
      return "Please select a video file";
    }

    const file = fileList[0];

    // Validate file type
    const allowedTypes = [
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "video/webm",
    ];
    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid video file (MP4, MPEG, MOV, WEBM)";
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      return "Video file must be less than 50MB";
    }

    return true;
  };

  // Upload video to Supabase storage
  const uploadVideoToStorage = async (videoFile) => {
    try {
      // Check if user is authenticated (optional, remove if not using auth)
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) {
        console.warn("No authenticated user, proceeding with anonymous upload");
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const fileExtension = videoFile.name.split(".").pop();
      const fileName = `video_${timestamp}_${randomString}.${fileExtension}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from("videos") // Make sure this bucket exists in your Supabase project
        .upload(fileName, videoFile, {
          cacheControl: "3600",
          upsert: false,
          onUploadProgress: (progress) => {
            const percentage = (progress.loaded / progress.total) * 100;
            setUploadProgress(percentage);
          },
        });

      if (error) {
        console.error("Storage upload error:", error);
        throw error;
      }

      // Get public URL for the uploaded video
      const { data: publicUrlData } = supabase.storage
        .from("videos")
        .getPublicUrl(fileName);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    }
  };

  // Save video metadata to database
  const saveVideoToDatabase = async (videoUrl, title, description) => {
    try {
      // Check if user is authenticated (optional, remove if not using auth)
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) {
        console.warn("No authenticated user, proceeding with anonymous insert");
      }

      const insertData = {
        title: title.trim(),
        description: description.trim(),
        video_url: videoUrl,
        created_at: new Date().toISOString(),
        // Add user_id if using authentication
        ...(user && { user_id: user.id }),
      };

      const { data, error } = await supabase
        .from("video") // Replace with your table name
        .insert([insertData])
        .select();

      if (error) {
        console.error("Database insert error:", error);
        throw error;
      }

      return data[0];
    } catch (error) {
      console.error("Error saving to database:", error);
      throw error;
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setIsUploading(true);
    setUploadError("");
    setUploadProgress(0);

    try {
      const videoFile = data.video[0]; // Get the first file from FileList

      // Step 1: Upload video to Supabase storage
      const videoUrl = await uploadVideoToStorage(videoFile);

      const token = localStorage.getItem("youtubetoken");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}user/addpost`,
        {
          title: data.title,
          description: data.description,
          videoUrl: videoUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      reset();

      navigate("/");
    } catch (error) {
      setUploadError(
        error.message || "Failed to upload video. Please try again."
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Handle form errors
  const onError = (errors) => {
    console.log("Form validation errors:", errors);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Video</h2>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters long",
              },
              maxLength: {
                value: 100,
                message: "Title cannot exceed 100 characters",
              },
            })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter video title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description Input */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters long",
              },
              maxLength: {
                value: 500,
                message: "Description cannot exceed 500 characters",
              },
            })}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter video description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Video Input */}
        <div>
          <label
            htmlFor="video-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Video File *
          </label>
          <input
            type="file"
            id="video-input"
            accept="video/mp4,video/mpeg,video/quicktime,video/webm"
            {...register("video", {
              validate: validateVideoFile,
            })}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.video ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.video && (
            <p className="mt-1 text-sm text-red-600">{errors.video.message}</p>
          )}

          {/* Video Preview */}
          {watchedVideo && watchedVideo.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-600">
                Selected: {watchedVideo[0].name} (
                {(watchedVideo[0].size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            </div>
          )}
        </div>

        {/* Upload Progress */}
        {isUploading && uploadProgress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <p className="text-sm text-gray-600 mt-1">
              Uploading: {Math.round(uploadProgress)}%
            </p>
          </div>
        )}

        {/* Error Message */}
        {uploadError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{uploadError}</p>
          </div>
        )}

        {/* Form Status */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {!isValid && Object.keys(errors).length > 0 && (
              <span className="text-red-500">Please fix the errors above</span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading || !isValid}
          className={`w-full py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
            isUploading || !isValid
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isUploading ? (
            <span className="flex items-center justify-center">
              <ButtonLoader />
              <span className="ml-2">Uploading...</span>
            </span>
          ) : (
            "Upload Video"
          )}
        </button>

        {/* Reset Button */}
        {!isUploading && (
          <button
            type="button"
            onClick={() => reset()}
            className="w-full py-2 px-4 border border-gray-300 rounded-md font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Reset Form
          </button>
        )}
      </form>
    </div>
  );
};

export default Upload;