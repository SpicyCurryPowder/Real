
map.on('locationfound', function (ev) {
    if (!marker) {
        marker = L.marker(ev.latlng);
    }
})

// Add a marker to the map
L.marker([-27.4705, 153.026044])
    .addTo(map)
    .bindPopup('Location: Brisbane CBD<br> News Title: New Uncle Roger restaurant opening')
//     .openPopup();

L.marker([-27.4706, 153.02699])
    .addTo(map)
    .bindPopup('Location: Brisbane CBD<br> News Title: New Uncle Roger restaurant opening')
//     .openPopup();

L.marker([-27.4706, 153.02599])
    .addTo(map)
    .bindPopup('Location: Brisbane CBD<br> News Title: New Uncle Roger restaurant opening')
//     .openPopup();

L.marker([-27.4706, 153.0261])
    .addTo(map)
    .bindPopup('Location: Brisbane CBD<br> News Title: New Uncle Roger restaurant opening')
//     .openPopup();



L.marker([-27.48552, 152.992, {autoPanOnFocus: true, riseOnHover: true}])
    .bindPopup('Location: Toowong<br>News Title: Shop caught on fire')
    .addTo(map);
