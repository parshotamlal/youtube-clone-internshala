import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const menuItems = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'Trending', path: '/trending', icon: 'trending' },
    { name: 'Subscriptions', path: '/subscriptions', icon: 'subscriptions', authRequired: true },
    { name: 'Library', path: '/library', icon: 'library', authRequired: true },
    { name: 'History', path: '/history', icon: 'history', authRequired: true },
  ];

  const categories = [
    'Music', 'Sports', 'Gaming', 'Movies', 'News', 'Live', 'Fashion', 'Learning', 'Spotlight'
  ];

  const isActive = (path) => location.pathname === path;

  const getIcon = (iconName) => {
    const icons = {
      home: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      ),
      trending: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
        </svg>
      ),
      subscriptions: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 8H4V6h16v2zm-2-6H6v2h12V2zm4 10v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-6 4l-6-3.27v6.53L16 16z"/>
        </svg>
      ),
      library: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
        </svg>
      ),
      history: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
        </svg>
      ),
    };
    return icons[iconName] || icons.home;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 w-64
        md:translate-x-0 md:static md:top-0 md:h-screen md:pt-16
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full overflow-y-auto py-4">
          {/* Main Navigation */}
          <nav className="px-3">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                if (item.authRequired && !isAuthenticated) return null;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className={`
                        flex items-center space-x-6 px-3 py-2 rounded-lg transition-colors
                        ${isActive(item.path) 
                          ? 'bg-gray-100 text-youtube-red' 
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <span className={isActive(item.path) ? 'text-youtube-red' : 'text-gray-600'}>
                        {getIcon(item.icon)}
                      </span>
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <hr className="my-4 mx-3" />

          {/* Explore Categories */}
          <div className="px-3">
            <h3 className="text-gray-500 text-sm font-semibold mb-3 px-3">EXPLORE</h3>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    to={`/category/${category.toLowerCase()}`}
                    onClick={onClose}
                    className="flex items-center space-x-6 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-600">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                      </svg>
                    </span>
                    <span className="font-medium">{category}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
       <div className="mt-auto px-4 py-4 border-t border-gray-200">
  <div className="text-xs text-gray-500 space-y-3">
    {/* Links Row 1 */}
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      <Link to="/about" className="hover:text-gray-700">About</Link>
      <Link to="/press" className="hover:text-gray-700">Press</Link>
      <Link to="/copyright" className="hover:text-gray-700">Copyright</Link>
    </div>
    {/* Divider */}
      <hr className="border-gray-700" />

    {/* Links Row 2 */}

       <div className="px-4 py-3 flex flex-wrap gap-x-2 gap-y-1 text-xs">
        <Link to="/about" className="hover:underline">About</Link>
        <Link to="/press" className="hover:underline">Press</Link>
        <Link to="/copyright" className="hover:underline">Copyright</Link>
        <Link to="/contact" className="hover:underline">Contact us</Link>
        <Link to="/creator" className="hover:underline">Creator</Link>
        <Link to="/advertise" className="hover:underline">Advertise</Link>
        <Link to="/developers" className="hover:underline">Developers</Link>
      </div>
    {/* Links Row 3 */}
      <div className="px-4 pb-4 flex flex-wrap gap-x-2 gap-y-1 text-xs">
        <Link to="/terms" className="hover:underline">Terms</Link>
        <Link to="/privacy" className="hover:underline">Privacy</Link>
        <Link to="/policy" className="hover:underline">Policy & Safety</Link>
        <Link to="/how-it-works" className="hover:underline">How YouTube works</Link>
        <Link to="/test-new" className="hover:underline">Test new features</Link>
      </div>
        {/* Copyright */}
      <div className="px-4 pb-4 text-xs text-gray-500">
        © 2025 Google LLC
      </div>
  </div>
</div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
