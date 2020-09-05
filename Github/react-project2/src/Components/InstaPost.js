import React from "react";
import PropTypes from "prop-types";
const InstaPost = (props) => {
  return (
    <div className="image-root">
      <div className="title">
        <div className="image-cropper">
          <img
            className="profile-pic"
            src={props.profileSrc}
            alt="img"
            onClick={props.onClick}
          />
        </div>
        <div className="profileName">
          <label className="name" onClick={props.onClick}>
            {props.profileName}
          </label>
          <label className="timeCaption">{props.postedTime}</label>
        </div>
        <span>
          <img alt="Dot icon" className="dotImg" src="Image/Icons/dot.jpg" />
        </span>
      </div>
      <img className="postImage" src={props.imgSrc} alt="img" />
      <p className="desc">
        <b>{props.profileName}</b>
        {props.caption === "undefined" ? "" : ` ${props.caption}`}
      </p>
    </div>
  );
};
InstaPost.propTypes = {
  profileSrc: PropTypes.string,
  onClick: PropTypes.func,
  postedTime: PropTypes.string,
  imgSrc: PropTypes.string,
  profileName: PropTypes.string,
  caption: PropTypes.string,
};

export default InstaPost;
