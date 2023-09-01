// Create a Leaflet map centered at a specific location
const map = L.map('map').setView([0, 0], 2);

// Add a tile layer for the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
}).addTo(map);

// Fetch earthquake data from the USGS GeoJSON API
const earthquakeURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Function to determine the marker size based on magnitude
function getMarkerSize(magnitude) {
  return magnitude * 5;
}

// Function to determine marker color based on depth
function getMarkerColor(depth) {
  const colors = ['#80FF80', '#B0FFB0', '#FFFF80', '#FFC266', '#FFA8A8', '#FF8080'];

  if (depth < 10) return colors[0];
  if (depth < 30) return colors[1];
  if (depth < 50) return colors[2];
  if (depth < 70) return colors[3];
  if (depth < 90) return colors[4];
  return colors[5];
}

// Fetch earthquake data and plot markers on the map
d3.json(earthquakeURL).then(data => {
  L.geoJSON(data.features, {
    pointToLayer: (feature, latlng) => {
      return L.circleMarker(latlng, {
        radius: getMarkerSize(feature.properties.mag),
        fillColor: getMarkerColor(feature.geometry.coordinates[2]),
        color: 'grey',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      }).bindPopup(`<h3>${feature.properties.place}</h3><hr>
                   <p>Magnitude: ${feature.properties.mag}<br>
                   Depth: ${feature.geometry.coordinates[2]}</p>`);
    },
  }).addTo(map);

  // Create a legend
  const legend = L.control({ position: 'bottomright' });
  legend.onAdd = function () {
    const div = L.DomUtil.create('div', 'info legend');
  
    const depthLabels = ['-10-10', '10-30', '30-50', '50-70', '70-90', '90+'];
    const colors = ['#80FF80', '#B0FFB0', '#FFFF80', '#FFC266', '#FFA8A8', '#FF8080'];
  
    for (let i = 0; i < depthLabels.length; i++) {
      div.innerHTML += `<div class="legend-box" style="background-color:${colors[i]}"></div>${depthLabels[i]} km<br>`;
    }
    return div;
  };
  legend.addTo(map);
});
