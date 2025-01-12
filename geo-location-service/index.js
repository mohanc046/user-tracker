require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.mongooseURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Schema and Model
const LocationSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // User ID (can be device ID or generated UUID)
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Location = mongoose.model('Location', LocationSchema);

// API Endpoints
app.post('/api/location', async (req, res) => {
    const { userId, latitude, longitude } = req.body;
    try {
        await Location.findOneAndUpdate(
            { userId },
            { latitude, longitude, timestamp: new Date(), userId },
            { upsert: true, new: true }
        );
        res.status(200).send({ message: 'Location updated' });
    } catch (err) {
        res.status(500).send({ error: 'Failed to update location' });
    }
});

app.get('/api/locations', async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch locations' });
    }
});

// Start Server
app.listen(5004, () => {
    console.log('Server running on http://localhost:5004');
});
