import React from "react";
import { Dialog } from "@material-ui/core";
const InstaPost = (props) => {
  return (
    <Dialog open={true}>
      <div className="image-root1">
        <div
          style={{
            borderBottom: "1px solid rgb(224, 224, 224);",
          }}
        >
          <img
            alt="back"
            src="Image/leftAngular.jpg"
            className="back"
            onClick={props.onClick}
          />
          <header
            style={{
              borderBottom: "solid 1px #e0e0e0",
              textAlign: "center",
              verticalAlign: "center",
              fontWeight: "700",
              paddingTop: "20px",
              paddingBottom: "20px",
            }}
          >
            Photo
          </header>
        </div>

        <div className="title">
          <div className="image-cropper">
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
            style={{ marginTop: "-40px", marginLeft: "50px" }}
          >
            {props.profileName}
          </label>
          <span>{props.children}</span>
          <label className="timeCaption">{props.postedTime}</label>
        </div>
        <div className="imageWidth">
          <img className="postImage" src={props.imgSrc} alt="img" />
        </div>
        <p className="desc">
          <b>{props.profileName}</b> {props.caption}
        </p>
      </div>
    </Dialog>
  );
};

export default InstaPost;
