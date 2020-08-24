import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Dialog, Typography } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import ImageAvatars from "./Avatar";
import axios from "axios";

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

const InstaProfile = (props) => {
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = useState("");
  const [profile, setProfile] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:9000/post/change-profile", {
        headers: { Authorization: `Bearer ${localStorage.getItem("tokens")}` },
      })
      .then((response) => {
        setProfile(response.data.message.photo);
      })
      .catch((errors) => {
        console.log(errors.response);
      });
  }, []);
  const handleChange = (event) => {
    setUrl(URL.createObjectURL(event.target.files[0]));
    const fd = new FormData();
    fd.append("photo", event.target.files[0]);
    axios
      .patch("http://localhost:9000/post/change-profile", fd, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokens")}`,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((errors) => {
        console.log(errors.response);
      });
    handleClose();
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const removeProfile = () => {
    axios
      .delete("http://localhost:9000/post/remove-profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokens")}`,
          photo: profile,
        },
      })
      .then((response) => {
        setProfile("");
        setUrl("");
        window.location.reload(false);
        console.log(response);
      })
      .catch((errors) => {
        console.log(errors.response);
      });
    handleClose();
  };

  return (
    <div>
      <ImageAvatars
        imageName={
          props.profileImage
            ? `http://localhost:9000/${props.profileImage}`
            : url
            ? url
            : profile && `http://localhost:9000/${profile}`
        }
        onClick={props.type === true && handleClickOpen}
      />
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Change Profile Photo
        </DialogTitle>

        <DialogContent dividers>
          <label
            htmlFor="files"
            className="btn"
            style={{
              color: "blue",
              fontWeight: "bold",
              textAlign: "center",
              display: "block",
              cursor: "pointer",
            }}
          >
            Upload Photo
          </label>
          <input
            id="files"
            style={{ display: "none" }}
            type="file"
            onChange={handleChange}
          />
        </DialogContent>
        <DialogContent dividers>
          <button onClick={removeProfile} className="remove-profile">
            Remove Current Photo
          </button>
        </DialogContent>
        <DialogContent dividers>
          <p onClick={handleClose} className="cancel-profile">
            Cancel
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstaProfile;
