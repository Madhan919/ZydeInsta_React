import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { Divider } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
}));

export default function CustomizedDialogs(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleSubmit = () => {
    setOpen(false);
    props.onClick();
  };
  return (
    <div className="remove_follow">
      <Button
        variant="outlined"
        className="btn-following"
        onClick={() => setOpen(true)}
      >
        {props.text}
      </Button>
      <Dialog
        onClose={() => setOpen(false)}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <center style={{ paddingTop: "20px" }}>
          <Avatar
            alt="Remy Sharp"
            src={`http://localhost:9000/${props.url}`}
            className={classes.large}
            style={{ textAlign: "center" }}
          />
          <label
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              paddingRight: "130px",
              paddingLeft: "130px",
            }}
          >
            Unfollow <strong>{props.user}?</strong>
          </label>
        </center>
        <Divider />
        <Button
          variant="outlined"
          style={{ color: "red", padding: "15px 10px" }}
          onClick={handleSubmit}
        >
          <strong>Unfollow</strong>
        </Button>
        {props.spinner && <div className="spinner-border follow_spinner" />}
        <Divider />
        <Button
          variant="outlined"
          style={{ color: "black", padding: "15px 30px" }}
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
      </Dialog>
    </div>
  );
}
