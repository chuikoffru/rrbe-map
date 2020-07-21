export const convertCoordinates = (coords) => {
  return [coords[0].map((item) => ([item[0], item[1]] = [item[1], item[0]]))];
};
