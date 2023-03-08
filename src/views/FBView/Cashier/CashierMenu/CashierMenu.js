
import {
  Grid,
  Card,
  Box,
  Table,
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
  ButtonBase,
  AvatarTypeMap,
  Tooltip,
  Avatar,
  TableCell,
  TableRow,
  Button,
} from "@material-ui/core";

import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";


//apis
import productApi from "../../../../api/productApi";

import useMediaQuery from "@material-ui/core/useMediaQuery";

const CashierMenu = (props) => {
    
    const theme = useTheme();

    const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));
    const [products, setProducts] = useState([]); // Get products from the store 




  return (
    <Box style={{ height: xsScreen ? null : "69vh" }}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        style={{ marginTop: -10, marginBottom: 30 }}
      >
        <Grid>
          <ListItem>
            {/* 1.1.1 Title */}
            <Typography variant="h3"> Bán hàng </Typography>
            <Typography
              variant="h3"
              style={{
                marginLeft: 10,
                color: theme.customization.primaryColor[500],
              }}
            >
              Giỏ 1
            </Typography>
            {/* 1.1.2. Btn Channge Cart */}
            {/* <ChangeCartBtn
              selectedIndex={selectedIndex}
              anchorEl={anchorEl}
              cartList={cartList}
              handleClick={handleClick}
              handleClose={handleClose}
              handleChoose={handleChoose}
              handleDelete={handleDelete}
              handleAdd={handleAdd}
              isCart={true}
            /> */}
          </ListItem>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CashierMenu;
