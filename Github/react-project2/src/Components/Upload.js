import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import Typography from "@material-ui/core/Typography";
import { Button } from ".";
import axios from "axios";
import { FiCamera } from "react-icons/fi";
import { Redirect } from "react-router-dom";
import { baseURL } from "../Container";
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
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
  },
}))(MuiDialogContent);

const Upload = (props) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [caption, setValue] = useState();
  const [spinner, setSpinner] = useState();
  const [state, setState] = useState();
  const handleChange = (event) => {
    setUrl(URL.createObjectURL(event.target.files[0]));
    setFile(event.target.files[0]);
  };
  const uploadImage = (event) => {
    const fd = new FormData();
    fd.append("image", selectedFile);
    setSpinner(true);
    axios
      .post(`${baseURL.axios.baseURL}/post`, fd, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tokens")}`,
          caption: caption,
        },
      })
      .then((response) => {
        console.log("response", response);
        setState(response.data);
        handleClose();
        setSpinner(false);
      })
      .catch((errors) => {
        console.log(errors.error);
      });
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setUrl("");
    setOpen(false);
    setFile("");
  };
  return (
    <div className="upload1">
      {state && (
        <Redirect
          to={{
            pathname: `/feeds`,
            state: { data: state },
          }}
        />
      )}
      <FiCamera
        strokeWidth="1"
        size="1.8rem"
        className="upload1"
        onClick={handleClickOpen}
      />
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Profile
        </DialogTitle>

        <DialogContent dividers>
          {spinner && (
            <div
              className="spinner-border"
              style={{ color: "#fff", top: "50%", position: "absolute" }}
            />
          )}
          {url.length > 0 && (
            <img alt="uploaded" className="uploadImage" src={url} />
          )}
          {!selectedFile && (
            <div className="imageUpload">
              <label htmlFor="files" className="btn chooseImage">
                Choose File
              </label>
              <input
                id="files"
                style={{ display: "none" }}
                type="file"
                onChange={handleChange}
              />
              <br />
            </div>
          )}

          <input
            type="text"
            className="textfield"
            placeholder="Description"
            name="caption"
            onChange={(event) => setValue(event.target.value.trim())}
          />
          <br />
          <Button
            className="upload-button"
            onClick={uploadImage}
            text="Upload"
          />
          <Button
            className="upload-button"
            onClick={handleClose}
            text="Cancel"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Upload;
