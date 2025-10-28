require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const passport = require('./config/passport');
const { connect } = require('./config/database');

// Route imports
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const favoritesRoutes = require('./routes/favorites');
const historyRoutes = require('./routes/history');
const commentsRoutes = require('./routes/comments');

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/comments', commentsRoutes);

// Función auxiliar para realizar llamadas a la API de YouTube
async function youtubeApiCall(endpoint, params) {
    const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';
    try {
        const response = await axios.get(`${YOUTUBE_BASE_URL}/${endpoint}`, {
            params: {
                ...params,
                key: process.env.YOUTUBE_API_KEY
            }
        });
        return response.data;
    } catch (error) {
        console.error(`Error calling YouTube API ${endpoint}:`, error.message);
        throw error;
    }
}

// Función para enriquecer videos con metadatos adicionales
async function enrichVideosWithMetadata(videoIds) {
    if (!videoIds.length) return {};

    const batchSize = 50; // YouTube API limit
    const enrichedVideos = {};

    for (let i = 0; i < videoIds.length; i += batchSize) {
        const batch = videoIds.slice(i, i + batchSize);
        const data = await youtubeApiCall('videos', {
            part: 'contentDetails,statistics',
            id: batch.join(',')
        });

        data.items.forEach(video => {
            enrichedVideos[video.id] = {
                duration: video.contentDetails.duration,
                viewCount: video.statistics.viewCount,
                likeCount: video.statistics.likeCount
            };
        });
    }

    return enrichedVideos;
}

// Función para enriquecer información de canales
async function enrichChannelsWithMetadata(channelIds) {
    if (!channelIds.length) return {};

    const batchSize = 50;
    const enrichedChannels = {};

    for (let i = 0; i < channelIds.length; i += batchSize) {
        const batch = channelIds.slice(i, i + batchSize);
        const data = await youtubeApiCall('channels', {
            part: 'snippet',
            id: batch.join(',')
        });

        data.items.forEach(channel => {
            enrichedChannels[channel.id] = {
                title: channel.snippet.title,
                thumbnailUrl: channel.snippet.thumbnails.default?.url || channel.snippet.thumbnails.medium?.url
            };
        });
    }

    return enrichedChannels;
}

// Función para procesar y clasificar videos
function processAndClassifyVideos(searchResults, videoMetadata, channelMetadata) {
    const CHANNEL_THRESHOLD = 2; // Umbral configurable para "Canal Relacionado"

    // Agrupar videos por canal
    const videosByChannel = {};

    searchResults.forEach(video => {
        const channelId = video.snippet.channelId;
        if (!videosByChannel[channelId]) {
            videosByChannel[channelId] = [];
        }

        const enrichedVideo = {
            video_id: video.id.videoId,
            title: video.snippet.title,
            channel_title: video.snippet.channelTitle,
            duration: videoMetadata[video.id.videoId]?.duration || 'PT0S',
            view_count: parseInt(videoMetadata[video.id.videoId]?.viewCount || '0'),
            published_at: video.snippet.publishedAt,
            thumbnail_url: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url
        };

        videosByChannel[channelId].push(enrichedVideo);
    });

    // Clasificar en canales relacionados y videos individuales
    const relatedChannels = [];
    const otherVideos = [];

    Object.entries(videosByChannel).forEach(([channelId, videos]) => {
        if (videos.length >= CHANNEL_THRESHOLD) {
            // Canal relacionado
            relatedChannels.push({
                channel_id: channelId,
                channel_title: channelMetadata[channelId]?.title || videos[0].channel_title,
                channel_thumbnail_url: channelMetadata[channelId]?.thumbnailUrl || '',
                videos: videos.map(video => {
                    const { channel_title, ...videoWithoutChannelTitle } = video;
                    return videoWithoutChannelTitle;
                })
            });
        } else {
            // Videos individuales
            otherVideos.push(...videos);
        }
    });

    return { relatedChannels, otherVideos };
}

