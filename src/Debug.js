import React from "react";

const Debug = ({ center, zoom, selected, state }) => {
  return (
    <div className="rrbe_map__debug">
      <pre>
        {JSON.stringify(center)} {zoom} <br />
        {JSON.stringify(selected)} <br />
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
};

export default Debug;
