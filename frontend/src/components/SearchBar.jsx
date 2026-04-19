import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ onSearch, suggestions = [] }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setActiveIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0) {
        setQuery(suggestions[activeIndex].name);
        setIsFocused(false);
      }
    }
  };

  const highlightMatch = (text, term) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === term.toLowerCase() ? 
          <b key={i} className="highlight">{part}</b> : part
        )}
      </span>
    );
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className={`search-wrapper glass ${isFocused ? 'active' : ''}`}>
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search by name, city, code (e.g. ENSA, Casablanca)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button onClick={() => setQuery('')} className="clear-btn">
            <X size={18} />
          </button>
        )}
      </div>

      {isFocused && suggestions.length > 0 && (
        <div className="suggestions glass">
          {suggestions.map((school, index) => (
            <div 
              key={school.id} 
              className={`suggestion-item ${index === activeIndex ? 'active' : ''}`}
              onMouseDown={() => setQuery(school.name)}
            >
              <div className="suggestion-name">{highlightMatch(school.name, query)}</div>
              <div className="suggestion-meta">{school.code} • {school.city}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
