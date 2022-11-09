import * as React from 'react';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


import { Link, Redirect } from 'react-router-dom';

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {

    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onMouseOver={handleClick}
        style ={{color : "white"}}
      >
        Dashboard
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >

        {/* <Link to={"/home"}> */}
          <MenuItem onClick={handleClose} to ={"/signup"}  component ={Link} >Tổng quan</MenuItem>
        {/* </Link> */}
        
        <MenuItem onClick={handleClose}>Sổ quỹ</MenuItem>
        <MenuItem onClick={handleClose}>Doanh thu</MenuItem>
      </Menu>
    </div>
  );
}
