import React from 'react';
import RelatedChannelCard from './RelatedChannelCard';
import VideoCard from './VideoCard';

const ResultsDisplay = ({ 
  results, 
  searchTerm, 
  geolocation, 
  onVideoClick, 
  onChannelClick 
}) => {
  if (!results) return null;

  const { related_channels = [], other_videos = [] } = results;
  const totalResults = related_channels.length + other_videos.length;

  if (totalResults === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex p-6 bg-gray-500/10 rounded-full mb-4">
          <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">
          No se encontraron resultados
        </h3>
        <p className="text-gray-500">
          Intenta con otros términos de búsqueda o cambia el radio de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search Info */}
      <div className="bg-[#1a1a24]/50 rounded-xl border border-white/10 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">
              Resultados para "{searchTerm}"
            </h3>
            <p className="text-sm text-gray-400">
              {related_channels.length} canal{related_channels.length !== 1 ? 'es' : ''} relacionado{related_channels.length !== 1 ? 's' : ''} • {other_videos.length} video{other_videos.length !== 1 ? 's' : ''} individual{other_videos.length !== 1 ? 'es' : ''}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-purple-400">
              Radio: {geolocation?.radius || '50km'}
            </p>
            <p className="text-xs text-gray-500">
              {geolocation?.lat?.toFixed(4)}, {geolocation?.lon?.toFixed(4)}
            </p>
          </div>
        </div>
      </div>

      {/* Related Channels */}
      {related_channels.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Canales Relacionados
            <span className="text-sm text-gray-400 font-normal">({related_channels.length})</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {related_channels.map((channel) => (
              <RelatedChannelCard
                key={channel.channel_id}
                channel={channel}
                onChannelClick={onChannelClick}
                onVideoClick={onVideoClick}
              />
            ))}
          </div>
        </section>
      )}

      {/* Other Videos */}
      {other_videos.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <svg className="w-6 h-6 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
            Otros Videos
            <span className="text-sm text-gray-400 font-normal">({other_videos.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-x-4 lg:gap-y-6">
            {other_videos.map((video) => (
              <VideoCard
                key={video.video_id}
                video={video}
                onVideoClick={onVideoClick}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ResultsDisplay;