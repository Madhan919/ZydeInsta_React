import React from "react";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    left: theme.spacing(113.5),
    top: theme.spacing(-2),
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
}));

const ImageAvatars = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Avatar
        alt="Profile"
        src={props.imageName}
        className={classes.large}
        onClick={props.onClick}
      />
    </div>
  );
};
export default ImageAvatars;
