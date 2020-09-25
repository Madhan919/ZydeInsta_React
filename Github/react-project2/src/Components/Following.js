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
import { baseURL } from "../Container";

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
      {onClose && (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      )}
    </MuiDialogTitle>
  );
});
export default function CustomizedDialogs(props) {
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [spinner, setSpinner] = React.useState("");
  useEffect(() => {
    setSpinner("");
  }, [props.list]);
  useEffect(() => {
    if (props.following.length === 0) {
      setOpen(false);
    }
  }, [props.list]);

  const handleClickOpen = () => {
    if (props.following.length > 0) {
      setOpen(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (id) => {
    setSpinner(id);
    setTimeout(() => {
      props.onClick(id);
    }, 1000);
  };
  const handleSubmit2 = (id) => {
    setSpinner(id);
    setTimeout(() => {
      props.onclick(id);
    }, 1000);
  };
  const goProfile = (user) => {
    history.push(`/profile/${user}`);
  };

  return (
    <Fragment>
      <label variant="outlined" color="primary" onClick={handleClickOpen}>
        following
      </label>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Following
        </DialogTitle>
        <div className="followHeight">
          {props.following.length > 0 &&
            props.following.map((following) => (
              <div
                className="followContainer"
                id={following.userFollower._id}
                key={following.userFollower._id}
              >
                <div className="flexHeader">
                  <Avatar
                    alt={following.userFollower.firstName}
                    src={`${baseURL.axios.baseURL}/${following.userFollower.photo}`}
                    onClick={() => goProfile(following.userFollower._id)}
                  />
                  <header
                    style={{
                      marginLeft: "10px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={() => goProfile(following.userFollower._id)}
                  >
                    {following.userFollower.firstName}
                  </header>
                </div>
                {following.follower !==
                  decode(localStorage.getItem("tokens")).id &&
                  (props.list
                    .filter(
                      (follow) => follow.follower === following.userFollower._id
                    )
                    .filter(
                      (follow) =>
                        follow.following ===
                        decode(localStorage.getItem("tokens")).id
                    ).length > 0 ? (
                    <RemoveFollow
                      url={following.userFollower.photo}
                      user={following.userFollower.firstName}
                      text={
                        spinner === following.userFollower._id ? (
                          <div
                            style={{
                              color: "blue",
                              left: "16px",
                              width: "20px",
                              height: "20px",
                              marginRight: "28px",
                            }}
                            className="spinner-border"
                          />
                        ) : (
                          "Following"
                        )
                      }
                      onClick={() => handleSubmit(following.userFollower._id)}
                    />
                  ) : (
                    <Button
                      text={
                        spinner === following.userFollower._id ? (
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
                      onClick={() => handleSubmit2(following.userFollower._id)}
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
