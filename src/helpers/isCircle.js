export const isCircle = (feature) => {
  console.log("feature", feature);
  return feature && feature.geometry.type === "Point" && feature.properties.radius;
};
