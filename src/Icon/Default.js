import { Icon } from "leaflet/src/layer/marker/Icon";

const DefaultIcon = (size = [36, 36]) =>
  new Icon({
    iconUrl: "./marker.png",
    iconSize: size,
  });

export default DefaultIcon;
