import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { useHistory } from "react-router-dom";

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
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const [spinner, setSpinner] = React.useState("");

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
    }, 2000);

    // setOpen(false);
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
              <div className="followContainer" id={following.userFollower._id}>
                <div className="flexHeader">
                  <Avatar
                    alt="Remy Sharp"
                    src={`http://localhost:9000/${following.userFollower.photo}`}
                    style={{ marginLeft: "10px" }}
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
                <RemoveFollow
                  url={following.userFollower.photo}
                  user={following.userFollower.firstName}
                  text={
                    spinner === following.userFollower._id ? (
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
                  onClick={() => handleSubmit(following.userFollower._id)}
                />
              </div>
            ))}
        </div>
      </Dialog>
    </Fragment>
  );
}
