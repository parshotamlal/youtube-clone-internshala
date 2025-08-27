
import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";

// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Feed from "./pages/Feed";
import Watch from "./pages/Watch";
import Upload from "./pages/Upload";
import SearchResults from "./pages/SearchResults";
import Channel from "./pages/Channel";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Provider store={store}>
      <Router>
        {/* Full App Wrapper */}
        <div className="flex flex-col min-h-screen bg-white text-gray-900">
          {/* Navbar fixed at top */}
          <Navbar onToggleSidebar={toggleSidebar} />

          <div className="flex flex-1 pt-14">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

            {/* Main Content */}
            <main className="flex-1 px-4 md:px-6 lg:px-8 bg-gray-50">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Feed />} />
                <Route path="/watch/:id" element={<Watch />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/channel" element={<Channel />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                  path="/upload"
                  element={
                    <ProtectedRoute>
                      <Upload />
                    </ProtectedRoute>
                  }
                />

                {/* Category routes */}
                <Route path="/category/:category" element={<Feed />} />
                <Route path="/trending" element={<Feed />} />
                <Route path="/subscriptions" element={<Feed />} />
                <Route path="/library" element={<Feed />} />
                <Route path="/history" element={<Feed />} />

                {/* 404 Page */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-[70vh] flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-gray-400 text-6xl mb-4">404</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                          Page not found
                        </h2>
                        <p className="text-gray-600">
                          The page you're looking for doesn't exist.
                        </p>
                      </div>
                    </div>
                  }
                />
              </Routes>

              <Footer />
            </main>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
