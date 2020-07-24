import React from "react";
import ReactDOM from "react-dom";
import { MapDesigner } from "./main";

ReactDOM.render(
  <MapDesigner
    height={window.innerHeight}
    isEditable={true}
    center={[54.57299842212406, 56.20845794677735]}
    zoom={11}
    data={{
      type: "FeatureCollection",
      features: JSON.parse(localStorage.getItem("features")) || [],
    }}
    saveData={(data) => console.log("data", data)}
  />,
  document.getElementById("root")
);
