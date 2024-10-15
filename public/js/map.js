// Function to load data from /api/data and add markers to the map
async function loadMarkersFromAPI() {
    fetch("/api/data")
        .then((response) => response.json())
        .then((data) => {
            data.forEach(function (markerData) {
                const { id, author, time, imgSrc, newsImgSrc, ribbonType, title, content, coordinates } = markerData;
                if (coordinates) {
                    const marker = L.marker([coordinates[0], coordinates[1]])
                        .bindPopup(`<b>${ribbonType.toUpperCase()}: ${title}</b>`);

                    markersClusterGroup.addLayer(marker);

                    // Store the marker data
                    leafletMarkers.push({
                        id: id,
                        lat: coordinates[0],
                        lng: coordinates[1],
                        marker: marker,
                    });
                    APIdata.push(markerData);
                }
            });
            
            map.addLayer(markersClusterGroup);
            console.log("Loaded markers:", APIdata);

            // Call detectNearbyMarkers right after loading markers
            map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });
        })
        .catch((error) => console.error("Error loading data:", error));
}

// Function to detect nearby markers (from your current location) and render posts
async function detectNearbyMarkers(event) {
    const userLatLng = event.latlng; // Use event.latlng to get the user's location

    // Reset the nearbyMarkers and nearbyPosts arrays
    nearbyMarkers = [];
    nearbyPosts = [];

    // Loop through the markers and check distance from the user's location
    leafletMarkers.forEach(function (markerData) {
        const markerLatLng = L.latLng(markerData.lat, markerData.lng);
        const distance = userLatLng.distanceTo(markerLatLng);

        if (distance <= distanceThreshold) { // if marker is nearby
            nearbyMarkers.push(markerData.id); // Store the ID of the nearby marker
        }
    });

    console.log("Nearby markers found:", nearbyMarkers);

    // Map through nearbyMarkers and fetch the relevant posts
    nearbyMarkers.forEach((nearbyMarkerId) => {
        const post = APIdata.find(newsItem => newsItem.id === nearbyMarkerId);
        if (post) {
            nearbyPosts.push(post); // Add the post to nearbyPosts
        }
    });

    console.log("Nearby posts:", nearbyPosts);

    // Render the posts after the arrays are updated
    renderPosts();
}

// Function to render the posts
async function renderPosts() {
    const postsContainer = document.getElementById('posts-container');

    if (postsContainer) {
        console.log("Rendering posts:", nearbyPosts);

        if (nearbyPosts.length === 0) {
            postsContainer.innerHTML = '<p>No nearby posts found.</p>';
            return;
        }

        let html = '<div id="posts-list" class="news-container">';

        nearbyPosts.forEach(function (newsItem) {
            console.log("Rendering post:", newsItem);
            html += `
            <article class="news-item" id="news-${newsItem.id}" data-id="${newsItem.id}">
                <div class="ribbon ${newsItem.ribbonType}">
                    ${newsItem.ribbonType}
                </div>

                <div class="news-top">
                    <div class="profile-pic">
                        <img src=${newsItem.imgSrc}> 
                    </div>
                    <span class="user-name">
                        ${newsItem.author}
                    </span>
                    <span class="dot">•</span>
                    <span class="time">
                        ${newsItem.time}
                    </span>
                    <span class="dot">•</span>
                    <span class="news-status">News popular near you</span>
                </div>

                <div class="news-image">
                    <img src=${newsItem.newsImgSrc} %>>
                </div>

                <div class="news-content">
                    <h3>
                        ${newsItem.title}
                    </h3>
                    <p>
                        ${newsItem.content}
                    </p>
                </div>

            </article>
            `;
        });

        html += '</div>'; // End posts list

        postsContainer.innerHTML = html;
    } else {
        console.error('The container with id "posts-container" does not exist.');
    }
}

// Initialize the map
const map = L.map("map").setView([51.505, -0.09], 13); // Default to London

// Add OpenStreetMap tiles to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const markersClusterGroup = L.markerClusterGroup();
const distanceThreshold = 1000; // 1000 meters = 1 km
let leafletMarkers = [];
let APIdata = [];
let nearbyMarkers = [];
let nearbyPosts = [];

// Load the markers on page load
loadMarkersFromAPI();

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

    // Detect nearby markers based on the user's location
    detectNearbyMarkers(event);
});

// Handle location errors
map.on("locationerror", function (event) {
    alert("Unable to retrieve your location. Error: " + event.message);
});
