import { ADD_GEOJSON, DELETE_GEOJSON, UPDATE_GEOJSON } from "./types";

export function addFeature(data) {
  return {
    type: ADD_GEOJSON,
    payload: data,
  };
}

export function updateFeature(feature) {
  return {
    type: UPDATE_GEOJSON,
    payload: feature,
  };
}

export function deleteFeature(id) {
  return {
    type: DELETE_GEOJSON,
    payload: id,
  };
}
