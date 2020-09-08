import React from "react";
import PropTypes from "prop-types";
const Button = (props) => {
  return (
    <button
      type={props.type}
      className={props.className}
      onClick={props.onClick}
      style={props.style}
    >
      {props.text}
      {props.loader}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.string || PropTypes.func,
};

export default Button;
