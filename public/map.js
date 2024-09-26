// Initialize the map and set its view
const map = L.map('map').setView([-27.4705, 153.0260], 13);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Add a marker to the map
// L.marker([-27.4705, 153.0260])
//     .addTo(map)
//     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//     .openPopup();


// Example heatmap data (latitude, longitude, intensity)
var heatData = [
    [-27.4705, 153.026, 0.9], // Example point
    // [-27.48552, 152.993492, 0.7], // Example point
    [-27.4977, 153.0129, 0.6]
];

// Create the heat layer
var heat = L.heatLayer(heatData, {
    radius: 40,
    blur: 30,
    maxZoom: 2
}).addTo(map);

L.heatLayer([[-27.48552, 152.993492, 0.7]], {
    radius: 25,
    blur: 20,
    maxZoom: 10
}).addTo(map);