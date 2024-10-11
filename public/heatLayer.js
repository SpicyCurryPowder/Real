// custom markers for brisbane city
// L.heatLayer([[-27.4705, 153.026, 0.9]], {
//     radius: 40,
//     blur: 30,
//     maxZoom: 10
// }).addTo(map);

// custom markers for toowong
// L.heatLayer([[-27.48552, 152.993492, 0.7]], {
//     radius: 25,
//     blur: 20,
//     maxZoom: 10
// }).addTo(map);

// custom markers for st lucia
// L.heatLayer([[-27.4977, 153.0129, 0.6]], {
//     radius: 25,
//     blur: 20,
//     maxZoom: 10
// }).addTo(map);



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