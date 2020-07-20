import { ADD_GEOJSON, DELETE_GEOJSON, UPDATE_GEOJSON, CLEAR_ALL } from "./types";

export const generateId = () => "_" + Math.random().toString(36).substr(2, 9);

export const initialState = {
  type: "FeatureCollection",
  features: JSON.parse(localStorage.getItem("features")) || [],
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_GEOJSON:
      return { ...state, features: [...state.features, action.payload] };
    case UPDATE_GEOJSON:
      return {
        ...state,
        features: state.features.map((item) =>
          action.payload.id === item.id ? action.payload : item
        ),
      };
    case DELETE_GEOJSON:
      return {
        ...state,
        features: state.features.filter((item, index) => item.id !== action.payload),
      };
    case CLEAR_ALL:
      return {
        ...state,
        features: [],
      };
    default:
      return state;
  }
};
