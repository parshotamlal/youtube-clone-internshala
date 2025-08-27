import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import { ButtonLoader } from "../components/Loader";

import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";

const Register = () => {
  const [isLoading, setLoader] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    try {
      setLoader(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}user/signup`,
        {
          ...data,
        }
      );
      console.log(response);
      setLoader(false);
      if (response) {
        localStorage.setItem("youtubetoken", response?.data?.data?.token);
        dispatch(setAuthenticated(true));
        navigate("/");
      }
      if (response.error) {
        setFormErrors("validation error");
      }
    } catch (error) {
      setLoader(false);
      setFormErrors({ general: "An unexpected error occurred." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-600 shadow-md">
            <svg
              className="w-7 h-7 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            YouTube
          </h1>
          <p className="text-sm text-gray-600">Create your account</p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              {...register("username", { required: true })}
              placeholder="Enter your full name"
              className={`w-full px-4 py-2.5 rounded-xl border shadow-sm placeholder-gray-400 focus:outline-none transition ${
                formErrors.name
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                  : "border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
              }`}
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              {...register("email", { required: true })}
              placeholder="Enter your email"
              className={`w-full px-4 py-2.5 rounded-xl border shadow-sm placeholder-gray-400 focus:outline-none transition ${
                formErrors.email
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                  : "border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
              }`}
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              {...register("password", { required: true })}
              placeholder="Enter your password"
              className={`w-full px-4 py-2.5 rounded-xl border shadow-sm placeholder-gray-400 focus:outline-none transition ${
                formErrors.password
                  ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                  : "border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
              }`}
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md"
          >
            {isLoading && <ButtonLoader />}
            <span>{isLoading ? "Creating account..." : "Create account"}</span>
          </button>
        </form>

        {/* Sign in redirect */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
