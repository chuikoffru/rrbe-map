import React, { useEffect, useState, useReducer, useRef } from "react";
import L from "leaflet";

import { Map, FeatureGroup, TileLayer, Marker, Popup, Circle, Polygon } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import Control from "react-leaflet-control";

import { initialState, reducer } from "./store/reducer";
import { addFeature, updateFeature, deleteFeature } from "./store/actions";
import { cleanOptions } from "./helpers/cleanOptions";
import { getPositions } from "./helpers/getPositions";

import Debug from "./Debug";
import ModalControl from "./ModalControl";

import MarkerIcon from "./assets/marker.svg";
import PaintIcon from "./assets/paint.svg";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./style.scss";

function App() {
  const box = useRef(null);
  const [zoom, setZoom] = useState(11);
  const [center, setCenter] = useState([54.57299842212406, 56.20845794677735]);
  const [selected, setSelected] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [open, setOpen] = useState(false);

  const createLayer = ({ layer }) => {
    let geojson = layer.toGeoJSON(14);
    // Назначаем ID
    geojson.id = layer._leaflet_id;
    geojson.properties = cleanOptions(layer.options);

    // Свойства для маркера
    if (layer instanceof L.Marker) {
      geojson.properties.iconName = "marker";
    }

    if (layer instanceof L.Polygon) {
      geojson.properties.positions = getPositions(layer);
    }

    setSelected(geojson.id);

    return dispatch(addFeature(geojson));
  };

  const updateLayer = ({ layers }) => {
    layers.eachLayer((layer) => {
      let geojson = layer.toGeoJSON(14);
      geojson.id = layer.options.id;
      geojson.properties = cleanOptions(layer.options);

      if (layer instanceof L.Circle) {
        geojson.properties.radius = layer.getRadius();
      }

      if (layer instanceof L.Polygon) {
        geojson.properties.positions = getPositions(layer);
      }
      dispatch(updateFeature(geojson));
    });
  };

  const deleteLayer = ({ layers }) => {
    layers.eachLayer((layer) => {
      dispatch(deleteFeature(layer.options.id));
    });
    setSelected(null);
  };

  const handleMove = (e) => {
    const { lat, lng } = e.target.getCenter();
    setCenter([lat, lng]);
  };

  const handleZoom = (e) => {
    setZoom(e.target.getZoom());
  };

  useEffect(() => {
    if (state.features) {
      localStorage.setItem("features", JSON.stringify(state.features));
    }
  }, [state]);

  const renderIcon = (name) => {
    switch (name) {
      case "marker":
        return new L.Icon({ iconUrl: MarkerIcon, iconSize: [36, 36] });
      default:
        return new L.Icon({ iconUrl: MarkerIcon, iconSize: [36, 36] });
    }
  };

  const renderObject = ({ id, properties, geometry }) => {
    const { coordinates, type } = geometry;
    switch (type) {
      case "Point":
        const position = new L.LatLng(coordinates[1], coordinates[0]);
        if (properties.radius) {
          return (
            <Circle
              key={id}
              id={id}
              popup={properties.popup}
              radius={properties.radius}
              color={properties.color}
              center={position}
              onclick={() => setSelected(id)}
            >
              {properties.popup && <Popup>{properties.popup}</Popup>}
            </Circle>
          );
        } else {
          return (
            <Marker
              key={id}
              id={id}
              position={position}
              onclick={() => setSelected(id)}
              popup={properties.popup}
              iconName={properties.icon}
              icon={renderIcon(properties.iconName)}
            >
              {properties.popup && <Popup>{properties.popup}</Popup>}
            </Marker>
          );
        }
      case "Polygon":
        return (
          <Polygon
            key={id}
            id={id}
            onclick={() => setSelected(id)}
            positions={properties.positions}
            color={properties.color}
          />
        );
      default:
        return <></>;
    }
  };

  return (
    <div className="rrbe-map">
      <Map
        center={center}
        zoom={zoom}
        className="rrbe-map__container"
        style={{
          height: window.innerHeight,
        }}
        onmoveend={handleMove}
        onzoomend={handleZoom}
      >
        <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FeatureGroup ref={box}>
          <EditControl
            position="topleft"
            onCreated={createLayer}
            onEdited={updateLayer}
            onDeleted={deleteLayer}
            draw={{
              circlemarker: false,
              rectangle: false,
              polyline: false,
            }}
          />
          {state.features.map((item) => renderObject(item))}
        </FeatureGroup>
        <Control position="topleft" className="rrbe_map__paint">
          <button type="button" onClick={() => setOpen(!open)}>
            <img src={PaintIcon} width="15" alt="Редактировать параметры" />
          </button>
        </Control>
      </Map>
      <ModalControl
        open={open}
        selected={selected}
        onClose={() => setOpen(false)}
        dispatch={dispatch}
        features={state.features}
      />
      <Debug state={state} center={center} zoom={zoom} selected={selected} />
    </div>
  );
}

export default App;
