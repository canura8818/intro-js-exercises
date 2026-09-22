function gbfsTogeojson(gbfsStation) {
  const lon = gbfsStation.lon;
  const lat = gbfsStation.lat;
  const props = {...gbfsStation };
  delete props.lon;
  delete props.lat;

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [lon, lat],
    },
    properties: props,
  };
}

export {
  gbfsTogeojson,
};
