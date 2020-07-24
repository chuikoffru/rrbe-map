import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet/src/layer/marker/DivIcon";

import { ReactComponent as Animals } from "./assets/animals.svg";
import { ReactComponent as Bee } from "./assets/bee.svg";
import { ReactComponent as Cow } from "./assets/cow.svg";
import { ReactComponent as Home } from "./assets/home.svg";
import { ReactComponent as Horse } from "./assets/horse.svg";
import { ReactComponent as Pig } from "./assets/pig.svg";
import { ReactComponent as Sheep } from "./assets/sheep.svg";
import { ReactComponent as Marker } from "./assets/marker.svg";

export const iconTypes = {
  Marker,
  Animals,
  Bee,
  Cow,
  Home,
  Horse,
  Pig,
  Sheep,
};

export const customIcon = (name = "Marker", color = "#3388ff", size = [36, 36]) => {
  // Получаем svg
  let Icon = iconTypes[name];
  // Переводим компонент в статику
  const iconMarkup = renderToStaticMarkup(<Icon fill={color} width={size[0]} height={size[1]} />);
  // Возвращаем html-svg иконку
  return new divIcon({
    html: iconMarkup,
  });
};
