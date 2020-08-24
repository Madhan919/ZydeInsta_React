import React from "react";
const InstaPost = (props) => {
  return (
    <div>
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
          <b>{props.profileName}</b> {props.caption}
        </p>
      </div>
    </div>
  );
};

export default InstaPost;
