import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
// import { VideoCardSkeleton } from "../components/VideoCard";
import Loader, { PageLoader } from "../components/Loader";
import VideoPlayerModal from '../components/VideoPlayer';
import axios from "axios";

const Feed = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}user/getpost`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("youtubetoken")}`,
          },
        }
      );

      console.log(response.data?.data);
      setVideos(response.data?.data || []);
    } catch (error) {
      console.log("Error fetching videos:", error);
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Handle video click - open video player
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setShowVideoPlayer(true);

    // Optional: Update URL without navigation
    // window.history.pushState({}, '', `/watch?v=${video.id}`);
  };

  // Close video player
  const handleClosePlayer = () => {
    setShowVideoPlayer(false);
    setSelectedVideo(null);

    // Optional: Reset URL
    // window.history.pushState({}, '', '/');
  };

  // Generate thumbnail from video URL (optional)
  const generateThumbnail = (videoUrl) => {
    // You can implement thumbnail generation here
    // For now, return a placeholder or the video URL itself
    return videoUrl;
  };

  // Format video duration (if you have duration data)
  const formatDuration = (duration) => {
    if (!duration) return "";
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Format view count
  const formatViews = (views) => {
    if (!views) return "0 views";
    if (views < 1000) return `${views} views`;
    if (views < 1000000) return `${(views / 1000).toFixed(1)}K views`;
    return `${(views / 1000000).toFixed(1)}M views`;
  };

  // Format upload date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Filter Section */}
      <div className="sticky top-0 bg-white shadow-sm z-10 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Video Feed</h1>

          {/* Category Filter (optional) */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["all", "recent", "popular", "trending"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  category === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4">
        {isLoading ? (
          // Loading State
          <div>
            <PageLoader/>
          </div>
        ) : videos.length === 0 ? (
          // Empty State
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📹</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No videos found
            </h3>
            <p className="text-gray-500">
              Upload some videos to see them here!
            </p>
          </div>
        ) : (
          // Video Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video)}
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-video bg-gray-200">
                  <video
                    src={video.video_url}
                    className="w-full h-full object-cover"
                    preload="metadata"
                    muted
                    onMouseEnter={(e) => {
                      // Optional: Preview on hover
                      // e.target.play();
                    }}
                    onMouseLeave={(e) => {
                      // e.target.pause();
                      // e.target.currentTime = 0;
                    }}
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="bg-white bg-opacity-90 rounded-full p-3">
                      <svg
                        className="w-8 h-8 text-gray-800"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>

                  {/* Duration Badge (if available) */}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(video.duration)}
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2">
                    {video.title}
                  </h3>

                  {video.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {video.description}
                    </p>
                  )}

                  <div className="text-xs text-gray-500 space-y-1">
                    {video.views && <div>{formatViews(video.views)}</div>}
                    {video.created_at && (
                      <div>{formatDate(video.created_at)}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {showVideoPlayer && selectedVideo && (
        <VideoPlayerModal video={selectedVideo} onClose={handleClosePlayer} />
      )}
    </div>
  );
};

// Video Player Modal Component
// const VideoPlayerModal = ({ video, onClose }) => {
//   useEffect(() => {
//     // Prevent body scroll when modal is open
//     document.body.style.overflow = "hidden";

//     // Cleanup
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, []);

//   // Handle ESC key
//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === "Escape") {
//         onClose();
//       }
//     };

//     document.addEventListener("keydown", handleEsc);
//     return () => document.removeEventListener("keydown", handleEsc);
//   }, [onClose]);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
//       {/* Close Button */}
//       <button
//         onClick={onClose}
//         className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
//       >
//         <svg
//           className="w-8 h-8"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M6 18L18 6M6 6l12 12"
//           />
//         </svg>
//       </button>

//       {/* Video Player */}
//       <div className="w-full max-w-4xl">
//         <video
//           src={video.video_url}
//           controls
//           autoPlay
//           className="w-full h-auto max-h-[80vh] bg-black"
//         />

//         {/* Video Info */}
//         <div className="bg-gray-900 text-white p-4">
//           <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
//           {video.description && (
//             <p className="text-gray-300 text-sm">{video.description}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

export default Feed;