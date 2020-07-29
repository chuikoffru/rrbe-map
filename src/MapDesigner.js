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

import ModalControl from "./ModalControl";

import { ReactComponent as PaintIcon } from "./assets/paint.svg";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./style.scss";

function noob() {}

function MapDesigner({
  className,
  isEditable = false,
  center,
  zoom,
  data,
  saveData = noob,
  onTap = noob,
}) {
  const FG = useRef(null);
  const [selected, setSelected] = useState(null);
  const [state, setState] = useState(data);
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
        geojson.properties.fillColor = layer.options.fillColor;
      } else if (layer instanceof L.Polygon) {
        geojson.properties.fillColor = layer.options.fillColor;
      } else if (layer instanceof L.Marker) {
        geojson.properties.fillColor = geojson.properties.fillColor
          ? geojson.properties.fillColor
          : "#3388ff";
        geojson.properties.icon = geojson.properties.icon ? geojson.properties.icon : "Marker";
        layer.setIcon(customIcon(geojson.properties.icon, geojson.properties.fillColor));
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
    // Отправляем событие во вне
    onTap(e, FG.current);
    // Проверяем есть ли feature у слоя
    if (e.target.feature) {
      setSelected(e.target.feature.id);
    } else {
      const id = FG.current.leafletElement.getLayerId(e.target);
      setSelected(id);
    }
  };

  // Сохраняем данные после каждого изменения состояния
  useEffect(() => {
    if (state.features) {
      saveData(state);
      whenReady();
    }
  }, [state]);

  // Обновляем состояние после каждого изменения пропса
  useEffect(() => {
    if (data.features) {
      setState(data);
    }
  }, [data]);

  const whenReady = () => {
    // Очищаем старые слои
    FG.current && FG.current.leafletElement.clearLayers();
    // Добавляем новые слои
    state.features.forEach((geojson) => {
      // Конвертируем geojson в слой leaflet
      L.geoJSON(geojson, {
        coordsToLatLng: (coords) => {
          return coords;
        },
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
            layer.setIcon(customIcon(feature.properties.icon, feature.properties.fillColor));
          }
          if (feature.properties.text) {
            layer.bindTooltip(feature.properties.text, tooltipOptions);
          }
          layer.setStyle(feature.properties);
          FG.current.leafletElement.addLayer(layer);
        },
      });
    });
  };

  return (
    <div className="rrbe-map">
      <Map
        center={center}
        zoom={zoom}
        className={`rrbe-map__container ${className}`}
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
              polygon: isEditable,
              circle: isEditable,
              marker: isEditable,
            }}
            edit={{
              edit: isEditable,
              remove: isEditable,
            }}
          />
        </FeatureGroup>
        {isEditable && selected && (
          <Control position="topleft" className="rrbe_map__paint">
            <button type="button" onClick={() => setOpen(!open)}>
              <PaintIcon width="15" height="15" fill="#464646" />
            </button>
          </Control>
        )}
      </Map>
      {isEditable && selected && (
        <ModalControl
          open={open}
          selected={selected}
          onClose={() => setOpen(false)}
          setState={setState}
          state={state}
          fg={FG.current}
        />
      )}
    </div>
  );
}

export default MapDesigner;
