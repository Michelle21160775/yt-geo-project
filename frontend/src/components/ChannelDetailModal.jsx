import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from './VideoCard';
import '../styles/scrollbar.css';
 
const ChannelDetailModal = ({ 
  channel, 
  isOpen, 
  onClose, 
  onVideoClick,
  location,
  radius 
}) => {
  const [channelVideos, setChannelVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && channel && location) {
      fetchChannelVideos();
    }
  }, [isOpen, channel, location, radius]);

  const fetchChannelVideos = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/channel-videos`, {
        channelId: channel.channel_id,
        lat: location.lat,
        lon: location.lon,
        radius: radius
      });
      
      setChannelVideos(response.data.videos || []);
    } catch (err) {
      setError('Error al cargar los videos del canal');
      console.error('Error fetching channel videos:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !channel) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a24] rounded-2xl border border-purple-500/50 max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-t-2xl overflow-hidden">
            <img
              src={channel.channel_thumbnail_url}
              alt={channel.channel_title}
              className="w-full h-full object-cover opacity-50"
            />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          {/* Channel Avatar */}
          <div className="absolute -bottom-8 left-8">
            <img
              src={channel.channel_thumbnail_url}
              alt={channel.channel_title}
              className="w-16 h-16 rounded-full border-4 border-[#1a1a24] shadow-lg"
            />
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="p-8 pt-12 max-h-[calc(90vh-8rem)] overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {channel.channel_title}
            </h2>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Radio: {radius}
              </span>
              <span>•</span>
              <span>{channelVideos.length} videos en esta área</span>
            </div>
          </div>

          {/* Videos Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-4"></div>
              <p className="text-gray-400">Cargando videos del canal...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
                <p className="text-red-300">{error}</p>
              </div>
              <button
                onClick={fetchChannelVideos}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
          ) : channelVideos.length > 0 ? (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-5 h-5 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                </svg>
                <h3 className="text-lg font-semibold text-white">
                  Videos en tu área de búsqueda
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {channelVideos.map((video) => (
                  <VideoCard
                    key={video.video_id}
                    video={video}
                    onVideoClick={onVideoClick}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex p-6 bg-gray-500/10 rounded-full mb-4">
                <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                No hay videos en esta área
              </h3>
              <p className="text-gray-500">
                Este canal no tiene videos dentro de tu radio de búsqueda actual
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelDetailModal;