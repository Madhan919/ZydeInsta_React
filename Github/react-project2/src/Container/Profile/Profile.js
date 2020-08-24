import React, { Fragment, useState, useEffect } from "react";
import { InstaProfile, Spinner, ViewPost, Menu } from "../../Components";
import axios from "axios";
import "../Profile/Profile.css";

import { withStyles } from "@material-ui/core/styles";
import { Dialog, Typography } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";

const Profile = (props) => {
  const [open, setOpen] = React.useState(false);
  const [postimage, setImage] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [viewImage, setView] = useState("");
  const [userType, setUserType] = useState("");
  useEffect(() => {
    setSpinner(true);
    let userId;
    let userType;
    if (props.location.state) {
      userId = props.location.state.user;
      userType = props.location.state.userType;
    }
    axios
      .get("http://localhost:9000/post/view-profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokens")}`,
          user: userId,
          type: userType,
        },
      })
      .then((response) => {
        setUserType("");
        console.log(response);
        setTimeout(() => {
          setUserType(response.data.logged);
          const feeds = response.data.message.sort(function (a, b) {
            return new Date(b.postedTime) - new Date(a.postedTime);
          });
          setImage(feeds);
          setSpinner(false);
        }, 1000);
      })
      .catch((errors) => {
        console.log(errors.response);
      });
  }, []);

  const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      textAlign: "center",
    },
  });

  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
      </MuiDialogTitle>
    );
  });

  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(3),
      width: theme.spacing(50),
      textAlign: "center",
    },
  }))(MuiDialogContent);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const deletePost = (id, post) => {
    axios
      .delete("http://localhost:9000/post/delete-post", {
        headers: {
          Authorization: `bearer ${localStorage.getItem("tokens")}`,
          id: id,
          image: post,
        },
      })
      .then((response) => {
        console.log(response);
        window.location.reload(false);
      })
      .catch((errors) => {
        console.log(errors.response);
      });
    handleClose();
  };
  return (
    <Fragment>
      {viewImage ? (
        <ViewPost
          profileSrc={
            viewImage.userImage
              ? `http://localhost:9000/${viewImage.userImage}`
              : "Image/logoAvatar.jpg"
          }
          profileName={viewImage.name}
          imgSrc={`http://localhost:9000/${viewImage.photo}`}
          caption={viewImage.text}
          onClick={() => setView("")}
        >
          {window.innerWidth > 600 ? (
            <Fragment>
              <img
                alt="Dot icon"
                className="dotImg1"
                src="Image/Icons/dot.jpg"
                onClick={userType && handleClickOpen}
              />
              <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
              >
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                  View Posted Image
                </DialogTitle>

                <DialogContent dividers>
                  <button
                    onClick={() => deletePost(viewImage.id, viewImage.photo)}
                    className="remove-profile"
                  >
                    Delete post
                  </button>
                </DialogContent>
                <DialogContent dividers>
                  <p
                    onClick={handleClose}
                    className="cancel-profile"
                    style={{ color: "blue" }}
                  >
                    Edit Post
                  </p>
                </DialogContent>
                <DialogContent dividers>
                  <p onClick={handleClose} className="cancel-profile">
                    Cancel
                  </p>
                </DialogContent>
              </Dialog>
            </Fragment>
          ) : (
            <Menu onClick={() => deletePost(viewImage.id, viewImage.photo)} />
          )}
        </ViewPost>
      ) : (
        <Fragment>
          <div>
            <InstaProfile
              profileImage={postimage.length > 1 && postimage[0].user.photo}
              type={userType}
            />
            <header className="profile">
              {postimage.length > 1 && postimage[0].user.firstName} <br />
              <span>
                <label>{postimage.length} posts</label>
                <label>23.5k followers</label>
                <label>86 following</label>
              </span>
            </header>
          </div>
          <div className="container-1">
            {postimage.length > 0 ? (
              postimage.map((image, index) => (
                <div
                  key={image.image + index}
                  className="box-1"
                  onClick={() =>
                    setView({
                      photo: image.image,
                      text: image.caption,
                      id: image._id,
                      name: image.user.firstName,
                      userImage: image.user.photo,
                    })
                  }
                >
                  <div className="overlayDiv">
                    <div className="overlay" />
                  </div>
                  <div className="myImagess">
                    <img
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      src={`http://localhost:9000/${image.image}`}
                      alt="img"
                    />
                  </div>
                </div>
              ))
            ) : (
              <Fragment>
                <span className="nodata">
                  <Spinner />
                </span>
                {!spinner && (
                  <h3 className="nodata">There is no post available..!</h3>
                )}
              </Fragment>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;
