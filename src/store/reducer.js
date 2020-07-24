import { UPDATE_GEOJSON } from "./types";

export const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

export const initialState = {
  type: "FeatureCollection",
  features: JSON.parse(localStorage.getItem("features")) || [],
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_GEOJSON:
      return { ...state, features: action.payload };
    default:
      return state;
  }
};
