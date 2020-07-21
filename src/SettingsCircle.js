import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { updateFeature } from "./store/actions";

const SettingsCircle = ({ feature, dispatch }) => {
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
      <p>Цвет</p>
      <SketchPicker
        color={color}
        onChangeComplete={saveColor}
        onChange={({ hex }) => setColor(hex)}
      />
      <p>Радиус</p>
      <input
        type="range"
        value={radius}
        min="1000"
        step="1000"
        max="50000"
        onChange={(e) => handleRadius(+e.target.value)}
      />
      <p>Подпись</p>
      <textarea defaultValue={feature.properties.popup} onBlur={saveText} />
    </div>
  );
};

export default SettingsCircle;
