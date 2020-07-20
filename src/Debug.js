import React from "react";
import { CLEAR_ALL } from "./store/types";

const Debug = ({ center, zoom, selected, state, dispatch }) => {
  const handleReset = () => {
    dispatch({ type: CLEAR_ALL });
  };
  return (
    <div className="rrbe_map__debug">
      <button type="button" onClick={handleReset}>
        Сбросить
      </button>
      <pre>
        {JSON.stringify(center)} {zoom} <br />
        {JSON.stringify(selected)} <br />
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
};

export default Debug;
