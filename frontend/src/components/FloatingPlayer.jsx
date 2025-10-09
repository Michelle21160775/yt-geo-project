import React from 'react';

const FloatingPlayer = ({ 
  videoId, 
  videoInfo, 
  onClose, 
  isMinimized, 
  onToggleMinimize, 
  onExpand
}) => {
  const playerSize = isMinimized 
    ? { width: '200px', height: '112px' }
    : { width: '356px', height: '200px' };

  return (
    <div 
      className={`fixed bottom-4 right-4 bg-black rounded-lg shadow-2xl z-50 transition-all duration-300 ${
        isMinimized ? 'scale-75' : 'scale-100'
      }`}
      style={playerSize}
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-t-lg">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <svg className="w-4 h-4 text-red-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          <span className="text-white text-sm truncate">
            {videoInfo?.title || 'Video'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onExpand}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Expandir"
          >
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 3 21 3 21 9"></polyline>
              <polyline points="9 21 3 21 3 15"></polyline>
              <line x1="21" y1="3" x2="14" y2="10"></line>
              <line x1="3" y1="21" x2="10" y2="14"></line>
            </svg>
          </button>
          <button
            onClick={onToggleMinimize}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title={isMinimized ? "Restaurar" : "Minimizar"}
          >
            {isMinimized ? (
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 11 12 14 15 11"></polyline>
                <polyline points="9 7 12 4 15 7"></polyline>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 13 12 16 9 13"></polyline>
                <polyline points="15 9 12 6 9 9"></polyline>
              </svg>
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            title="Cerrar"
          >
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0`}
          width="100%"
          height={isMinimized ? "80" : "168"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-b-lg"
        />
      </div>
    </div>
  );
};

export default FloatingPlayer;