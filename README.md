
# React Native App - Location Push to Database & React Web App - Location Fetch

## Overview

This project demonstrates how a React Native mobile app collects the user's location and pushes it to a backend database. A React web app then fetches the location data from the database and displays it on a map.

The solution involves:

- A **React Native app** that:
  - Fetches the user's current location.
  - Pushes the location data (latitude and longitude) to a backend server and stores it in a database.
  
- A **React web app** that:
  - Fetches location data from the backend.
  - Displays the locations on a map using a mapping service (e.g., Leaflet or Google Maps).

---

## Table of Contents

1. [React Native App: Pushing Location to the Database](#react-native-app-pushing-location-to-the-database)
2. [Backend: Handling Location Data](#backend-handling-location-data)
3. [React Web App: Pulling Location Data](#react-web-app-pulling-location-data)
4. [Setting Up the Project](#setting-up-the-project)
5. [Running the Application](#running-the-application)
6. [Conclusion](#conclusion)

---

## React Native App: Pushing Location to the Database

The React Native app is responsible for fetching the user's current location and sending it to a backend server to be stored in a database.

### Key Steps:

1. **Get User's Location**:  
   The app uses the `react-native-get-location` library to fetch the user's current latitude and longitude. This is done using the `getCurrentPosition` method, which provides real-time location data.

   Example:
   ```javascript
   import GetLocation from 'react-native-get-location';

   const getLocationAndPushData = async () => {
     try {
       const position = await GetLocation.getCurrentPosition({
         enableHighAccuracy: true,
         timeout: 15000,
         maximumAge: 10000,
       });

       const { latitude, longitude } = position;
       const payload = {
         userId: 'mohan12',  // Replace with dynamic userId if necessary
         latitude,
         longitude,
       };

       await axios.post('http://localhost:5004/api/location', payload); // Post data to API
       console.log('Location pushed successfully!');
     } catch (error) {
       console.error('Error fetching location or pushing data:', error);
     }
   };
   ```

2. **Push Location Data to Backend**:  
   The location data (latitude, longitude, and userId) is sent to a backend service using an HTTP `POST` request. The backend then stores this data in a database for future retrieval.

---

## Backend: Handling Location Data

The backend receives the location data sent from the React Native app and stores it in a database (e.g., MongoDB, MySQL, etc.).

### Key Steps:

1. **Create an API Endpoint**:  
   An API endpoint is created to accept the `POST` request with location data. Here's an example using **Express.js** and **MongoDB**:

   ```javascript
   const express = require('express');
   const mongoose = require('mongoose');
   const app = express();
   const bodyParser = require('body-parser');

   app.use(bodyParser.json());

   // MongoDB connection setup
   mongoose.connect('mongodb://localhost:27017/locationDB', { useNewUrlParser: true, useUnifiedTopology: true });

   const LocationSchema = new mongoose.Schema({
     userId: String,
     latitude: Number,
     longitude: Number,
   });

   const Location = mongoose.model('Location', LocationSchema);

   // API endpoint to accept location data
   app.post('/api/location', async (req, res) => {
     try {
       const { userId, latitude, longitude } = req.body;
       const newLocation = new Location({ userId, latitude, longitude });
       await newLocation.save();
       res.status(200).send('Location saved successfully!');
     } catch (error) {
       res.status(500).send('Error saving location');
     }
   });

   app.listen(5004, () => {
     console.log('Server running on http://localhost:5004');
   });
   ```

2. **Store Data in Database**:  
   The received location data is saved to a MongoDB database using Mongoose.

---

## React Web App: Pulling Location Data

The React web app retrieves the location data stored in the database and displays it on a map.

### Key Steps:

1. **Fetch Location Data**:  
   The web app sends a `GET` request to the backend API to fetch the location data from the database.

   Example:
   ```javascript
   import React, { useEffect, useState } from 'react';
   import axios from 'axios';

   const App = () => {
     const [locations, setLocations] = useState([]);

     useEffect(() => {
       // Fetch location data from the backend
       axios.get('http://localhost:5004/api/locations')
         .then(response => {
           setLocations(response.data);
         })
         .catch(error => {
           console.error('Error fetching location data:', error);
         });
     }, []);

     return (
       <div>
         <h1>User Locations</h1>
         <ul>
           {locations.map(location => (
             <li key={location._id}>
               User ID: {location.userId}, Latitude: {location.latitude}, Longitude: {location.longitude}
             </li>
           ))}
         </ul>
       </div>
     );
   };

   export default App;
   ```

2. **Display Location on Map**:  
   To display the location data on a map, use a mapping library like **Leaflet** or **Google Maps**. Here's how you can use Leaflet:

   ```javascript
   import React, { useEffect, useState } from 'react';
   import L from 'leaflet';
   import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
   import axios from 'axios';

   const MapComponent = () => {
     const [locations, setLocations] = useState([]);

     useEffect(() => {
       axios.get('http://localhost:5004/api/locations')
         .then(response => {
           setLocations(response.data);
         })
         .catch(error => {
           console.error('Error fetching locations:', error);
         });
     }, []);

     return (
       <MapContainer center={[51.505, -0.09]} zoom={13} style={{ width: '100%', height: '500px' }}>
         <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
         {locations.map(location => (
           <Marker key={location._id} position={[location.latitude, location.longitude]}>
             <Popup>
               User ID: {location.userId}
             </Popup>
           </Marker>
         ))}
       </MapContainer>
     );
   };

   export default MapComponent;
   ```

---

## Setting Up the Project

### React Native App

1. Clone or create a new React Native project:
   ```bash
   npx react-native init LocationApp
   cd LocationApp
   ```

2. Install dependencies:
   ```bash
   npm install axios react-native-get-location
   ```

3. Add necessary permissions for location access (for Android/iOS).

4. Implement location fetching and API integration as described above.

### Backend Setup (Node.js and MongoDB)

1. Create a new Node.js project:
   ```bash
   mkdir backend
   cd backend
   npm init -y
   ```

2. Install dependencies:
   ```bash
   npm install express mongoose body-parser
   ```

3. Set up Express API and MongoDB as described above.

4. Run the backend server:
   ```bash
   node server.js
   ```

### React Web App

1. Create a new React app:
   ```bash
   npx create-react-app location-web
   cd location-web
   ```

2. Install required dependencies:
   ```bash
   npm install axios react-leaflet leaflet
   ```

3. Implement the map and location-fetching code as described above.

4. Run the React web app:
   ```bash
   npm start
   ```

---

## Running the Application

1. **Start the Backend**: Run the server to handle API requests.
   ```bash
   node server.js
   ```

2. **Run the React Native App**: Start the React Native app on your device or emulator.
   ```bash
   npx react-native run-android
   ```

3. **Run the React Web App**: Start the React web app and open it in your browser.
   ```bash
   npm start
   ```

---

## Conclusion

In this project:
- The **React Native app** fetches the user's location and pushes it to a backend server.
- The **backend** stores the location data in a database and provides an API to fetch it.
- The **React web app** pulls the location data from the backend and displays it on a map.

This architecture enables real-time tracking and visualizing user locations both in mobile and web applications.

