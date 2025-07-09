import React, { useState, useEffect } from 'react';

const SearchBar = ({ searchTerm, onSearchChange, placeholder }) => {
  const [localTerm, setLocalTerm] = useState(searchTerm);
  
  // Debounce para mejorar rendimiento de búsqueda
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(localTerm);
    }, 300);
    
    return () => {
      clearTimeout(handler);
    };
  }, [localTerm, onSearchChange]);
  
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder={placeholder}
        value={localTerm}
        onChange={(e) => setLocalTerm(e.target.value)}
        aria-label="Buscar productos"
      />
      <span className="search-icon">🔍</span>
      {localTerm && (
        <button 
          className="clear-search"
          onClick={() => setLocalTerm('')}
          aria-label="Limpiar búsqueda"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default SearchBar;