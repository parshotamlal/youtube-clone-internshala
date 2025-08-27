import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import SearchBar from "./SearchBar";
import { IoMdMenu } from "react-icons/io";
import { FaYoutube } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setAuthenticated } from "../redux/isAuthenticated";
import { logout } from "../redux/isAuthenticated";
const Navbar = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const { isAuthenticated } = useSelector((state) => state?.isAuthenticated);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  console.log("isAuthenticated in Navbar:", isAuthenticated);
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("youtubetoken");
    if (token) dispatch(setAuthenticated(true));
    else dispatch(logout());
  }, []);
  // Handlers
  const handleLogin = () => navigate("/login");
  const handleLogout = () => {
    localStorage.removeItem("youtubetoken");
    dispatch(setAuthenticated(false));
    setShowUserMenu(false);
  };
  const handleUpload = () => navigate("/upload");

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 h-16">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left section - Menu & Logo */}
          <div className="flex items-center space-x-4">
            {/* Sidebar toggle */}
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-full hover:bg-gray-200 transition"
            >
              <IoMdMenu className="text-2xl text-gray-700" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <FaYoutube className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                YouTube
              </span>
            </Link>
          </div>

          {/* Center section - Search */}
          <div className="flex-1 max-w-2xl mx-4">
            <SearchBar />
          </div>

          {/* Right section - User actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Upload (Desktop only) */}
                <button
                  onClick={handleUpload}
                  className="hidden sm:block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Upload
                </button>

                {/* Avatar + Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 hover:border-gray-400 transition-colors"
                  >
                    <img
                      src={
                        user?.avatar ||
                        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop"
                      }
                      alt={user?.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        to={`/channel`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Your Channel
                      </Link>

                      {/* Upload in dropdown (Mobile only) */}
                      <button
                        onClick={handleUpload}
                        className="sm:hidden block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Upload Video
                      </button>

                      <hr className="my-2" />

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
