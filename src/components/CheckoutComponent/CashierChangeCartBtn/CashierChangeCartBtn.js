import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import useStyles from "../../TableCommon/style/mainViewStyle";

//import library
import {
  Grid,
  Card,
  Box,
  Tabs,
  Tab,
  TableContainer,
  CardContent,
  CardMedia,
  CardActionArea,
  FormControlLabel,
  Switch,
  Menu,
  MenuItem,
  ListItem,
  IconButton,
  TableBody,
  Typography,
  Tooltip
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import SwapVertTwoToneIcon from "@material-ui/icons/SwapVertTwoTone";
import HighlightOffTwoToneIcon from "@material-ui/icons/HighlightOffTwoTone";

const CashierChangeCartBtn = (props) => {
  const {
    selectedTakeAwayCart,
    selectedIndex,
    anchorEl,
    cartList,
    handleClick,
    handleClose,
    handleChoose,
    handleDelete,
    handleAdd,
    isCart,
  } = props;

  const theme = useTheme();
  const classes = useStyles(theme);
  let hardText = isCart ? "Bán mang đi" : "Nhà cung cấp lẻ";


  const getTitle = (cart) => {
    if (isCart) {
      return cart.customer === null ? hardText : cart.customer.name;
    } else {
      return cart.supplier === null ? hardText : cart.supplier.name;
    }
  };

  return (
    <>
      {cartList.length === 1 ? (
        <Tooltip title = "Thêm 1 giỏ hàng mới">
            <IconButton
            size="small"
            onClick={handleAdd}
            style={{
                marginLeft: 25,
                color: "#000000",
                backgroundColor: theme.customization.primaryColor[100],
            }}
            >
            <AddIcon fontSize="inherit" />
            </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title = "Xem các giỏ hàng hiện tại">
            <IconButton
            size="small"
            onClick={handleClick}
            style={{
                marginLeft: 25,
                color: "#000000",
                backgroundColor: theme.customization.primaryColor[100],
            }}
            >
            <SwapVertTwoToneIcon fontSize="inherit" />
            </IconButton>
        </Tooltip>
      )}
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {cartList.map((cart, index) => (
          <MenuItem key={index} selected={cart.uuid === selectedTakeAwayCart}>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              spacing={1}
            >
              <Grid
                container
                item
                onMouseDown={() => {
                  handleChoose(cart.uuid);
                  handleClose();
                }}
                xs={10}
              >
                <Box style={{ marginRight: 10 }}>#{index + 1}</Box>
                {getTitle(cart)}
              </Grid>

              <Grid container xs={2} item>
                <IconButton
                  onClick={() => handleDelete(cart.uuid)}
                  size="small"
                  style={{ color: "#000000" }}
                >
                  <HighlightOffTwoToneIcon fontSize="inherit" />
                </IconButton>
              </Grid>
            </Grid>
          </MenuItem>
        ))}

        <MenuItem onClick={handleAdd}>
          <Box style={{ marginRight: 10, fontSize: 20 }}>+</Box>Tạo giỏ mới
        </MenuItem>
      </Menu>
    </>
  );
};

export default CashierChangeCartBtn;
