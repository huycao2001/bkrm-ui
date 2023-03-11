import React, { useRef, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useTheme, makeStyles } from "@material-ui/core/styles";

import { infoActions } from "../../../store/slice/infoSlice";
import { statusAction } from "../../../store/slice/statusSlice";

import useStyles from "../../../components/TableCommon/style/mainViewStyle";
import {
  AppBar,
  Toolbar,
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
import PropTypes from "prop-types";


import CashierMenu from "./CashierMenu/CashierMenu";
import SearchProductCashier from "../../../components/SearchBar/SearchProductCashier";

import productApi from "../../../api/productApi";

// import Tabs from "@material-ui/core/Tabs";
// import Tab from "@material-ui/core/Tab";

// const myStyle = makeStyles((theme) => ({
//     appBar : {
//         backgroundColor : theme.palette.primary.light
//     }
// }));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Cashier = (props) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  //Redux
    // redux
    const dispatch = useDispatch();
    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch = info.branch;
    const branch_uuid = info.branch.uuid;

    const user_uuid = useSelector((state) => state.info.user.uuid);


    const loadCartLocalStorage = () => {
      if (window.localStorage.getItem("cashierCartListData")) {
        const data = JSON.parse(window.localStorage.getItem("cashierCartListData"));
        if (data.user_uuid === user_uuid) {
          return data.cartList;
        }
      }
      return [
        {
          customer: null,
          cartItem: [],
          total_amount: "0",
          paid_amount: "0",
          discount: "0",
          payment_method: "cash",
          delivery: false,
          scores: "0",
          discountDetail: { value: "0", type: "VND" },
          selectedPromotion: null,
          otherFee: 0,
        },
      ];
    };


  const [index, setIndex] = useState(0); // Tab index

  const [products, setProducts] = useState([]);


  // Set the products to local storage
  // useEffect(() => {
  //   if (products.length) {
  //     window.localStorage.setItem(
  //       "products",
  //       JSON.stringify({
  //         store_uuid: store_uuid,
  //         branch_uuid: branch_uuid,
  //         data: products,
  //       })
  //     );
  //   }
  // }, [products]);


  //Load products the initial products are empty
  const loadProducts = async () => {
    try {
      const response = await productApi.searchBranchProduct(
        store_uuid,
        branch_uuid,
        ""
      );
      setProducts(response.data);

      console.log(" mmm " + JSON.stringify(response))
    } catch (err) {
      console.log("Load product fails in Cashier.js")
      console.log(err);
    }
  };
  useEffect(() => {
    loadProducts();
  }, [])

  const handleChangeIndex = (event, newIndex) => {
    setIndex(newIndex);
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      {/* 1) Menu on the left */}

      <Grid item xs={12} sm={8}>
        <Card className={classes.root}>
          <Box style={{ minHeight: "82vh", paddingBottom: 0 }}>
            <AppBar
              className={classes.appBar}
              position="static"
              style={{ backgroundColor: "#ededed" }}
            >
              <Toolbar>
                <Tabs
                  value={index}
                  onChange={handleChangeIndex}
                  aria-label="simple tabs example"
                >
                  <Tab
                    label="Phòng bàn"
                    style={{ color: "black" }}
                    {...a11yProps(0)}
                  />
                  <Tab
                    label="Thực đơn"
                    style={{ color: "black" }}
                    {...a11yProps(1)}
                  />
                </Tabs>

                <SearchProductCashier
                  products = {products}
                  setProducts = {setProducts}
                />
              </Toolbar>
            </AppBar>
            <TabPanel value={index} index={0}>
              Table view
            </TabPanel>

            <TabPanel value={index} index={1}>
                <CashierMenu
                  products = {products}
                  setProducts = {setProducts}
                />
            </TabPanel>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} sm={4} className={classes.root}>
        <Card className={classes.root}>
          <Box style={{ padding: 0, minHeight: "82vh" }}>Summary</Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Cashier;
