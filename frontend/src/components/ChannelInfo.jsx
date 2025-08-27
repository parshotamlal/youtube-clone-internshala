import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { formatNumber, getUserAvatar } from '../utils/helpers';

const ChannelInfo = ({ channel, onSubscribe, onUnsubscribe, loading }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!channel) return null;

  const isOwner = user && user.id === channel.id;
  const isSubscribed = channel.isSubscribed;

  const handleSubscriptionToggle = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isSubscribed) {
      onUnsubscribe(channel.id);
    } else {
      onSubscribe(channel.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Channel Banner */}
      {channel.banner && (
        <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
          <img
            src={channel.banner}
            alt={`${channel.name} banner`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Channel Info */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <img
              src={channel.avatar || getUserAvatar(channel.id)}
              alt={channel.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
            
            {/* Channel Details */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {channel.name}
              </h1>
              <p className="text-gray-600 mb-2">
                {formatNumber(channel.subscriberCount || 0)} subscribers
              </p>
              {channel.description && (
                <p className="text-gray-700 max-w-2xl line-clamp-2">
                  {channel.description}
                </p>
              )}
            </div>
          </div>

          {/* Action Button */}
          {!isOwner && (
            <button
              onClick={handleSubscriptionToggle}
              disabled={loading}
              className={`
                btn-hover px-6 py-2 rounded-full font-medium transition-all duration-200
                ${isSubscribed
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-youtube-red text-white hover:bg-red-600'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                isSubscribed ? 'Subscribed' : 'Subscribe'
              )}
            </button>
          )}
        </div>

        {/* Channel Stats */}
        <div className="flex items-center space-x-6 mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {formatNumber(channel.videoCount || 0)}
            </div>
            <div className="text-sm text-gray-600">Videos</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {formatNumber(channel.totalViews || 0)}
            </div>
            <div className="text-sm text-gray-600">Views</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {formatNumber(channel.subscriberCount || 0)}
            </div>
            <div className="text-sm text-gray-600">Subscribers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelInfo;