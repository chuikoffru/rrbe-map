import React from "react";

const Debug = ({ selected, state }) => {
  return (
    <div className="rrbe_map__debug">
      <pre>
        {JSON.stringify(selected)} <br />
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
};

export default Debug;
