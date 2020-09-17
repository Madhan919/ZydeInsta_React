import React, { Fragment, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { useHistory } from "react-router-dom";
import decode from "jwt-decode";
import { Button } from ".";

import { RemoveFollow } from ".";

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(0),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
export default function CustomizedDialogs(props) {
  let history = useHistory();

  const [open, setOpen] = React.useState(false);
  const [spinner, setSpinner] = React.useState("");

  const handleClickOpen = () => {
    if (props.followers.length > 0) {
      setOpen(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const goProfile = (user) => {
    history.push(`/profile/${user}`);
  };
  const handleSubmit = (id) => {
    setSpinner(id);
    setTimeout(() => {
      props.onClick(id);
      setSpinner("");
    }, 2000);

    // setOpen(false);
  };
  const handleSubmit2 = (id) => {
    setSpinner(id);
    setTimeout(() => {
      props.onclick(id);
      setSpinner("");
    }, 2000);
  };

  return (
    <Fragment>
      <label variant="outlined" color="primary" onClick={handleClickOpen}>
        followers
      </label>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Follower
        </DialogTitle>
        <div className="followHeight">
          {props.followers.length > 0 &&
            props.followers.map((follower) => (
              <div className="followContainer" id={follower.userFollowing._id}>
                <div className="flexHeader">
                  <Avatar
                    alt="Remy Sharp"
                    src={`http://localhost:9000/${follower.userFollowing.photo}`}
                    style={{ marginLeft: "10px" }}
                    onClick={() => goProfile(follower.userFollowing._id)}
                  />
                  <header
                    style={{
                      marginLeft: "10px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={() => goProfile(follower.userFollowing._id)}
                  >
                    {follower.userFollowing.firstName}
                  </header>
                </div>
                {follower.userFollowing._id !==
                  decode(localStorage.getItem("tokens")).id &&
                  (props.following.filter(
                    (follow) =>
                      follow.userFollower._id === follower.userFollowing._id &&
                      follow.userFollowing._id ===
                        decode(localStorage.getItem("tokens")).id
                  ).length > 0 ? (
                    <RemoveFollow
                      url={follower.userFollowing.photo}
                      user={follower.userFollowing.firstName}
                      text={
                        spinner === follower.userFollowing._id ? (
                          <div
                            style={{
                              color: "blue",
                              left: "0px",
                              width: "20px",
                              height: "20px",
                            }}
                            className="spinner-border"
                          />
                        ) : (
                          "Following"
                        )
                      }
                      onClick={() => handleSubmit(follower.userFollowing._id)}
                    />
                  ) : (
                    <Button
                      text={
                        spinner === follower.userFollowing._id ? (
                          <div
                            style={{
                              color: "white",
                              left: "0px",
                              width: "20px",
                              height: "20px",
                            }}
                            className="spinner-border"
                          />
                        ) : (
                          "Follow"
                        )
                      }
                      className={"btn_follow"}
                      onClick={() => handleSubmit2(follower.userFollowing._id)}
                      style={{ marginRight: "0px" }}
                    />
                  ))}
              </div>
            ))}
        </div>
      </Dialog>
    </Fragment>
  );
}
