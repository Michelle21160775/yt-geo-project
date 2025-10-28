import React, { useState, useEffect } from 'react';
import { fetchUserFavorites, removeFromFavorites } from '../utils/favoritesAPI';
import { fetchUserHistory, removeFromHistory, clearAllHistory } from '../utils/historyAPI';

const FavoritesPage = ({ user, onVideoClick, onClose }) => {
    const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' or 'history'
    const [favorites, setFavorites] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [sortBy, setSortBy] = useState('dateAdded'); // 'dateAdded', 'title', 'channel'

    // Icons
    const CloseIcon = () => (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    );

    const GridIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
    );

    const ListIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
    );

    const TrashIcon = () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3,6 5,6 21,6"></polyline>
            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
    );

    const PlayIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="5,3 19,12 5,21"></polygon>
        </svg>
    );

    const HeartIcon = ({ filled = true }) => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
    );

    const ClockIcon = () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12,6 12,12 16,14"></polyline>
        </svg>
    );

    const ClearIcon = () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
    );

    // Fetch data functions
    const fetchFavorites = async () => {
        try {
            const userFavorites = await fetchUserFavorites(user?.id || 'demo_user');
            setFavorites(userFavorites);
        } catch (error) {
            console.error('Error fetching favorites:', error);
            setFavorites([]);
        }
    };

    const fetchHistory = async () => {
        try {
            const userHistory = await fetchUserHistory(user?.id || 'demo_user');
            setHistory(userHistory);
        } catch (error) {
            console.error('Error fetching history:', error);
            setHistory([]);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchFavorites(), fetchHistory()]);
        } finally {
            setLoading(false);
        }
    };

    // Remove functions
    const removeFavorite = async (favoriteId) => {
        try {
            await removeFromFavorites(user?.id || 'demo_user', favoriteId);
            setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
        } catch (error) {
            console.error('Error removing favorite:', error);
        }
    };

    const removeHistoryItem = async (historyId) => {
        try {
            await removeFromHistory(user?.id || 'demo_user', historyId);
            setHistory(prev => prev.filter(item => item.id !== historyId));
        } catch (error) {
            console.error('Error removing history item:', error);
        }
    };

    const clearAllHistoryItems = async () => {
        if (window.confirm('¿Estás seguro de que quieres eliminar todo el historial?')) {
            try {
                await clearAllHistory(user?.id || 'demo_user');
                setHistory([]);
            } catch (error) {
                console.error('Error clearing history:', error);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };

    const formatTimeAgo = (date) => {
        const now = new Date();
        const then = new Date(date);
        const diffMs = now - then;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Ahora mismo';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;
        return formatDate(date);
    };

    // Get current data based on active tab
    const currentData = activeTab === 'favorites' ? favorites : history;
    const currentSortField = activeTab === 'favorites' ? 'dateAdded' : 'watchedAt';

    const sortedData = [...currentData].sort((a, b) => {
        switch (sortBy) {
            case 'title':
                return a.title.localeCompare(b.title);
            case 'channel':
                return a.channel.localeCompare(b.channel);
            case 'dateAdded':
            case 'watchedAt':
            default:
                const dateFieldA = activeTab === 'favorites' ? a.dateAdded : a.watchedAt;
                const dateFieldB = activeTab === 'favorites' ? b.dateAdded : b.watchedAt;
                return new Date(dateFieldB) - new Date(dateFieldA);
        }
    });

    const handleVideoClick = (item) => {
        onVideoClick(item.videoId, {
            title: item.title,
            thumbnail: item.thumbnail,
            channel: item.channel,
            views: item.views,
            publishedTime: item.publishedTime,
            description: item.description
        });
        onClose();
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-[#1a1a24] rounded-xl border border-white/10 p-8">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-white text-lg">Cargando datos...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a1a24] rounded-xl border border-white/10 w-full max-w-7xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${activeTab === 'favorites' ? 'bg-pink-500/20' : 'bg-purple-500/20'}`}>
                            {activeTab === 'favorites' ? <HeartIcon filled={true} /> : <ClockIcon />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                                {activeTab === 'favorites' ? 'Mis Favoritos' : 'Mi Historial'}
                            </h2>
                            <p className="text-gray-400 text-sm">
                                {currentData.length} {currentData.length === 1 ? 'video' : 'videos'} 
                                {activeTab === 'favorites' ? ' guardados' : ' vistos'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`flex items-center gap-2 px-6 py-4 transition-colors relative ${
                            activeTab === 'favorites'
                                ? 'text-pink-300 bg-pink-500/10'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <HeartIcon filled={activeTab === 'favorites'} />
                        <span>Favoritos</span>
                        {favorites.length > 0 && (
                            <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                                {favorites.length}
                            </span>
                        )}
                        {activeTab === 'favorites' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-400"></div>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`flex items-center gap-2 px-6 py-4 transition-colors relative ${
                            activeTab === 'history'
                                ? 'text-purple-300 bg-purple-500/10'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <ClockIcon />
                        <span>Historial</span>
                        {history.length > 0 && (
                            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                                {history.length}
                            </span>
                        )}
                        {activeTab === 'history' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400"></div>
                        )}
                    </button>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        {activeTab === 'history' && history.length > 0 && (
                            <button
                                onClick={clearAllHistoryItems}
                                className="flex items-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors text-sm"
                                title="Borrar todo el historial"
                            >
                                <ClearIcon />
                                Limpiar historial
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === 'grid'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white/10 text-gray-400 hover:text-white'
                            }`}
                            title="Vista en cuadrícula"
                        >
                            <GridIcon />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${
                                viewMode === 'list'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white/10 text-gray-400 hover:text-white'
                            }`}
                            title="Vista en lista"
                        >
                            <ListIcon />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {currentData.length === 0 ? (
                        <div className="text-center py-16">
                            <div className={`inline-flex p-6 rounded-full mb-4 ${
                                activeTab === 'favorites' ? 'bg-pink-500/10' : 'bg-purple-500/10'
                            }`}>
                                {activeTab === 'favorites' ? <HeartIcon filled={false} /> : <ClockIcon />}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-300 mb-2">
                                {activeTab === 'favorites' 
                                    ? 'No tienes favoritos aún' 
                                    : 'No tienes historial aún'
                                }
                            </h3>
                            <p className="text-gray-500">
                                {activeTab === 'favorites' 
                                    ? 'Agrega videos a favoritos para verlos aquí más tarde'
                                    : 'Los videos que reproduzcas aparecerán aquí'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className={
                            viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                : 'space-y-4'
                        }>
                            {sortedData.map((item) => (
                                <div
                                    key={item.id}
                                    className={`group bg-[#0a0a0a]/50 border border-white/10 rounded-lg overflow-hidden hover:border-purple-400/50 transition-all ${
                                        viewMode === 'list' ? 'flex gap-4 p-4' : ''
                                    }`}
                                >
                                    {/* Thumbnail */}
                                    <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className={`w-full ${viewMode === 'list' ? 'h-28' : 'h-48'} object-cover`}
                                        />
                                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                                            {item.duration}
                                        </div>
                                        
                                        {/* Watch progress bar for history */}
                                        {activeTab === 'history' && item.watchProgress > 0 && (
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                                                <div 
                                                    className="h-full bg-red-500"
                                                    style={{ width: `${item.watchProgress}%` }}
                                                ></div>
                                            </div>
                                        )}
                                        
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                            <button
                                                onClick={() => handleVideoClick(item)}
                                                className="opacity-0 group-hover:opacity-100 bg-purple-600 hover:bg-purple-700 p-3 rounded-full transition-all transform scale-75 group-hover:scale-100"
                                            >
                                                <PlayIcon />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className={`${viewMode === 'list' ? 'flex-1' : 'p-4'}`}>
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 
                                                className="font-semibold text-white line-clamp-2 group-hover:text-purple-300 transition-colors cursor-pointer"
                                                onClick={() => handleVideoClick(item)}
                                            >
                                                {item.title}
                                            </h3>
                                            <button
                                                onClick={() => activeTab === 'favorites' ? removeFavorite(item.id) : removeHistoryItem(item.id)}
                                                className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                                                title={activeTab === 'favorites' ? 'Eliminar de favoritos' : 'Eliminar del historial'}
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 mb-2">
                                            <img
                                                src={item.channelThumbnail}
                                                alt={item.channel}
                                                className="w-6 h-6 rounded-full"
                                            />
                                            <span className="text-gray-300 text-sm">{item.channel}</span>
                                        </div>
                                        
                                        <div className="text-gray-400 text-sm space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span>{item.views}</span>
                                                <span>•</span>
                                                <span>{item.publishedTime}</span>
                                            </div>
                                            <div className="text-xs">
                                                {activeTab === 'favorites' 
                                                    ? `Agregado: ${formatDate(item.dateAdded)}`
                                                    : `Visto: ${formatTimeAgo(item.watchedAt)}`
                                                }
                                            </div>
                                            {activeTab === 'history' && item.watchProgress > 0 && (
                                                <div className="text-xs text-purple-300">
                                                    Progreso: {item.watchProgress}%
                                                </div>
                                            )}
                                        </div>

                                        {viewMode === 'list' && (
                                            <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FavoritesPage;