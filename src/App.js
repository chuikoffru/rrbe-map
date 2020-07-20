import React, { useRef, useEffect, useState, useReducer } from "react";
import L from "leaflet";

import { Map, Pane, FeatureGroup, TileLayer, useLeaflet, Marker } from "react-leaflet";
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
  const leaflet = useLeaflet();
  const [zoom, setZoom] = useState(10);
  const [center, setCenter] = useState([54.57299842212406, 56.20845794677735]);
  const [selected, setSelected] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  const createLayer = ({ layer, layerType }) => {
    console.log("layer", layer);
    let feature = (layer.feature = layer.feature || {});
    feature.type = feature.type || "Feature";
    dispatch(addFeature(layer.toGeoJSON()));
  };

  const updateLayer = ({ layers }) => {
    layers.eachLayer((layer) => {
      console.log("layer", layer.toGeoJSON());
      //dispatch(updateFeature(layer));
    });
  };

  const deleteLayer = ({ layers }) => {
    console.log("layer", layers.toGeoJSON());
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

  const whenReady = () => {
    //console.log("box.current", box.current);
    let leafletGeoJSON = new L.GeoJSON(state);
    console.log("whenReady", leafletGeoJSON);
    //leafletGeoJSON.eachLayer((layer) => ref.leafletElement.addLayer(layer));
  };

  const renderIcon = (name) => {
    switch (name) {
      case "marker":
        return new L.Icon({ iconUrl: MarkerIcon, iconSize: [36, 36] });
      default:
        return <MarkerIcon />;
    }
  };

  const renderObject = ({ id, key, type, properties, geometry }) => {
    switch (geometry.type) {
      case "Point":
        return (
          <Marker
            key={key}
            onclick={() => setSelected(geometry)}
            position={geometry.coordinates}
            icon={renderIcon("marker")}
          />
        );
      default:
        break;
    }
  };

  return (
    <div className="rrbe-map">
      <Map
        crs={L.CRS.EPSG3395}
        center={center}
        zoom={zoom}
        className="rrbe-map__container"
        style={{
          height: window.innerHeight,
        }}
        onmoveend={handleMove}
        onzoomend={handleZoom}
        whenReady={whenReady}
      >
        <TileLayer
          url="http://vec{s}.maps.yandex.net/tiles?l=map&v=4.55.2&z={z}&x={x}&y={y}&scale=2&lang=ru_RU"
          subdomains={["01", "02", "03", "04"]}
        />
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
