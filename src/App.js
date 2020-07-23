import React, { useEffect, useState, useReducer, useRef } from "react";
import L from "leaflet";

import { Map, FeatureGroup, TileLayer } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import Control from "react-leaflet-control";

import { initialState, reducer } from "./store/reducer";
import { updateFeature } from "./store/actions";

import Debug from "./Debug";
import ModalControl from "./ModalControl";

import PaintIcon from "./assets/paint.svg";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./style.scss";

function App() {
  const FG = useRef(null);
  const MAP = useRef(null);
  const [selected, setSelected] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const [open, setOpen] = useState(false);

  const handleObserver = (e) => {
    // Обновляем дерево geojson
    let features = [];
    FG.current.leafletElement.eachLayer((layer) => {
      layer.addEventListener("click", handleSelected);
      features.push(layer.toGeoJSON());
    });
    dispatch(updateFeature(features));

    if (e.type === "draw:created") {
      // Если добавили новый, то делаем его активным
      const id = FG.current.leafletElement.getLayerId(e.layer);
      setSelected(id);
    } else if (e.type === "draw:deleted") {
      // Если удалили, то сбрасываем активный элемент
      setSelected(null);
    }
  };

  const handleSelected = (e) => {
    const id = FG.current.leafletElement.getLayerId(e.target);
    setSelected(id);
  };

  useEffect(() => {
    if (state.features) {
      localStorage.setItem("features", JSON.stringify(state.features));
    }
  }, [state.features]);

  const whenReady = () => {
    const layers = L.geoJSON(state);
    layers.eachLayer((layer) => {
      layer.addEventListener("click", handleSelected);
      FG.current.leafletElement.addLayer(layer);
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
        ref={MAP}
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
        state={state}
        fg={FG.current}
      />
      <Debug state={state} selected={selected} />
    </div>
  );
}

export default App;
