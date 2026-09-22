/* global L */

// Create a new Leaflet map object to be displayed in the #map div
const element = document.querySelector('#map');
const map = L.map(element, { maxZoom: 18 });

const mapBoxStyle = 'mapbox/light-v11';
const mapBoxKey = 'pk.eyJ1IjoidGF0YXIxOTAxIiwiYSI6ImNtdHVlOGxobjBqdjgzNG9pNWozd3Q1bTMifQ.KDlHQ6fNmwGfkW0ohUU_gA';

// Add a base layer to the map
const baseLayer = L.tileLayer(
  `https://api.mapbox.com/styles/v1/${mapBoxStyle}/tiles/{z}/{x}/{y}{r}?access_token=${mapBoxKey}`,
  { zoomOffset: -1, tileSize: 512 },
);
baseLayer.addTo(map);

const response = await fetch('data/pa_pres_results.geojson');
const data = await response.json();

// Load GeoJSON data from a file and add it to the map
const dataLayer = L.geoJSON(data, {
  pointToLayer: (feature, latlng) => L.circleMarker(latlng),
  style: (feature) => {
    if (feature.geometry.type === 'Point') {
      return { stroke: false, radius: 6, fillOpacity: 10 };
    }
    let countyColor = '#808080';
    const winningParty = feature.properties.party;
    if (winningParty === 'DEMOCRAT') {
      countyColor = '#0051ba';
    } else if (winningParty === 'REPUBLICAN') {
      countyColor = '#d9001b';
    }
    const totalVotes = feature.properties.totalvotes;
    const winningVotes = feature.properties.candidatevotes;
    const winMargin = winningVotes / totalVotes;
    return {
      fillColor: countyColor,
      fillOpacity: winMargin,
    };
  },
  interactive: true,
});

dataLayer.bindTooltip((layer) => {
  const countyName = layer.feature.properties.name;
  const countyParty = layer.feature.properties.party;
  const totalVotes = layer.feature.properties.totalvotes;
  const winningVotes = layer.feature.properties.candidatevotes;
  const winPercent = ((winningVotes / totalVotes) * 100).toFixed(2);
  return `<strong>${countyName}</strong><br>Party: ${countyParty}<br>Winning margin: ${winPercent}%`;
});

dataLayer.addTo(map);

var legend = L.control({ position: 'topright' });
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  const parties = ['Democrat', 'Republican'];
  const colors = ['#0051ba', '#d9001b'];

  div.innerHTML = '<strong>Winning Party</strong><br>';

  for (let i = 0; i < parties.length; i++) {
    div.innerHTML
      += `<i style="background: ${colors[i]}"></i> ${parties[i]}<br>`;
  }

  return div;
};

legend.addTo(map);

// Fit the map to the bounds of the GeoJSON data
map.fitBounds(dataLayer.getBounds());
