import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';  // To use Leaflet features like custom icons

const API_URL = 'http://localhost:5004/api/locations';

const App = () => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get(API_URL);
                setLocations(response.data);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };

        fetchLocations();
        const interval = setInterval(fetchLocations, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const userIcon = new L.Icon({
      iconUrl: require('./assets/images/location.png'),  // Path to your local image
      iconSize: [32, 32],  // Icon size (adjust as necessary)
      iconAnchor: [16, 32],  // Anchor point of the icon (adjust as necessary)
      popupAnchor: [0, -32], // Popup anchor (adjust as necessary)
    });

    return (
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100vh', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            {locations.map((loc, index) => (
                <Marker key={index} position={[loc.latitude, loc.longitude]} icon={userIcon}>
                    <Popup>
                        User: {loc.userId} <br />
                        Last Updated: {new Date(loc.timestamp).toLocaleString()}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default App;
