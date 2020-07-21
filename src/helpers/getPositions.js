export const getPositions = (layer) => {
  let latngs = layer.getLatLngs();
  latngs[0] = latngs[0].map((item) => {
    return [item.lat, item.lng];
  });
  return latngs;
};
