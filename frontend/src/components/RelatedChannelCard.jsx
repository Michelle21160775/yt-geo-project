import React from 'react';

const RelatedChannelCard = ({ channel, onChannelClick, onVideoClick }) => {
  const formatDuration = (duration) => {
    // Convert PT5M30S to 5:30
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return duration;
    
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatViewCount = (viewCount) => {
    const count = parseInt(viewCount);
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatPublishedAt = (publishedAt) => {
    const date = new Date(publishedAt);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'hace 1 día';
    if (diffDays < 7) return `hace ${diffDays} días`;
    if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `hace ${Math.floor(diffDays / 30)} meses`;
    return `hace ${Math.floor(diffDays / 365)} años`;
  };

  return (
    <div className="bg-[#1a1a24] rounded-xl border border-white/10 p-6 hover:border-purple-500/50 transition-all">
      {/* Channel Header */}
      <div 
        className="flex items-center gap-4 mb-6 cursor-pointer hover:bg-white/5 rounded-lg p-3 -m-3 transition-colors"
        onClick={() => onChannelClick(channel)}
      >
        <img
          src={channel.channel_thumbnail_url}
          alt={channel.channel_title}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white hover:text-purple-300 transition-colors">
            {channel.channel_title}
          </h3>
          <p className="text-sm text-gray-400">
            {channel.videos.length} video{channel.videos.length > 1 ? 's' : ''} encontrado{channel.videos.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="text-purple-400">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"></path>
          </svg>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="space-y-3">
        {channel.videos
          .filter(video => video && video.video_id && video.title)
          .slice(0, 3)
          .map((video) => (
          <div
            key={video.video_id}
            className="flex gap-3 cursor-pointer hover:bg-white/5 rounded-lg p-2 transition-colors group"
            onClick={() => onVideoClick(video.video_id, {
              title: video.title,
              channel: channel.name,
              views: video.view_count,
              publishedAt: video.published_at,
              duration: video.duration,
              thumbnail: video.thumbnail_url,
              description: video.description || ''
            })}
          >
            <div className="relative flex-shrink-0">
              <img
                src={video.thumbnail_url}
                alt={video.title}
                className="w-32 h-20 object-cover rounded-lg"
              />
              <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                {formatDuration(video.duration)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                {video.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                <span>{formatViewCount(video.view_count)} vistas</span>
                <span>•</span>
                <span>{formatPublishedAt(video.published_at)}</span>
              </div>
            </div>
          </div>
        ))}

        {(() => {
          const validVideos = channel.videos.filter(video => video && video.video_id && video.title);
          return validVideos.length > 3 && (
            <button
              onClick={() => onChannelClick(channel)}
              className="w-full text-sm text-purple-400 hover:text-purple-300 py-2 transition-colors"
            >
              Ver {validVideos.length - 3} video{validVideos.length - 3 > 1 ? 's' : ''} más
            </button>
          );
        })()}
      </div>
    </div>
  );
};

export default RelatedChannelCard;