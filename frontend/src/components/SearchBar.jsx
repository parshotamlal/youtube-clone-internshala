import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(query, 300);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-2xl">
      <div className="flex flex-1 border border-gray-300 rounded-l-full overflow-hidden focus-within:border-blue-500 transition-colors">
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={handleInputChange}
          className="flex-1 px-4 py-2 text-gray-700 bg-white focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="bg-gray-50 border border-l-0 border-gray-300 px-6 py-2 rounded-r-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;