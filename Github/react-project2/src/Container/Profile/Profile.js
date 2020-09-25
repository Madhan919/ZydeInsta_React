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
  Following,
  Followers,
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
import { baseURL } from "..";

const Profile = (props) => {
  const [open, setOpen] = useState(false);
  const [postimage, setImage] = useState([]);
  const [spinner, setSpinner] = useState(true);
  const [innerSpinner, setInnerSpinner] = useState(false);

  const [viewImage, setView] = useState("");
  const [userType, setUserType] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);
  const [user, setUser] = useState();
  const [isFollow, setFollow] = useState(false);
  const [follower, setFollower] = useState(0);
  const [following, setFollowing] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [userFollowing, setUserFollowing] = useState([]);
  const [userFollower, setUserFollower] = useState([]);
  const [followList, setFollowList] = useState([]);

  let userId;
  const myUser = props.match.params.user;
  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    // let isCancelled = false;
    // if (!isCancelled) {

    // }

    // return () => {
    //   isCancelled = true;
    // };
    getFollowing();
    getAllFollowers();
  }, [props.match.params && props.match.params.user, following, follower]);

  useEffect(() => {
    fetchData();
  }, [props.location.state, props.match.params && props.match.params.user]);

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
    setImage("");
    setUser("");
    axios
      .get(`${baseURL.axios.baseURL}/post/view-profile`, {
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
      })
      .catch((errors) => {
        console.log(errors.response);
      });
  };
  const indexOfLastPost = currentPage * postsPerPage;
  const currentPosts = postimage.slice(0, indexOfLastPost);
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
            }, 2000);
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
      .delete(`${baseURL.axios.baseURL}/post/delete-post`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("tokens")}`,
          id: id,
          image: post,
        },
      })
      .then((response) => {
        console.log(response);
        fetchData();
      })
      .catch((errors) => {
        console.log(errors.response);
      });
    handleClose();
  };
  const getFollowing = () => {
    setInnerSpinner(true);
    axios
      .get(`${baseURL.axios.baseURL}/following`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("tokens")}`,
          user: myUser,
        },
      })
      .then((response) => {
        setFollower(
          response.data.response.filter(
            (follower) => follower.follower === myUser
          ).length
        );
        setFollowing(
          response.data.response.filter(
            (following) => following.following === myUser
          ).length
        );
        setFollow(
          response.data.response.filter(
            (following) =>
              following.following === decode(localStorage.getItem("tokens")).id
          ).length > 0
        );
        setUserFollowing(
          response.data.response.filter(
            (follower) => follower.userFollower._id !== myUser
          )
        );
        setUserFollower(
          response.data.response.filter(
            (follower) => follower.userFollowing._id !== myUser
          )
        );
        getAllFollowers();
        setInnerSpinner(false);
        setSpinner(false);
      })
      .catch((error) => {
        setInnerSpinner(false);
        console.log(error.response);
      });
  };
  const goFollowing = () => {
    setInnerSpinner(true);
    axios
      .get(`${baseURL.axios.baseURL}/getfollowing`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("tokens")}`,
          user: myUser,
        },
      })
      .then((response) => {
        getFollowing();
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  const goUserFollowing = (myUserId) => {
    setInnerSpinner(true);
    axios
      .get(`${baseURL.axios.baseURL}/getfollowing`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("tokens")}`,
          user: myUserId,
        },
      })
      .then((response) => {
        getFollowing();
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  const removeFollowing = () => {
    setInnerSpinner(true);
    axios
      .delete(`${baseURL.axios.baseURL}/following`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("tokens")}`,
          user: myUser,
        },
      })
      .then((response) => {
        getFollowing();
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  const removeUserFollowing = (userId) => {
    setInnerSpinner(true);
    axios
      .delete(`${baseURL.axios.baseURL}/following`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("tokens")}`,
          user: userId,
        },
      })
      .then((response) => {
        getFollowing();
        getAllFollowers();
      })
      .catch((error) => {
        console.log(error.response);
      });
  };
  const getAllFollowers = () => {
    axios
      .get(`${baseURL.axios.baseURL}/getFollowers`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("tokens")}`,
        },
      })
      .then((response) => {
        setFollowList(response.data.response);
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
    <Fragment>
      <div className="profile-post">
        {viewImage && (
          <div style={{ marginLeft: "10px" }}>
            <ViewPost
              profileSrc={
                viewImage.userImage
                  ? `${baseURL.axios.baseURL}/${viewImage.userImage}`
                  : logoAvatar
              }
              profileName={viewImage.name}
              imgSrc={`${baseURL.axios.baseURL}/${viewImage.photo}`}
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
              {windowWidth > 600 ? (
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
                        onClick={() =>
                          deletePost(viewImage.id, viewImage.photo)
                        }
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
              <div id="headerCon" className="profileHeader">
                <InstaProfile profileImage={user.photo} type={userType} />
                <header className="profile">
                  <div className="headerText">
                    {user.firstName}
                    {myUser !== decode(localStorage.getItem("tokens")).id &&
                    !isFollow ? (
                      <Button
                        text={
                          innerSpinner ? (
                            <div className="spinner-border follow_spinner" />
                          ) : (
                            "Follow"
                          )
                        }
                        className={"btn_follow"}
                        onClick={goFollowing}
                      />
                    ) : (
                      myUser !== decode(localStorage.getItem("tokens")).id &&
                      isFollow && (
                        <RemoveFollow
                          url={user.photo}
                          onClick={removeFollowing}
                          user={user.firstName}
                          text={
                            innerSpinner ? (
                              <div className="spinner-border following_spinner" />
                            ) : (
                              "Following"
                            )
                          }
                          className="remove_follow"
                        />
                      )
                    )}
                  </div>
                  {windowWidth > 734 && (
                    <div className="container735">
                      <label>
                        <b className="follow">{postimage.length}</b> posts
                      </label>
                      <label>
                        <b className="follow">{follower}</b>&nbsp;
                        <Followers
                          onClick={removeUserFollowing}
                          followers={userFollower}
                          onclick={goUserFollowing}
                          list={followList}
                          following={userFollowing}
                        />
                      </label>
                      <label>
                        <b className="follow">{following}</b>&nbsp;
                        <Following
                          onClick={removeUserFollowing}
                          following={userFollowing}
                          followers={userFollower}
                          onclick={goUserFollowing}
                          list={followList}
                        />
                      </label>
                    </div>
                  )}
                </header>
              </div>
            </div>
          </Fragment>
        )}

        {postimage.length > 0 && user && windowWidth < 735 && (
          <div className="header_container">
            <label>
              <b className="follow">{postimage.length}</b> posts
            </label>
            <label>
              <b className="follow">{follower}</b>{" "}
              <Followers
                onClick={removeUserFollowing}
                followers={userFollower}
                onclick={goUserFollowing}
                list={followList}
                following={userFollowing}
              />
            </label>
            <label>
              <b className="follow">{following}</b>&nbsp;
              <Following
                onClick={removeUserFollowing}
                following={userFollowing}
                followers={userFollower}
                onclick={goUserFollowing}
                list={followList}
              />
            </label>
          </div>
        )}
        <div className="container-1">
          {postimage.length > 0 &&
            currentPosts.map((image, index) => (
              <div
                id={index}
                ref={lastBookElementRef}
                key={image._id}
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
                    src={`${baseURL.axios.baseURL}/${image.image}`}
                    alt="img"
                  />
                </div>
              </div>
            ))}
        </div>

        {postimage.length < 1 && user && !spinner && (
          <h3 className="nodata" style={{ color: "red", paddingTop: "30px" }}>
            There is no post available..!
          </h3>
        )}
      </div>
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
    </Fragment>
  );
};

export default Profile;
