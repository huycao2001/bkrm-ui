
// import React from react; 

import useStyles from "../../../components/TableCommon/style/mainViewStyle";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Category from "./Category/Category";
import { useState, useEffect, React } from "react";
import {
  Typography,
  Card,
  Button,
  Divider,
  Grid,
  ButtonBase,
  Avatar,
  Tooltip,
  TableBody,
  Box
} from "@material-ui/core";

import AddIcon from '@mui/icons-material/Add';
import AddInventory from "./AddInventory/AddInventory";
import {useSelector, useDispatch} from "react-redux";
import { infoActions } from "../../../store/slice/infoSlice";

import productApi from "../../../api/productApi";

export default function Import() {
  const theme = useTheme();
  const classes = useStyles(theme);
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));

  // redux
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const user_uuid = info.user.uuid;

  // vars
  const [cartList, setCartList] = useState();
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, [products])

  const fetchProducts = async () => {
    const response = await productApi.getProductsOfBranch(info.store.uuid, info.branch.uuid, "");
    // console.log("Logging info: " + JSON.stringify(info.user));
    setProducts(response.data);
  }

  const [openAddInventoryDialog, setOpenAddInventoryDialog] = useState(false);
  const handleClose = () => {
    setOpenAddInventoryDialog(false);
  };
  const [reload, setReload] = useState(true);
  const handleClickOpen = () => {
    setOpenAddInventoryDialog(true);
  };

  // Category
  const [openCategory, setOpenCategory] = useState(false);
  const handleClickOpenCategory = () => {
    setOpenCategory(true);
  };
  const handleCloseCategory = () => {
    setOpenCategory(false);
  };

  return (
    <Card className={classes.root} >
      <Grid container direction="row" justifyContent="space-between">
        <Typography className={classes.headerTitle} variant="h5" >
         {info.store.uuid}
        </Typography>
        <Grid>
          <Tooltip title="Thiết lập danh mục">
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              startIcon={<FileCopyIcon />}
              onClick={handleClickOpenCategory}
            >
              Danh mục
            </Button>
          </Tooltip>

          <Tooltip title="Thêm hàng hóa mới">
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              startIcon={<AddIcon />}
              onClick={handleClickOpen}
            >
              Thêm
            </Button>
          </Tooltip>


          <Category open={openCategory} handleClose={handleCloseCategory} />


          {/* <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={handleClickRecommend}
            >
              Gợi ý đặt hàng
            </Button> */}

          {/* <ButtonBase sx={{ borderRadius: "16px" }}>
            <Avatar variant="rounded" className={classes.headerAvatar}>
              <Tooltip title="Thêm sản phẩm">
                <AddIcon stroke={1.5} size="1.3rem" />
              </Tooltip>
            </Avatar>
          </ButtonBase> */}
        </Grid>

      </Grid>
      <AddInventory
        open={openAddInventoryDialog}
        handleClose={handleClose}
        setReload={() => setReload(!reload)}
      />
    </Card>
  );
};