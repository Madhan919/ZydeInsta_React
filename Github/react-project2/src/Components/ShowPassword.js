import React, { useState } from "react";

const ShowPassword = (props) => {
  const [showPassword, setShow] = useState(false);
  return (
    <button
      type="button"
      className="showPassword"
      onClick={() => (showPassword ? setShow(false) : setShow(true))}
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  );
};
export default ShowPassword;
