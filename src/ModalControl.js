import React, { useState, useEffect } from "react";
import SettingsCircle from "./SettingsCircle";
import SettingsPolygon from "./SettingsPolygon";
import SettingsMarker from "./SettingsMarker";
import { isCircle } from "./helpers/isCircle";
import { isPolygon } from "./helpers/isPolygon";
import { isMarker } from "./helpers/isMarker";

const ModalControl = ({ selected, features, open, onClose, dispatch }) => {
  const [feature, setFeature] = useState(null);

  useEffect(() => {
    if (selected) {
      const feature = features.filter((item) => item.id === selected);
      if (feature.length > 0) {
        setFeature(feature[0]);
      }
    }
  }, [features, selected]);

  return (
    <div className="rrbe_map__modal modal">
      <div className={!open ? "modal__body" : "modal__body open"}>
        <button type="button" className="close" onClick={onClose}>
          X
        </button>
        <h3>Настройки</h3>
        {isCircle(feature) && <SettingsCircle dispatch={dispatch} feature={feature} />}
        {isPolygon(feature) && <SettingsPolygon dispatch={dispatch} feature={feature} />}
        {isMarker(feature) && <SettingsMarker dispatch={dispatch} feature={feature} />}
      </div>
    </div>
  );
};

export default ModalControl;
