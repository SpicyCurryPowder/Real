// Initialize the map
const map = L.map("map").setView([51.505, -0.09], 13); // Default to London for example

// Add OpenStreetMap tiles to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const markersClusterGroup = L.markerClusterGroup();

const distanceThreshold = 1000; // 500 meters (adjust as necessary)

// Array to hold the marker data
let leafletMarkers = [];

// Function to load data from /api/data and add markers to the map
function loadMarkersFromAPI() {
    fetch("/api/data")
        .then((response) => response.json())
        .then((data) => {
            data.forEach(function (markerData) {
                const { id, coordinates, title } = markerData;
                const marker = L.marker([coordinates[0], coordinates[1]])
                    .bindPopup(`<b>${id}, ${title}</b>`)
                    // .addTo(map);

                markersClusterGroup.addLayer(marker);

                // Store the marker data
                leafletMarkers.push({
                    id: id,
                    lat: coordinates[0],
                    lng: coordinates[1],
                    marker: marker,
                });
            });

            map.addLayer(markersClusterGroup);
        })
        .catch((error) => console.error("Error loading data:", error));
}

// Function to handle the user's location and detect nearby markers
function detectNearbyMarkers(event) {
    const userLatLng = event.latlng; // Use event.latlng to get the user's location

    // Loop through the markers and check distance from the user's location
    leafletMarkers.forEach(function (markerData) {
        const markerLatLng = L.latLng(markerData.lat, markerData.lng);
        const distance = userLatLng.distanceTo(markerLatLng);

        if (distance <= distanceThreshold) {
            console.log(`Nearby: ${markerData.id} at ${distance.toFixed(0)} meters`);
        }
    });
}

// Use map.locate to get the user's current position
map.locate({
    setView: true, // Automatically center the map on the user's location
    maxZoom: 16, // Set the zoom level when user's location is found
    watch: true, // Optionally watch the user's location for continuous updates
    enableHighAccuracy: true, // Enable high accuracy if available
});

// When location is found, call the detectNearbyMarkers function
map.on("locationfound", function (event) {
    const userPosition = event.latlng;
    L.marker(userPosition).addTo(map).bindPopup("You are here").openPopup();

    // Add a circle around the user's location
    L.circle(userPosition, {
        color: 'blue',
        fillColor: '#30f',
        fillOpacity: 0.2,
        radius: distanceThreshold
    }).addTo(map);

    // Detect nearby markers based on the user's current location
    detectNearbyMarkers(event);
});

// Handle location errors
map.on("locationerror", function (event) {
    alert("Unable to retrieve your location. Error: " + event.message);
});

// Load the markers from the API
loadMarkersFromAPI();
