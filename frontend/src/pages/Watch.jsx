import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideoById, likeVideo, dislikeVideo, fetchVideos } from '../redux/videoSlice';
import { useAuth } from '../hooks/useAuth';
import CommentBox from '../components/CommentBox';
import VideoCard from '../components/VideoCard';
import Loader from '../components/Loader';
import { formatNumber, formatTimeAgo, getUserAvatar } from '../utils/helpers';

const Watch = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useAuth();
  const { currentVideo, videos, isLoading } = useSelector((state) => state.videos);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchVideoById(id));
      // Fetch related videos
      dispatch(fetchVideos({ limit: 12 }));
    }
  }, [dispatch, id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    dispatch(likeVideo(id));
  };

  const handleDislike = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    dispatch(dislikeVideo(id));
  };

  if (isLoading || !currentVideo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="aspect-video bg-gray-200 rounded-lg mb-4" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />
            <div className="flex space-x-4 mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const relatedVideos = videos.filter(video => video.id !== currentVideo.id).slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="bg-black rounded-lg overflow-hidden shadow-lg">
              <video
                controls
                className="video-player w-full aspect-video"
                src={currentVideo.videoUrl}
                poster={currentVideo.thumbnail}
              >
                <source src={currentVideo.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {currentVideo.title}
              </h1>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
                <div className="flex items-center space-x-4 text-gray-600">
                  <span>{formatNumber(currentVideo.views)} views</span>
                  <span>•</span>
                  <span>{formatTimeAgo(currentVideo.createdAt)}</span>
                </div>
                
                {/* Like/Dislike Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLike}
                    className={`
                      btn-hover flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors
                      ${currentVideo.userLiked
                        ? 'bg-blue-100 border-blue-500 text-blue-600'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                    </svg>
                    <span>{formatNumber(currentVideo.likes || 0)}</span>
                  </button>
                  
                  <button
                    onClick={handleDislike}
                    className={`
                      btn-hover flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors
                      ${currentVideo.userDisliked
                        ? 'bg-red-100 border-red-500 text-red-600'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
                    </svg>
                    <span>{formatNumber(currentVideo.dislikes || 0)}</span>
                  </button>
                </div>
              </div>

              {/* Channel Info */}
              <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
                <Link to={`/channel/${currentVideo.channel?.id}`}>
                  <img
                    src={currentVideo.channel?.avatar || getUserAvatar(currentVideo.channel?.id)}
                    alt={currentVideo.channel?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    to={`/channel/${currentVideo.channel?.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {currentVideo.channel?.name}
                  </Link>
                  <p className="text-sm text-gray-600">
                    {formatNumber(currentVideo.channel?.subscriberCount || 0)} subscribers
                  </p>
                </div>
                <button className="btn-hover bg-youtube-red text-white px-6 py-2 rounded-full hover:bg-red-600 transition-colors">
                  Subscribe
                </button>
              </div>

              {/* Description */}
              <div className="mt-4">
                <div className={`text-gray-800 ${showFullDescription ? '' : 'line-clamp-3'}`}>
                  {currentVideo.description || 'No description available.'}
                </div>
                {currentVideo.description && currentVideo.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2"
                  >
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <CommentBox videoId={id} />
          </div>

          {/* Sidebar - Related Videos */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Videos</h3>
            <div className="space-y-4">
              {relatedVideos.map((video) => (
                <div key={video.id} className="flex space-x-3 group">
                  <Link to={`/watch/${video.id}`} className="flex-shrink-0">
                    <div className="relative w-40 aspect-video bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={video.thumbnail || `https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400&h=225&fit=crop`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      {video.duration && (
                        <span className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 py-0.5 rounded">
                          {video.duration}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/watch/${video.id}`}>
                      <h4 className="font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors text-sm mb-1">
                        {video.title}
                      </h4>
                    </Link>
                    <Link
                      to={`/channel/${video.channel?.id}`}
                      className="text-xs text-gray-600 hover:text-gray-900 transition-colors block mb-1"
                    >
                      {video.channel?.name}
                    </Link>
                    <div className="flex items-center text-xs text-gray-500 space-x-1">
                      <span>{formatNumber(video.views)} views</span>
                      <span>•</span>
                      <span>{formatTimeAgo(video.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;