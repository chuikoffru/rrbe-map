import React, { useState } from "react";
import { updateFeature } from "./store/actions";

const SettingsMarker = ({ feature, dispatch }) => {
  const [color, setColor] = useState("#fe57a1");
  const [radius, setRadius] = useState(feature.properties.radius);

  const saveColor = ({ hex }) => {
    feature.properties.color = hex;
    dispatch(updateFeature(feature));
  };

  const handleRadius = (value) => {
    setRadius(value);
    feature.properties.radius = value;
    dispatch(updateFeature(feature));
  };

  const saveText = (event) => {
    feature.properties.popup = event.target.value;
    dispatch(updateFeature(feature));
  };

  return (
    <div>
      <p>Иконка</p>

      <p>Подпись</p>
      <textarea defaultValue={feature.properties.popup} onBlur={saveText} />
    </div>
  );
};

export default SettingsMarker;
