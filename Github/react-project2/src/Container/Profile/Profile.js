import React, {
  Fragment,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  InstaProfile,
  ViewPost,
  Menu,
  Button,
  RemoveFollow,
} from "../../Components";
import axios from "axios";
import moment from "moment";
import "../Profile/Profile.css";
import { AiOutlineEllipsis } from "react-icons/ai";
import logoAvatar from "../../Images/logoAvatar.jpg";
import { withStyles } from "@material-ui/core/styles";
import { Dialog, Typography } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import decode from "jwt-decode";

const Profile = (props) => {
  const [open, setOpen] = useState(false);
  const [postimage, setImage] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [viewImage, setView] = useState("");
  const [userType, setUserType] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);
  const [user, setUser] = useState();
  const [isFollow, setFollow] = useState(false);
  let userId;
  const myUser = props.match.params.user;
  const fetchData = () => {
    if (props.match.params) {
      if (props.match.params.user) {
        userId = props.match.params.user;
      } else {
        if (localStorage.getItem("tokens")) {
          userId = decode(localStorage.getItem("tokens")).id;
        }
      }
    }
    setSpinner(true);
    axios
      .get("http://localhost:9000/post/view-profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokens")}`,
          user: userId,
        },
      })
      .then((response) => {
        console.log(response.data);
        setUserType("");
        setUserType(response.data.logged);
        const feeds = response.data.response.sort(function (a, b) {
          return new Date(b.postedTime) - new Date(a.postedTime);
        });
        setImage(feeds);
        setUser(response.data.user);
        setSpinner(false);
        setView("");
        setFollow(
          response.data.user.follower.filter(
            (follower) => follower === decode(localStorage.getItem("tokens")).id
          ).length > 0
        );
      })
      .catch((errors) => {
        console.log(errors.response);
      });
  };
  const indexOfLastPost = currentPage * postsPerPage;
  const currentPosts = postimage.slice(0, indexOfLastPost);
  useEffect(() => {
    console.log(props);
    fetchData();
  }, [props.location.state, props.match.params && props.match.params.user]);
  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          if (currentPage <= Math.round(postimage.length / postsPerPage)) {
            setSpinner(true);
            setTimeout(() => {
              setCurrentPage((prevPageNumber) => prevPageNumber + 1);
              setSpinner(false);
            }, 3000);
          }
        }
      });
      if (node) observer.current.observe(node);
    },
    [currentPosts]
  );

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
    setSpinner(true);
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
        setTimeout(() => {
          fetchData();
        }, 3000);
      })
      .catch((errors) => {
        console.log(errors.response);
      });
    handleClose();
  };
  const getFollowing = () => {
    axios
      .get("http://localhost:9000/post/following", {
        headers: {
          Authorization: `bearer ${localStorage.getItem("tokens")}`,
          user: myUser,
        },
      })
      .then((response) => {
        fetchData();
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const removeFollowing = () => {
    axios
      .delete("http://localhost:9000/post/following", {
        headers: {
          Authorization: `bearer ${localStorage.getItem("tokens")}`,
          user: myUser,
        },
      })
      .then((response) => {
        fetchData();
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  function getPostedTime(postedTime) {
    const time = Math.round((new Date() - new Date(postedTime)) / 1000 / 60);
    if (time < 1) {
      return "Just now";
    } else if (time < 60) {
      return `${time} minutes ago`;
    } else if (time >= 60 && time < 120) {
      return `1 hour ago`;
    } else if (time >= 120 && time < 1140) {
      return `${Math.round(time / 60)} hours ago`;
    } else if (time >= 1140 && time < 2280) {
      return `Yesterday at ${moment(new Date(postedTime)).format("LT")}`;
    } else if (time >= 2280 && time < 1140 * 7) {
      return `${Math.round(time / 1140)} days ago`;
    } else {
      return `${moment(new Date(postedTime)).format("MMM DD")}`;
    }
  }

  return (
    <div className="profile-post">
      {viewImage && (
        <div style={{ marginLeft: "10px" }}>
          <ViewPost
            profileSrc={
              viewImage.userImage
                ? `http://localhost:9000/${viewImage.userImage}`
                : logoAvatar
            }
            profileName={viewImage.name}
            imgSrc={`http://localhost:9000/${viewImage.photo}`}
            caption={viewImage.text}
            postedTime={getPostedTime(viewImage.time)}
            onClick={() => setView("")}
            loader={
              spinner && (
                <div
                  style={{
                    color: "white",
                    top: "50%",
                    left: "50%",
                    position: "absolute",
                  }}
                  className="spinner-border"
                />
              )
            }
          >
            {window.innerWidth > 600 ? (
              <Fragment>
                <AiOutlineEllipsis
                  className="dotImg1"
                  size="2rem"
                  onClick={userType && handleClickOpen}
                />
                <Dialog
                  onClose={handleClose}
                  aria-labelledby="customized-dialog-title"
                  open={open}
                >
                  <DialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                  >
                    View Posted Image
                  </DialogTitle>

                  <DialogContent dividers>
                    <p
                      onClick={() => deletePost(viewImage.id, viewImage.photo)}
                      className="remove-profile"
                    >
                      Delete post
                    </p>
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
              <Menu
                type={userType}
                onClick={() => deletePost(viewImage.id, viewImage.photo)}
              />
            )}
          </ViewPost>
        </div>
      )}
      {user && (
        <Fragment>
          <div className="navbar-divider">
            <div style={{ display: "flex", alignItems: "center" }}>
              <InstaProfile profileImage={user.photo} type={userType} />
              <header className="profile">
                <div className="headerText">
                  {user.firstName}
                  {myUser !== decode(localStorage.getItem("tokens")).id &&
                  !isFollow ? (
                    <Button
                      text={"Follow"}
                      className={"btn_follow"}
                      onClick={getFollowing}
                    />
                  ) : (
                    myUser !== decode(localStorage.getItem("tokens")).id &&
                    isFollow && (
                      <RemoveFollow
                        url={user.photo}
                        onClick={removeFollowing}
                        user={user.firstName}
                      />
                    )
                  )}
                </div>
                <span style={{ display: "block" }}>
                  <label>
                    <b className="follow">{postimage.length}</b> posts
                  </label>
                  <label>
                    <b className="follow">{user.follower.length}</b> followers
                  </label>
                  <label>
                    <b className="follow">{user.following.length}</b> following
                  </label>
                </span>
              </header>
            </div>
          </div>
        </Fragment>
      )}
      <div className="container-1">
        {postimage.length > 0 &&
          currentPosts.map((image, index) => (
            <div
              id={index}
              ref={lastBookElementRef}
              key={image.image + index}
              className="box-1"
              onClick={() =>
                setView({
                  photo: image.image,
                  text: image.caption,
                  id: image._id,
                  name: image.user.firstName,
                  userImage: image.user.photo,
                  time: image.postedTime,
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
          ))}
      </div>

      {postimage.length < 1 && !spinner && (
        <h3 className="nodata" style={{ color: "red", paddingTop: "30px" }}>
          There is no post available..!
        </h3>
      )}

      {spinner && (
        <div
          style={{
            color: "gray",
            position: "relative",
            paddingTop: "10px",
          }}
          className="spinner-border"
        />
      )}
    </div>
  );
};

export default Profile;
