import React, { useEffect, useRef, useState } from "react";

const WatchPage = ({
  videoId,
  videoInfo,
  onClose,
  onMinimize,
  onAddToFavorites,
  onVideoSelect,
  recommendedVideos = [],
}) => {
  const playerRef = useRef(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const youtubePlayerRef = useRef(null);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [heartKey, setHeartKey] = useState(0); // Para forzar re-render de la animación

  // Utility functions
  const formatViewCount = (count) => {
    if (!count) return "0";
    const num = parseInt(count);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString();
  };

  const formatPublishedAt = (publishedAt) => {
    if (!publishedAt) return "";
    try {
      const date = new Date(publishedAt);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Hoy";
      if (diffDays === 1) return "Ayer";
      if (diffDays < 7) return `Hace ${diffDays} días`;
      if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
      if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
      return `Hace ${Math.floor(diffDays / 365)} años`;
    } catch (error) {
      return "";
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return "";
    try {
      // Si duration es en formato ISO 8601 (PT1M30S)
      if (duration.startsWith("PT")) {
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        if (match) {
          const hours = parseInt(match[1]) || 0;
          const minutes = parseInt(match[2]) || 0;
          const seconds = parseInt(match[3]) || 0;

          if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
              .toString()
              .padStart(2, "0")}`;
          } else {
            return `${minutes}:${seconds.toString().padStart(2, "0")}`;
          }
        }
      }

      // Si es un número (segundos)
      const totalSeconds = parseInt(duration);
      if (!isNaN(totalSeconds)) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
          return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
        } else {
          return `${minutes}:${seconds.toString().padStart(2, "0")}`;
        }
      }

      return duration;
    } catch (error) {
      return duration || "";
    }
  };

  // Handle add to favorites with animation
  const handleAddToFavorites = () => {
    // Trigger the heart animation with new key for re-render
    setHeartKey(prev => prev + 1);
    setShowHeartAnimation(true);
    
    // Call the original callback
    if (onAddToFavorites) {
      onAddToFavorites(videoId, videoInfo);
    }
    
    // Hide animation after it completes
    setTimeout(() => {
      setShowHeartAnimation(false);
    }, 2500); // Slightly longer duration for better effect
  };

  // YouTube Player Initialization
  useEffect(() => {
    if (!videoId || !playerRef.current) return;

    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        initializePlayer();
        return;
      }

      if (!window.onYouTubeIframeAPIReady) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = initializePlayer;
      }
    };

    const initializePlayer = () => {
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.destroy();
      }

      youtubePlayerRef.current = new window.YT.Player(playerRef.current, {
        videoId: videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event) => {
            setIsPlayerReady(true);
            console.log("YouTube Player Ready");
          },
          onError: (event) => {
            console.error("YouTube Player Error:", event.data);
          },
        },
      });
    };

    loadYouTubeAPI();

    return () => {
      if (youtubePlayerRef.current) {
        try {
          youtubePlayerRef.current.destroy();
        } catch (error) {
          console.log("Error destroying player:", error);
        }
      }
    };
  }, [videoId]);

  if (!videoId) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] z-50 flex items-center justify-center">
        <div className="text-white text-xl">No video selected</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Simple Header */}
        <div className="bg-[#1a1a24]/95 backdrop-blur-md border-b border-white/10 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Volver"
            >
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5"></path>
                <path d="M12 19l-7-7 7-7"></path>
              </svg>
            </button>

            <h1 className="text-lg font-semibold text-white">Video Player</h1>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Cerrar"
            >
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Section - Video Player and Info in same scrollable container */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="w-full max-w-4xl mx-auto p-6">
              {/* Video Player Container */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl mb-6 relative">
                <div ref={playerRef} className="w-full h-full"></div>
                
                {/* Heart Animation Overlay */}
                {showHeartAnimation && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Main central heart */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        key={`main-${heartKey}`}
                        className="text-7xl"
                        style={{
                          animation: 'floatHeartMain 2.5s ease-out forwards',
                          filter: 'drop-shadow(0 0 15px rgba(236, 72, 153, 0.8))'
                        }}
                      >
                        ❤️
                      </div>
                    </div>
                    
                    {/* Smaller floating hearts */}
                    {[...Array(4)].map((_, index) => (
                      <div
                        key={`heart-${heartKey}-${index}`}
                        className="absolute text-4xl"
                        style={{
                          left: `${25 + index * 15}%`,
                          top: '60%',
                          animation: `floatHeartSmall 2s ease-out forwards`,
                          animationDelay: `${index * 0.2}s`,
                          filter: 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.6))'
                        }}
                      >
                        💖
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Custom CSS for heart animations */}
                <style jsx>{`
                  @keyframes floatHeartMain {
                    0% {
                      transform: scale(0) translateY(0px) rotate(0deg);
                      opacity: 0;
                    }
                    15% {
                      transform: scale(1.3) translateY(-15px) rotate(-5deg);
                      opacity: 1;
                    }
                    30% {
                      transform: scale(1.1) translateY(-30px) rotate(5deg);
                      opacity: 1;
                    }
                    70% {
                      transform: scale(0.9) translateY(-80px) rotate(-2deg);
                      opacity: 0.7;
                    }
                    100% {
                      transform: scale(0.5) translateY(-120px) rotate(0deg);
                      opacity: 0;
                    }
                  }
                  
                  @keyframes floatHeartSmall {
                    0% {
                      transform: scale(0) translateY(0px) translateX(0px);
                      opacity: 0;
                    }
                    20% {
                      transform: scale(1) translateY(-10px) translateX(-5px);
                      opacity: 0.8;
                    }
                    100% {
                      transform: scale(0.3) translateY(-60px) translateX(10px);
                      opacity: 0;
                    }
                  }
                `}</style>
              </div>

              {/* Video Info and Controls */}
              <div className="bg-[#1a1a24] rounded-lg p-4 border border-white/10">
                {/* Video Title and Action Buttons in same row */}
                <div className="flex items-center gap-4 mb-3">
                  <h2 className="flex-1 text-xl font-bold text-white truncate">
                    {videoInfo?.title || "Cargando..."}
                  </h2>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={onMinimize}
                      className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white"
                      title="Minimizar reproductor"
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="4 14 10 14 10 20"></polyline>
                        <polyline points="20 10 14 10 14 4"></polyline>
                        <line x1="14" y1="10" x2="21" y2="3"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                      </svg>
                    </button>

                    <button
                      onClick={handleAddToFavorites}
                      className="p-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors text-white group"
                      title="Agregar a favoritos"
                    >
                      <svg
                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Channel and Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <span className="font-medium">
                    {videoInfo?.channel || "Canal"}
                  </span>
                  {videoInfo?.views && (
                    <>
                      <span>•</span>
                      <span>{formatViewCount(videoInfo.views)} vistas</span>
                    </>
                  )}
                  {videoInfo?.publishedAt && (
                    <>
                      <span>•</span>
                      <span>{formatPublishedAt(videoInfo.publishedAt)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Videos Sidebar */}
          <div className="w-96 bg-[#1a1a24] border-l border-white/10 overflow-y-auto custom-scrollbar">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                Videos Relacionados
              </h3>

              <div className="space-y-3">
                {recommendedVideos
                  .filter((video) => video && video.video_id && video.title)
                  .map((video) => (
                    <div
                      key={video.video_id}
                      className="flex gap-3 p-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors group"
                      onClick={() => onVideoSelect(video.video_id, video)}
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-32 h-20 object-cover rounded-lg"
                        />
                        {video.duration && (
                          <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                            {formatDuration(video.duration)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                          {video.title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1 truncate">
                          {video.channel_title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          {video.view_count && (
                            <>
                              <span>
                                {formatViewCount(video.view_count)} vistas
                              </span>
                              {video.published_at && <span>•</span>}
                            </>
                          )}
                          {video.published_at && (
                            <span>{formatPublishedAt(video.published_at)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                {recommendedVideos.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-sm">
                      No hay videos relacionados disponibles
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
