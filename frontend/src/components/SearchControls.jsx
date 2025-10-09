import React from 'react';

const SearchIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const SearchControls = ({ 
  query, 
  setQuery, 
  radius, 
  setRadius, 
  onSearch, 
  loading, 
  location, 
  error 
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const radiusOptions = [
    { value: '25km', label: '25 km' },
    { value: '50km', label: '50 km' },
    { value: '75km', label: '75 km' },
    { value: '100km', label: '100 km' }
  ];

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Encuentra Videos Cerca de Ti
        </h2>
        <p className="text-gray-400 text-lg">
          Descubre contenido geo-localizado en los Valles Centrales
        </p>
      </div>

      {/* Search Controls */}
      <div className="max-w-4xl mx-auto">
        {/* Main Search Bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ej: Guelaguetza, Tlayudas, Monte Albán..."
              className="w-full px-5 py-4 bg-[#1a1a24] border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>
          <button
            onClick={onSearch}
            disabled={!location || loading}
            className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SearchIcon />
            <span className="hidden sm:inline">{loading ? 'Buscando...' : 'Buscar'}</span>
          </button>
        </div>

        {/* Additional Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Location Status */}
          <div className="flex items-center gap-2 text-sm">
            <MapPinIcon className="text-purple-300" />
            <span className={location ? 'text-green-400' : 'text-yellow-400'}>
              {location ? 'Ubicación detectada' : 'Detectando ubicación...'}
            </span>
            {location && (
              <span className="text-gray-500 text-xs">
                ({location.lat.toFixed(4)}, {location.lon.toFixed(4)})
              </span>
            )}
          </div>

          {/* Radius Selector */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400">Radio de búsqueda:</label>
            <select
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="px-3 py-2 bg-[#1a1a24] border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {radiusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Region Code Display */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Región: MX (México)</span>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-500/50 rounded-lg p-3">
            <p className="text-red-300 text-sm text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchControls;