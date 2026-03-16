'use client';

import { useState, useRef, useEffect } from 'react';

export default function PostcodeSearch({ postcodes, onSearch, onClear }) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleChange(e) {
    const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setValue(v);
    if (v.length >= 2) {
      const matches = postcodes
        .filter(p => p.postcode.startsWith(v))
        .slice(0, 8);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSelect(postcode) {
    setValue(postcode.postcode);
    setShowSuggestions(false);
    onSearch(postcode.postcode);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (value.length === 4) {
      setShowSuggestions(false);
      onSearch(value);
    }
  }

  function handleClear() {
    setValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    onClear();
  }

  return (
    <div className="postcode-search">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter your postcode (e.g. 2000)"
            value={value}
            onChange={handleChange}
            className="search-input"
            maxLength={4}
            inputMode="numeric"
          />
          {value && (
            <button type="button" onClick={handleClear} className="search-clear">
              &times;
            </button>
          )}
        </div>
        <button type="submit" className="search-button" disabled={value.length !== 4}>
          Search
        </button>
      </form>

      {showSuggestions && (
        <div ref={suggestionsRef} className="search-suggestions">
          {suggestions.map((s) => (
            <button
              key={s.postcode + s.locality}
              className="suggestion-item"
              onClick={() => handleSelect(s)}
            >
              <span className="suggestion-postcode">{s.postcode}</span>
              <span className="suggestion-locality">{s.locality}, {s.state}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
