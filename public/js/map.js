// Initialize the map and set its view
const map = L.map('map')
// map.setView([-27.47043, 153.0255], 13)
map.setView([44.738027, -63.304645], 23) // set default view to "that street" in canada if the location is disabled


// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // maxZoom: 23,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.locate({ setView: true, watch: true }) // locate user's current location
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









    
var addressPoints = [
    [-27.49626, 153.01302], // uq
    [-27.496265, 153.0131], // uq
    [-27.496262, 153.01303], // uq

    [-27.4854, 152.993], // toowong train station

    [-27.486, 152.95], // mount coot tha

    [-27.484, 153.026],  // queensland children hospital

    [-27.47043, 153.0255], // uptown brisbane
    [-27.47052, 153.02549], // uptown brisbane
    [-27.47052, 153.0254], // uptown brisbane
    [-27.4705, 153.0255], // uptown brisbane
    [-27.47042, 153.0257], // uptown brisbane
    [-27.47041, 153.0259], // uptown brisbane
    [-27.47042, 153.0254], // uptown brisbane
    [-27.4704, 153.026], // uptown brisbane, that one pin further right

    [-27.4712, 153.02542], // elizabeth house
    [-27.4713, 153.02532], // elizabeth house
    [-27.47132, 153.02545], // elizabeth house
    [-27.4718, 153.02531], // elizabeth house
]

var markers = L.markerClusterGroup();

for (var i = 0; i < addressPoints.length; i++) {
    var a = addressPoints[i];
    var marker = L.marker(new L.LatLng(a[0], a[1]));
    markers.addLayer(marker);
    // markers.bindPopup('Location: Brisbane CBD<br> News Title: New Uncle Roger restaurant opening')
    // markers.openPopup();
}

map.addLayer(markers);