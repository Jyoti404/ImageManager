import React, { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL;

const SearchBar = ({ onSearch, onClear }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const response = await fetch(
        `${API_BASE}/api/images/search?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.ok) {
        const results = await response.json();
        onSearch(results);
      } else {
        alert('Error searching images');
      }
    } catch (error) {
      console.error('Error searching:', error);
      alert('Error searching images');
    }
    setSearching(false);
  };

  const handleClear = () => {
    setSearchQuery('');
    onClear();
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search images..."
          className="search-input"
        />
        <button type="submit" disabled={searching}>
          {searching ? '🔄' : '🔍'}
        </button>
        {searchQuery && (
          <button type="button" onClick={handleClear} className="clear-btn">
            ✖️
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
