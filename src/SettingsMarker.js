import React, { useState } from "react";
import { SketchPicker } from "react-color";
import { updateFeature } from "./store/actions";
import { iconTypes } from "./DivIcon";

const SettingsMarker = ({ feature, dispatch }) => {
  const [color, setColor] = useState(feature.properties.color);
  const icons = Object.keys(iconTypes);

  const saveColor = ({ hex }) => {
    feature.properties.color = hex;
    dispatch(updateFeature(feature));
  };

  const saveText = (event) => {
    feature.properties.popup = event.target.value;
    dispatch(updateFeature(feature));
  };

  const saveIcon = (event) => {
    feature.properties.iconName = event.target.value;
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
      <p>Иконка</p>
      <select onChange={saveIcon} value={feature.properties.iconName}>
        {icons.map((name, key) => (
          <option key={key}>{name}</option>
        ))}
      </select>
      <p>Подпись</p>
      <textarea defaultValue={feature.properties.popup} onBlur={saveText} />
    </div>
  );
};

export default SettingsMarker;
