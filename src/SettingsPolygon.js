import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { updateFeature } from "./store/actions";

const SettingsPolygon = ({ feature, dispatch }) => {
  const [color, setColor] = useState("#fe57a1");
  const [opacity, setOpacity] = useState(feature.properties.opacity);

  const saveColor = ({ hex }) => {
    feature.properties.color = hex;
    dispatch(updateFeature(feature));
  };

  const saveText = (event) => {
    feature.properties.popup = event.target.value;
    dispatch(updateFeature(feature));
  };

  const handleOpacity = (value) => {
    setOpacity(value);
    feature.properties.opacity = value;
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
      <p>Прозрачность</p>
      <input
        type="range"
        value={opacity}
        min="0.0"
        step="0.05"
        max="1.0"
        onChange={(e) => handleOpacity(+e.target.value)}
      />
      <p>Подпись</p>
      <textarea defaultValue={feature.properties.popup} onBlur={saveText} />
    </div>
  );
};

export default SettingsPolygon;
