import React from "react";

const EmailSignin = (props) => {
  return (
    <center>
      <button
        className={props.className}
        value={props.value}
        onClick={props.onClick}
      >
        {props.icon}
        <label className={props.textClass}>{props.text}</label>
      </button>
    </center>
  );
};

export default EmailSignin;
