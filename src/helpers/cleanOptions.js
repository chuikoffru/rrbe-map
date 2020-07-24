export const removeProperties = (object, ...keys) =>
  Object.entries(object).reduce(
    (prev, [key, value]) => ({ ...prev, ...(!keys.includes(key) && { [key]: value }) }),
    {}
  );

export const extraOptions = [
  "attribution",
  "bubblingMouseEvents",
  "children",
  "interactive",
  "leaflet",
  "onclick",
  "pane",
  "editing",
  "position",
  "maintainColor",
  "clickable",
  "fillRule",
  "noClip",
  "fill",
  "smoothFactor",
];

export const cleanOptions = (options) => removeProperties(options, ...extraOptions);
