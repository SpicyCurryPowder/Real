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

const APIdata = [];

// Function to load data from /api/data and add markers to the map
async function loadMarkersFromAPI() {
    fetch("/api/data")
        .then((response) => response.json())
        .then((data) => {
            data.forEach(function (markerData) {
                const { id, author, time, imgSrc, newsImgSrc, ribbonType, title, content, coordinates } = markerData;
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

                APIdata.push(markerData);
            });

            map.addLayer(markersClusterGroup);
            console.log(333, APIdata)
        })
        .catch((error) => console.error("Error loading data:", error));
}

const nearbyMarkers = [];

const nearbyPosts = [];

// Function to handle the user's location and detect nearby markers
async function detectNearbyMarkers(event) {
    const userLatLng = event.latlng; // Use event.latlng to get the user's location

    // Loop through the markers and check distance from the user's location
    leafletMarkers.forEach(function (markerData) {
        const markerLatLng = L.latLng(markerData.lat, markerData.lng);
        const distance = userLatLng.distanceTo(markerLatLng);

        if (distance <= distanceThreshold) {
            // console.log(`Nearby: ${markerData.id} at ${distance.toFixed(0)} meters`);
            nearbyMarkers.push(markerData.id);
        }
    });

    if (nearbyMarkers) {
        console.log("party over here", nearbyMarkers);
        nearbyMarkers.map((nearbyMarker) => {
            const post = APIdata.find(newsItem => newsItem.id === nearbyMarker);
            // console.log(11111111111111, post)
            nearbyPosts.push(post);
        })
    }
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

// Function to inject the generated HTML into a specific container (for example, a div with id 'posts-container')
async function renderPosts() {
    const postsContainer = document.getElementById('posts-container');

    if (postsContainer) {
        console.log(147, nearbyPosts);

        let html = '<div id="posts-list">';

        nearbyPosts.forEach(function (newsItem) {
            console.log(67, newsItem)
            html += `
            <div class="post" id="post-${newsItem.id}">
                <h3 class="post-title">${newsItem.title}</h3>
                <p class="post-content">${newsItem.content}</p>
            </div>
            `;
        });

        // End the HTML container for posts
        html += '</div>';

        postsContainer.innerHTML = html;
    } else {
        console.error('The container with id "posts-container" does not exist.');
    }
}

// Call the renderPosts function to inject the generated HTML into the page
renderPosts();



