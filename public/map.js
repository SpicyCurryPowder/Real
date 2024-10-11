// Initialize the map and set its view
const map = L.map('map')
// map.setView([-27.47043, 153.0255], 13)
map.setView([44.738027, -63.304645], 23) // set default view to "that street" in canada if the location is disabled


// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // maxZoom: 23,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.locate({ setView: true, watch: true }) /* This will return map so you can do chaining */
    .on('locationfound', function (e) {
        var marker = L.marker([e.latitude, e.longitude]).bindPopup('You are here :)')
        map.addLayer(marker);
        map.setView([e.latitude, e.longitude], 13); // set map view to user current location
        marker.openPopup();

        var circle = L.circle([e.latitude, e.longitude], e.accuracy / 2, {
            weight: 1,
            color: 'blue',
            fillColor: '#cacaca',
            fillOpacity: 0.2
        });
        map.addLayer(circle);
    })
    .on('locationerror', function (e) {
        console.log(e);
        alert("Location access denied. Defaulting to This Street");
    });