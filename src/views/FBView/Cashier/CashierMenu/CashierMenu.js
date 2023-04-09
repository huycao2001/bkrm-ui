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

// import ChangeCartBtn from "../../../../components/CheckoutComponent/ChangeCartBtn/ChangeCartBtn";

import React, { useRef, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@material-ui/core/styles";

import AddIcon from "@material-ui/icons/Add";

import AddInventory from "../../../InventoryView/Inventory/AddInventory/AddInventory";
import MenuProduct from "../../../../components/MenuProduct/MenuProduct";

//apis
import productApi from "../../../../api/productApi";

import useMediaQuery from "@material-ui/core/useMediaQuery";

const CashierMenu = (props) => {
  const theme = useTheme();

  //redux
  const info = useSelector((state) => state.info);

  const { products,
    setProducts,
    handleSearchBarSelect,
    selectedCart
  
  } = props;

  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const [openAddInventory, setOpenAddInventory] = useState(false);

  const [showImage, setShowImage] = React.useState(true);
  const [typeShow, setTypeShow] = useState("list");

  return (
    <Box style={{ height: xsScreen ? null : "69vh" }}>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        style={{ marginTop: -10, marginBottom: 30 }}
      >
        {openAddInventory && (
          <AddInventory
            open={openAddInventory}
            handleClose={() => {
              setOpenAddInventory(false);
            }}
            // setReload={() => {
            //   setReloadProduct(!reloadProduct);
            // }}
          />
        )}
        <Grid>
          <ListItem>
            {/* 1.1.1 Title */}
            <Typography variant="h3"> Bán hàng </Typography>
            
            {/* 1.1.2. Btn Channge Cart */}
            <IconButton>
              <AddIcon/>
            </IconButton>

            {info.role === "owner" ? (
              <Grid item>
                <Tooltip title="Thêm sản phẩm">
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setOpenAddInventory(true);
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    Thêm
                  </Button>
                </Tooltip>
              </Grid>
            ) : null}
          </ListItem>
          <Grid>
            <Grid container alignItems="center">
              {/* <SearchProduct
                  products={products}
                  setProducts={setProducts}
                  isFilter={true}
                /> */}

              {/* {info.role === "owner" ? (
                <Grid item>
                  <Tooltip title="Thêm sản phẩm">
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() => {
                        setOpenAddInventory(true);
                      }}
                      style={{ marginLeft: 10 }}
                    >
                      Thêm
                    </Button>
                  </Tooltip>
                </Grid>
              ) : null} */}
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <MenuProduct
        products={products}
        setProducts = {setProducts}
        typeShow = {typeShow}
        setTypeShow={setTypeShow}
        selectedItem={selectedCart}
        handleSearchBarSelect = {handleSearchBarSelect}
        isCart = {true}
        showImage={showImage}
        setShowImage={setShowImage}
      
      />
    </Box>
  );
};

export default CashierMenu;
