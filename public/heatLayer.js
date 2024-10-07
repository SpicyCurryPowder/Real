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
    [-27.4977, 153.0129],
    [-27.48552, 152.993492],
    [-27.48552, 152.9934918],
    [-27.4855223, 152.9934916],
    [-27.4855218, 152.9934914],
    [-27.485516, 152.9934922],
    [-27.485518, 152.9934923],
    [-27.48552, 152.9934933],
    [-27.4705, 153.026],
    [-27.4705, 153.0255],
]

var markers = L.markerClusterGroup();

for (var i = 0; i < addressPoints.length; i++) {
    var a = addressPoints[i];
    var marker = L.marker(new L.LatLng(a[0], a[1]));
    markers.addLayer(marker);
}

map.addLayer(markers);