import React, { useRef, useEffect, useState, useReducer } from "react";
import L from "leaflet";

import { Map, Pane, FeatureGroup, TileLayer, Marker, Popup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

import { initialState, reducer } from "./store/reducer";
import { addFeature, updateFeature, deleteFeature } from "./store/actions";

import Debug from "./Debug";
import MarkerIcon from "./assets/marker.svg";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./style.scss";

function App() {
  const box = useRef(null);
  const [zoom, setZoom] = useState(6);
  const [center, setCenter] = useState([54.57299842212406, 56.20845794677735]);
  const [selected, setSelected] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const createLayer = ({ layer }) => {
    let geojson = layer.toGeoJSON(14);
    geojson.id = layer._leaflet_id;
    geojson.properties.icon = "marker";
    geojson.properties.popup = "Hello!";
    dispatch(addFeature(geojson));
  };

  const updateLayer = ({ layers }) => {
    layers.eachLayer((layer) => {
      let geojson = layer.toGeoJSON(14);
      geojson.id = layer.options.id;
      geojson.properties.icon = layer.options.iconName;
      geojson.properties.popup = layer.options.popup;
      dispatch(updateFeature(geojson));
    });
  };

  const deleteLayer = ({ layers }) => {
    layers.eachLayer((layer) => {
      dispatch(deleteFeature(layer.options.id));
    });
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

  const renderObject = ({ id, key, type, properties, geometry }) => {
    const { coordinates } = geometry;
    const position = new L.LatLng(coordinates[1], coordinates[0]);
    switch (geometry.type) {
      case "Point":
        return (
          <Marker
            key={id}
            id={id}
            onclick={() => setSelected(key)}
            position={position}
            iconName={properties.icon}
            popup={properties.popup}
            icon={renderIcon(properties.icon)}
          >
            {properties.popup && <Popup>{properties.popup}</Popup>}
          </Marker>
        );
      default:
        break;
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
          />
          {state.features.map((item, key) => renderObject({ ...item, key }))}
        </FeatureGroup>
        <Pane>
          <Debug state={state} center={center} zoom={zoom} selected={selected} />
        </Pane>
      </Map>
    </div>
  );
}

export default App;