app.post('/api/search', async (req, res) => {
    const { query, lat, lon } = req.body;

    console.dir(req.body);

    if (!query || !lat || !lon) {
        return res.status(400).json({ error: 'Faltan parámetros de búsqueda.' });
    }

    const encodedQuery = encodeURIComponent(query);
    const radius = req.body.radius || '10km';

    try {
        // 1. Búsqueda inicial
        const searchData = await youtubeApiCall('search', {
            part: 'snippet',
            q: query,
            type: 'video',
            location: `${lat},${lon}`,
            locationRadius: radius,
            maxResults: 25,
            regionCode: 'MX',
            relevanceLanguage: 'es'
        });

        console.dir(searchData, { depth: null });

        if (!searchData.items || searchData.items.length === 0) {
            return res.json({
                status: 'success',
                search_term: query,
                geolocation: { lat, lon, radius },
                results: {
                    related_channels: [],
                    other_videos: []
                }
            });
        }

        // 2. Extraer IDs únicos
        const videoIds = searchData.items.map(item => item.id.videoId);
        const channelIds = [...new Set(searchData.items.map(item => item.snippet.channelId))];

        // 3. Enriquecer con metadatos
        const [videoMetadata, channelMetadata] = await Promise.all([
            enrichVideosWithMetadata(videoIds),
            enrichChannelsWithMetadata(channelIds)
        ]);

        // 4. Procesar y clasificar
        const { relatedChannels, otherVideos } = processAndClassifyVideos(
            searchData.items,
            videoMetadata,
            channelMetadata
        );

        // 5. Respuesta estructurada
        const response = {
            status: 'success',
            search_term: query,
            geolocation: {
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                radius
            },
            results: {
                related_channels: relatedChannels,
                other_videos: otherVideos
            }
        };

        console.log('Processed search results:', JSON.stringify(response, null, 2));
        res.json(response);

    } catch (error) {
        console.error("Error al procesar búsqueda:", error.message);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});

// Nuevo endpoint para navegación a página de canal específico
app.post('/api/channel-videos', async (req, res) => {
    const { channelId, lat, lon, query } = req.body;

    if (!channelId || !lat || !lon) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos.' });
    }

    const radius = '10km';
    const encodedQuery = query ? encodeURIComponent(query) : '';

    try {
        // Búsqueda específica del canal con filtros geográficos
        const searchParams = {
            part: 'snippet',
            channelId: channelId,
            type: 'video',
            location: `${lat},${lon}`,
            locationRadius: radius,
            maxResults: 50,
            regionCode: 'MX',
            relevanceLanguage: 'es'
        };

        if (encodedQuery) {
            searchParams.q = encodedQuery;
        }

        const searchData = await youtubeApiCall('search', searchParams);

        if (!searchData.items || searchData.items.length === 0) {
            return res.json({
                status: 'success',
                channel_id: channelId,
                geolocation: { lat, lon, radius },
                videos: []
            });
        }

        // Enriquecer videos con metadatos
        const videoIds = searchData.items.map(item => item.id.videoId);
        const videoMetadata = await enrichVideosWithMetadata(videoIds);

        // Procesar videos del canal
        const videos = searchData.items.map(video => ({
            video_id: video.id.videoId,
            title: video.snippet.title,
            duration: videoMetadata[video.id.videoId]?.duration || 'PT0S',
            view_count: parseInt(videoMetadata[video.id.videoId]?.viewCount || '0'),
            published_at: video.snippet.publishedAt,
            thumbnail_url: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url
        }));

        res.json({
            status: 'success',
            channel_id: channelId,
            geolocation: {
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                radius
            },
            videos
        });

    } catch (error) {
        console.error("Error al obtener videos del canal:", error.message);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});

const PORT = 3001;

// Initialize database and start server
const startServer = async () => {
    try {
        await connect();
        console.log('Database connected successfully');

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

void startServer();