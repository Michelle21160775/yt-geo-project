require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Auth routes
app.use('/api/auth', authRoutes);

app.post('/api/search', async (req, res) => {
    const { query, lat, lon } = req.body;

    console.dir(req.body);

    if (!query || !lat || !lon) {
        return res.status(400).json({ error: 'Faltan parámetros de búsqueda.' });
    }

    // Encode the query to be URL-safe
    const encodedQuery = encodeURIComponent(query);

    const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';
    const params = {
        part: 'snippet',
        q: encodedQuery,
        type: 'video',
        location: `${lat},${lon}`,
        locationRadius: '10km',
        maxResults: 25,
        regionCode: 'MX',
        relevanceLanguage: 'es',
        key: process.env.YOUTUBE_API_KEY,
    };

    try {
        const response = await axios.get(YOUTUBE_API_URL, { params });
        console.dir(response.data, { depth: null });
        res.json(response.data.items);
    } catch (error) {
        console.error("Error al llamar al API de YouTube:", error.message);
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});




const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
});