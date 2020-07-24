import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";

import { Map, FeatureGroup, TileLayer } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import Control from "react-leaflet-control";

import { isCircle } from "./helpers/isCircle";
import { isMarker } from "./helpers/isMarker";
import { isPolygon } from "./helpers/isPolygon";
import { customIcon } from "./DivIcon";
import tooltipOptions from "./helpers/tooltipOptions";

import Debug from "./Debug";
import ModalControl from "./ModalControl";

import PaintIcon from "./assets/paint.svg";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./style.scss";

function App() {
  const FG = useRef(null);
  const [selected, setSelected] = useState(null);
  const [state, setState] = useState({
    type: "FeatureCollection",
    features: JSON.parse(localStorage.getItem("features")) || [],
  });
  const [open, setOpen] = useState(false);

  const handleObserver = (e) => {
    const { leafletElement } = FG.current;
    // Обновляем дерево geojson
    let features = [];
    // Проходимся по каждому слою
    leafletElement.eachLayer((layer) => {
      const id = leafletElement.getLayerId(layer);
      // Вешаем обработчик клика по объекту
      layer.addEventListener("click", handleSelected);
      // Преобразуем в geojson
      let geojson = layer.toGeoJSON();
      // Задаем ID
      geojson.id = id;
      geojson.properties.text = geojson.properties.text ? geojson.properties.text : "";
      // Задаем опции
      if (layer instanceof L.Circle) {
        geojson.properties.radius = layer.getRadius();
        geojson.properties.color = layer.options.color;
      } else if (layer instanceof L.Polygon) {
        geojson.properties.color = layer.options.color;
      } else if (layer instanceof L.Marker) {
        geojson.properties.color = geojson.properties.color ? geojson.properties.color : "#3388ff";
        geojson.properties.icon = geojson.properties.icon ? geojson.properties.icon : "Marker";
        layer.setIcon(customIcon(geojson.properties.icon, geojson.properties.color));
      }

      if (geojson.properties.text) {
        layer.bindTooltip(geojson.properties.text, tooltipOptions);
      }

      // Добавляем в массив
      features.push(geojson);
    });

    setState({ ...state, features });

    if (e.type === "draw:created") {
      // Если добавили новый, то делаем его активным
      const id = leafletElement.getLayerId(e.layer);
      setSelected(id);
    } else if (e.type === "draw:deleted") {
      // Если удалили, то сбрасываем активный элемент
      setSelected(null);
    }
  };

  const handleSelected = (e) => {
    if (e.target.feature) {
      setSelected(e.target.feature.id);
    } else {
      const id = FG.current.leafletElement.getLayerId(e.target);
      setSelected(id);
    }
  };

  useEffect(() => {
    if (state.features) {
      localStorage.setItem("features", JSON.stringify(state.features));
    }
  }, [state.features]);

  const whenReady = () => {
    state.features.forEach((geojson) => {
      // Конвертируем geojson в слой leaflet
      L.geoJSON(geojson, {
        pointToLayer: (geojson, latlng) => {
          // Создаем точные типы слоев
          if (isCircle(geojson)) {
            let circle = L.circle(latlng, geojson.properties);
            return circle;
          } else if (isMarker(geojson)) {
            let marker = L.marker(latlng, geojson.properties);
            return marker;
          } else if (isPolygon(geojson)) {
            let polygon = L.polygon(latlng, geojson.properties);
            return polygon;
          }
        },
        onEachFeature: (feature, layer) => {
          layer.addEventListener("click", handleSelected);
          if (layer instanceof L.Marker) {
            layer.setIcon(customIcon(feature.properties.icon, feature.properties.color));
          }
          if (feature.properties.text) {
            layer.bindTooltip(feature.properties.text, tooltipOptions);
          }
          FG.current.leafletElement.addLayer(layer);
        },
      });
    });
  };

  return (
    <div className="rrbe-map">
      <Map
        center={[54.57299842212406, 56.20845794677735]}
        zoom={11}
        className="rrbe-map__container"
        style={{
          height: window.innerHeight,
        }}
        whenReady={whenReady}
      >
        <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FeatureGroup ref={FG}>
          <EditControl
            position="topleft"
            onCreated={handleObserver}
            onEdited={handleObserver}
            onDeleted={handleObserver}
            draw={{
              circlemarker: false,
              rectangle: false,
              polyline: false,
            }}
          />
        </FeatureGroup>
        {selected && (
          <Control position="topleft" className="rrbe_map__paint">
            <button type="button" onClick={() => setOpen(!open)}>
              <img src={PaintIcon} width="15" alt="Редактировать параметры" />
            </button>
          </Control>
        )}
      </Map>
      {selected && (
        <ModalControl
          open={open}
          selected={selected}
          onClose={() => setOpen(false)}
          setState={setState}
          state={state}
          fg={FG.current}
        />
      )}
      <Debug state={state} selected={selected} />
    </div>
  );
}

export default App;
