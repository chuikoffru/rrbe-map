import React, { useState, useLayoutEffect } from "react";
import L from "leaflet";

import { iconTypes, customIcon } from "./DivIcon";
import tooltipOptions from "./helpers/tooltipOptions";

const ModalControl = ({ selected, state, open, onClose, setState, fg }) => {
  const colors = ["#3388ff", "#dc3545", "#28a745", "#ffc107", "#6c757d"];
  const icons = Object.keys(iconTypes);
  const [properties, setProperties] = useState({});

  useLayoutEffect(() => {
    if (selected) {
      const feature = state.features.filter((item) => item.id === selected);
      if (feature.length > 0) {
        setProperties(feature[0].properties);
      }
    }
  }, [selected, state.features]);

  const getId = (layer) => {
    if (layer.feature?.id) {
      return layer.feature.id;
    } else {
      return fg.leafletElement.getLayerId(layer);
    }
  };

  const getLayer = () => {
    let layer;
    fg.leafletElement.eachLayer((item) => {
      if (selected === getId(item)) {
        layer = item;
      }
    });
    return layer;
  };

  // Сохраняем все настройки
  const saveSettings = () => {
    const features = state.features.map((item) => {
      if (item.id === selected) {
        item.properties = properties;
      }
      return item;
    });
    setState({ ...state, features });
    onClose();
  };

  //Меняем цвет
  const handleColor = (hex) => {
    setProperties({ ...properties, color: hex });
    const layer = getLayer();
    if (layer instanceof L.Marker) {
      layer.setIcon(customIcon(properties.icon, hex));
    } else {
      layer.setStyle({ color: hex });
    }
  };

  const handleIcon = (name) => {
    setProperties({ ...properties, icon: name });
    const layer = getLayer();
    layer.setIcon(customIcon(name, properties.color));
  };

  const handleText = (event) => {
    setProperties({ ...properties, text: event.target.value });
    const layer = getLayer();
    if (layer.getTooltip()) {
      layer.setTooltipContent(event.target.value);
    } else {
      layer.bindTooltip(event.target.value, tooltipOptions);
    }
  };

  const renderOption = (name) => {
    let Icon = iconTypes[name];
    return (
      <button
        key={name}
        type="button"
        className={`icon ${name === properties.icon ? "active" : ""}`}
        onClick={() => handleIcon(name)}
      >
        <Icon fill={properties.color} width={24} height={24} />
      </button>
    );
  };

  return (
    <div className="rrbe_map__modal modal">
      <div className={!open ? "modal__body" : "modal__body open"}>
        <button type="button" className="close" onClick={onClose}>
          X
        </button>
        <h3>Настройки</h3>
        <div className="modal__body-text">
          <label>
            Всплывающая подсказка
            <textarea value={properties.text} onChange={handleText} />
          </label>
        </div>
        {properties.color && (
          <div className="modal__body-color">
            {colors.map((item, key) => (
              <button
                key={key}
                type="button"
                style={{
                  backgroundColor: item,
                }}
                className={`color ${item === properties.color ? "active" : ""}`}
                onClick={() => handleColor(item)}
              />
            ))}
          </div>
        )}
        {properties.icon && (
          <div className="modal__body-icon">{icons.map((name) => renderOption(name))}</div>
        )}
        <button type="button" className="modal__body-save" onClick={saveSettings}>
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default ModalControl;
