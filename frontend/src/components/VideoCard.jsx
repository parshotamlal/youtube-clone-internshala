import React from "react";
import { Link } from "react-router-dom";
import {
  formatTimeAgo,
  formatNumber,
  formatDuration,
  getVideoThumbnail,
  getUserAvatar,
} from "../utils/helpers";

const VideoCard = ({ video, className = "" }) => {
  const {
    id,
    title,
    description,
    thumbnail,
    duration,
    views,
    createdAt,
    channel,
  } = video;

  return (
    <div
      className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in ${className}`}
    >
      {/* Thumbnail */}
      <Link to={`/watch/${id}`} className="block relative group">
        <div className="aspect-video bg-gray-200 overflow-hidden">
          <img
            src={thumbnail || getVideoThumbnail(id)}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.target.src = getVideoThumbnail(id);
            }}
          />
          {duration && (
            <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {formatDuration(duration)}
            </span>
          )}
        </div>
      </Link>

      {/* Video Info */}
      <div className="p-3">
        <div className="flex space-x-3">
          {/* Channel Avatar */}
          <Link to={`/channel/${channel?.id}`} className="flex-shrink-0">
            <img
              src={channel?.avatar || getUserAvatar(channel?.id)}
              alt={channel?.name || "Channel"}
              className="w-9 h-9 rounded-full object-cover"
              onError={(e) => {
                e.target.src = getUserAvatar(channel?.id);
              }}
            />
          </Link>

          {/* Video Details */}
          <div className="flex-1 min-w-0">
            <Link to={`/watch/${id}`}>
              <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors leading-5 mb-1">
                {title}
              </h3>
            </Link>

            <Link
              to={`/channel/${channel?.id}`}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors block mb-1"
            >
              {channel?.name}
            </Link>

            <div className="flex items-center text-sm text-gray-500 space-x-2">
              <span>{formatNumber(views)} views</span>
              <span>•</span>
              <span>{formatTimeAgo(createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton loader for VideoCard
export const VideoCardSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
    <div className="aspect-video bg-gray-200" />
    <div className="p-3">
      <div className="flex space-x-3">
        <div className="w-9 h-9 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  </div>
);

export default VideoCard;
