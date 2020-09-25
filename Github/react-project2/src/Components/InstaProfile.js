import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Dialog, Typography } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import ImageAvatars from "./Avatar";
import axios from "axios";
import spinner from "../Images/spinner.gif";
import { baseURL } from "../Container";

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
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    changeProfile();
  }, [url]);
  const changeProfile = () => {
    axios
      .get(`${baseURL.axios.baseURL}/post/change-profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokens")}`,
        },
      })
      .then((response) => {
        setProfile(response.data.response.photo);
      })
      .catch((errors) => {
        console.log(errors.response);
      });
  };
  const handleChange = (event) => {
    const imageUrl = URL.createObjectURL(event.target.files[0]);
    setLoader(true);

    setTimeout(() => {
      setUrl(imageUrl);
      setLoader(false);
    }, 2000);
    const fd = new FormData();
    fd.append("photo", event.target.files[0]);
    axios
      .patch(`${baseURL.axios.baseURL}/post/change-profile`, fd, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokens")}`,
        },
      })
      .then((response) => {
        console.log(response);
        setLoader(false);
      })
      .catch((errors) => {
        console.log(errors.response);
      });
    handleClose();
  };
  const handleClickOpen = () => {
    if (props.type === true) {
      setOpen(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };
  const removeProfile = () => {
    setLoader(true);
    axios
      .delete(`${baseURL.axios.baseURL}/post/remove-profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokens")}`,
          photo: profile,
        },
      })
      .then((response) => {
        setUrl("");
        setProfile("");
        console.log(response);
        setLoader(false);
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
          loader
            ? spinner
            : !loader && !url && props.profileImage
            ? `${baseURL.axios.baseURL}/${props.profileImage}`
            : !loader && url && url
        }
        onClick={handleClickOpen}
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
              margin: "0",
              padding: "0",
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
          <p onClick={removeProfile} className="remove-profile">
            Remove Current Photo
          </p>
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
