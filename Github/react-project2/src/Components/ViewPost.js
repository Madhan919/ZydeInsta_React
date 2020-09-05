import React from "react";
import { Dialog } from "@material-ui/core";
import PropTypes from "prop-types";

import { AiOutlineLeft } from "react-icons/ai";

const ViewPost = (props) => {
  return (
    <Dialog open={true}>
      <div className="image-root1">
        <div className="title1">
          <AiOutlineLeft
            size="1.8rem"
            className="back1"
            onClick={props.onClick}
          />
          <div className="image-cropper1">
            <img
              className="profile-pic"
              src={props.profileSrc}
              alt="img"
              onClick={props.onClick}
            />
          </div>
          <label
            className="name"
            onClick={props.onClick}
            style={{ marginTop: "-48px", marginLeft: "95px" }}
          >
            {props.profileName}
          </label>
          <span>{props.children}</span>
          <label className="timeCaption1">{props.postedTime}</label>
        </div>
        <div className="imageWidth">
          <img className="postImage1" src={props.imgSrc} alt="img" />
        </div>
        <p className="desc1">
          <b>{props.profileName}</b>
          {props.caption === "undefined" ? "" : ` ${props.caption}`}
        </p>
      </div>
      {props.loader}
    </Dialog>
  );
};

ViewPost.propTypes = {
  profileSrc: PropTypes.string,
  onClick: PropTypes.func,
  postedTime: PropTypes.string,
  imgSrc: PropTypes.string,
  profileName: PropTypes.string,
  caption: PropTypes.string,
};

export default ViewPost;
