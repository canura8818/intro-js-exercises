/* global L, turf */

import { gbfsTogeojson } from "./indego.js";

const mapElement = document.querySelector('#map');
const map = L.map(mapElement).setView([39.95, -75.16], 10);

const hoodsResponse = await fetch('data/philadelphia-neighborhoods.geojson');
const hoodsData = await hoodsResponse.json();

const hoodsLayer = L.geoJSON(hoodsData)
  .bindTooltip((layer) => {
    const name = layer.feature.properties.MAPNAME;
    const density = layer.feature.properties.density !== undefined ?
      layer.feature.properties.density.toFixed(2) :
      '(loading...)';

    return `
    <dl>
      <dt>Neighborhood</dt>
      <dd>${name}</dd>

      <dt>Station Density (stations per sq km)</dd>
      <dd>${density}</dd>
    </dl>
    `;
  })
  .addTo(map);

const stations_url = 'https://gbfs.bcycle.com/bcycle_indego/station_information.json';
const stations_response = await fetch(stations_url);
const stations_data = await stations_response.json();

const stations_features = stations_data.data.stations.map(gbfsTogeojson);
const stations_layer = L.geoJSON(stations_features, {
  pointToLayer: (feature, latlon) => {
    return L.circleMarker(latlon, { radius: 2, stroke: false, fillOpacity: 1, fillColor: '#a1ec14' });
  },
}).addTo(map);

hoodsData.features.forEach((hoodFeature) => {
  const area = turf.area(hoodFeature) / 1e6;
  const stations_features_inHood = stations_features.filter((station_feature) => {
    return turf.booleanPointInPolygon(station_feature, hoodFeature);
  });
  const count = stations_features_inHood.length;
  const density = count / area;

  Object.assign(hoodFeature.properties, {
    area,
    count,
    density,
  });
});

Object.assign(window, {
  stations_data,
  hoodsData,
  gbfsTogeojson,
  stations_features,
});
