import React, { useRef, useEffect, useLayoutEffect, useState, useReducer } from "react";
import L from "leaflet";
import "leaflet-draw";

import { initialState, reducer, generateId } from "./store/reducer";
import { addFeature, deleteFeature, updateFeature } from "./store/actions";

import DefaultIcon from "./Icon/Default";
import Debug from "./Debug";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "./style.scss";

let map;

function App() {
  const box = useRef(null);
  const [zoom, setZoom] = useState(10);
  const [center, setCenter] = useState([56.03766387933251, 54.734350716708235]);
  const [selected, setSelected] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const drawnItems = new L.geoJSON(state);

  const createLayer = ({ layer, layerType }) => {
    if (layerType === "marker") {
      // JSON
      let feature = (layer.feature = layer.feature || {});
      feature.type = "Feature";
      feature.id = generateId();
      feature.properties = feature.properties || {};
      feature.properties.icon = "default";
      feature.properties.popup = "Hello!";
      // Native
      layer.options.icon = DefaultIcon();
      layer.options.id = feature.id;
      layer.bindPopup(feature.properties.popup);
    }

    dispatch(addFeature(layer.toGeoJSON()));
    drawnItems.addLayer(layer);
  };

  const updateLayer = ({ layers }) => {
    layers.eachLayer((layer) => {
      console.log("layer", layer.toGeoJSON());
      //dispatch(updateFeature(layer));
    });
  };

  const handleMove = () => {
    const { lat, lng } = map.getCenter();
    setCenter([lat, lng]);
  };

  const handleZoom = () => {
    setZoom(map.getZoom());
  };

  useLayoutEffect(() => {
    // Инициируем карту при рендере
    map = L.map(box.current, {
      center,
      zoom,
      crs: L.CRS.EPSG3395,
    });

    //Накладываем слой яндекс карты
    L.tileLayer(
      "http://vec{s}.maps.yandex.net/tiles?l=map&v=4.55.2&z={z}&x={x}&y={y}&scale=2&lang=ru_RU",
      {
        subdomains: ["01", "02", "03", "04"],
        reuseTiles: true,
        updateWhenIdle: false,
      }
    ).addTo(map);

    //Группа для редактирования
    console.log("drawnItems", drawnItems);
    //map.addLayer(drawnItems);
    drawnItems.addTo(map);
    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
    });
    map.addControl(drawControl);

    // Навешиваем события
    map.on(L.Draw.Event.CREATED, createLayer);
    map.on(L.Draw.Event.EDITED, updateLayer);
    map.on("moveend", handleMove);
    map.on("zoomend", handleZoom);

    // Демонтируем инстанс
    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.features) {
      localStorage.setItem("features", JSON.stringify(state.features));
    }
  }, [state]);

  return (
    <div className="rrbe-map">
      <div ref={box} className="rrbe_map__container" />
      <Debug dispatch={dispatch} state={state} center={center} zoom={zoom} selected={selected} />
    </div>
  );
}

export default App;
