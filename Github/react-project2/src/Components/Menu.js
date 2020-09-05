import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { AiOutlineEllipsis } from "react-icons/ai";

export default function SimpleMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    if (props.type) {
      setAnchorEl(event.currentTarget);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <AiOutlineEllipsis
        className="dotImg1"
        size="2rem"
        onClick={handleClick}
      />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={props.onClick}>Delete Photo</MenuItem>
        <MenuItem onClick={handleClose}>Edit Photo</MenuItem>
        <MenuItem onClick={handleClose}>Cancel</MenuItem>
      </Menu>
    </div>
  );
}
