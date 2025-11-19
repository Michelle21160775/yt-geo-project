import React from 'react';

const VideoCard = ({ video, onVideoClick }) => {
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
    <div 
      className="bg-transparent hover:bg-white/5 rounded-lg transition-all group cursor-pointer p-2"
      onClick={() => onVideoClick(video.video_id, {
        videoId: video.video_id,
        title: video.title,
        channel: video.channel_title || video.channel_name,
        channel_title: video.channel_title,
        views: video.view_count,
        view_count: video.view_count,
        publishedAt: video.published_at,
        published_at: video.published_at,
        duration: video.duration,
        thumbnail: video.thumbnail_url,
        thumbnail_url: video.thumbnail_url,
        description: video.description || ''
      })}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
        <img
          src={video.thumbnail_url}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {formatDuration(video.duration)}
        </div>
      </div>

      {/* Video Info */}
      <div className="px-0">
        <h3 className="text-sm font-medium line-clamp-2 text-white group-hover:text-purple-300 transition-colors mb-2">
          {video.title}
        </h3>

        <p className="text-xs text-gray-400 mb-2 truncate">
          {video.channel_title}
        </p>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{formatViewCount(video.view_count)} vistas</span>
          <span>•</span>
          <span>{formatPublishedAt(video.published_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;