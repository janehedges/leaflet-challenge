// Function to determine marker size based on magnitude
function createMarkerSize(magnitude) {
  return magnitude * 3; // Scale marker size
}

// Function to determine marker color based on depth
function createColor(depth) {
  if (depth <= 10) return "#69fa02";
  else if (depth <= 30) return "#b0fa02";
  else if (depth <= 50) return "#facd02";
  else if (depth <= 70) return "#fa9f02";
  else if (depth <= 90) return "#fa7602";
  else return "#fa2b02";
}

// Function to create the map with earthquake data
function createMap(earthquakeLayer) {
  // Create the base map layer
  const USmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Create the map object
  const map = L.map("map", {
      center: [40, -105], // Centered in the US
      zoom: 5,
      layers: [USmap, earthquakeLayer]
  });

  // Create layer control
  L.control.layers(
      { "Base Map": USmap }, 
      { "Earthquakes": earthquakeLayer }, 
      { collapsed: false }
  ).addTo(map);

  // Add legend to the map
  const legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
      const div = L.DomUtil.create("div", "legend");
      div.innerHTML += '<div><span style="background: #69fa02"></span> -10–10</div>';
      div.innerHTML += '<div><span style="background: #b0fa02"></span> 10–30</div>';
      div.innerHTML += '<div><span style="background: #facd02"></span> 30–50</div>';
      div.innerHTML += '<div><span style="background: #fa9f02"></span> 50–70</div>';
      div.innerHTML += '<div><span style="background: #fa7602"></span> 70–90</div>';
      div.innerHTML += '<div><span style="background: #fa2b02"></span> 90+</div>';
      return div;
  };
  legend.addTo(map);
}

// Function to create markers from earthquake data
function createMarkers(response) {
  const features = response.features;
  console.log("Features Array:", features);
  const earthquakes = features.map(feature => {
      const [longitude, latitude, depth] = feature.geometry.coordinates;
      const magnitude = feature.properties.mag;
      const location = feature.properties.place;

      console.log(`Creating marker for ${location} | Mag: ${magnitude} | Depth: ${depth}`);
      return L.circleMarker([latitude, longitude], {
          radius: createMarkerSize(magnitude),
          fillColor: createColor(depth),
          color: "#000", 
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
      }).bindPopup(
          `<h3>Location: ${location}</h3>
           <h4>Magnitude: ${magnitude}</h4>
           <h4>Depth: ${depth} km</h4>`
      );
  });

  // Create a layer group for earthquakes and pass it to the map creation function
  createMap(L.layerGroup(earthquakes));
}

// Fetch earthquake data from the specified URL and call createMarkers
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(createMarkers);