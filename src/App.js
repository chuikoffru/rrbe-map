import React, { useRef, useEffect, useState, useReducer } from "react";
import L from "leaflet";

import { Map, Pane, FeatureGroup, TileLayer, Marker, Popup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

import { initialState, reducer } from "./store/reducer";
import { addFeature } from "./store/actions";

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
    let feature = (layer.feature = layer.feature || {});
    feature.type = "Feature";
    feature.properties = feature.properties || {};
    feature.properties.icon = "marker";
    feature.properties.popup = "Hello!";
    dispatch(addFeature(layer.toGeoJSON(14)));
  };

  const updateLayer = ({ layers }) => {
    console.log("layer", layers.toGeoJSON(14));
    /* layers.eachLayer((layer) => {
      console.log("layer", layer.toGeoJSON(14));
      //dispatch(updateFeature(layer));
    }); */
  };

  const deleteLayer = ({ layers }) => {
    console.log("layer", layers.toGeoJSON(14));
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
        return <MarkerIcon />;
    }
  };

  const renderObject = ({ id, key, type, properties, geometry }) => {
    const { coordinates } = geometry;
    const position = new L.LatLng(coordinates[1], coordinates[0]);
    switch (geometry.type) {
      case "Point":
        return (
          <Marker
            key={key}
            onclick={() => setSelected(key)}
            position={position}
            icon={renderIcon(properties.icon)}
          >
            <Popup>{properties.popup}</Popup>
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
            onUpdated={updateLayer}
            onDeleted={deleteLayer}
          />
          {state.features.map((item, key) => renderObject({ ...item, key }))}
        </FeatureGroup>
        <Pane>
          <Debug
            dispatch={dispatch}
            state={state}
            center={center}
            zoom={zoom}
            selected={selected}
          />
        </Pane>
      </Map>
    </div>
  );
}

export default App;
