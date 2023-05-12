import React, { useEffect, useState } from "react";
import { withStyles, useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

//import library
import { styled } from "@mui/material/styles";
import {
  //Box,
  Grid,
  Collapse,
  Typography,
  Button,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip
} from "@material-ui/core";
import Box from "@mui/material/Box";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { borders } from "@material-ui/system";
//import icon
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import HighlightOffTwoToneIcon from "@material-ui/icons/HighlightOffTwoTone";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateIcon from "@mui/icons-material/Create";
import LocalOfferTwoToneIcon from "@material-ui/icons/LocalOfferTwoTone";
import VerifiedUserTwoToneIcon from "@material-ui/icons/VerifiedUserTwoTone";
//import image
import avaUpload from "../../../../../assets/img/product/img.jpeg";
//import project
import {
  StyledMenu,
  StyledMenuItem,
} from "../../../../../components/Button/MenuButton";
import productApi from "../../../../../api/productApi";
// carousel for images
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useDispatch, useSelector } from "react-redux";
import UpdateInventory from "./UpdateInventory/UpdateInventory";
import ConfirmPopUp from "../../../../../components/ConfirmPopUp/ConfirmPopUp";
import UOMPopup from "../../../../../components/UOMPopup/UOMPopup";


import { statusAction } from "../../../../../store/slice/statusSlice";
import {
  ThousandFormat,
  VNDFormat,
} from "../../../../../components/TextField/NumberFormatCustom";
import {
  Table,
  TableHead, 
  TableBody,
  TableCell, 
  TableRow, 
  Avatar, 
  ListItem, 
  Chip 
} from "@mui/material";

import { tableCellClasses } from "@mui/material/TableCell";
import clsx from "clsx";

import { FormatedProductStatus } from "../../../../../components/TableCommon/util/format";
import VarianceModal from "./VarianceModal";
import { VarianceProductMiniTableRow } from "../../../../../components/MiniTableRow/MiniTableRow";
import branchApi from "../../../../../api/branchApi";

import defaultProduct from "../../../../../assets/img/product/default-product.png";
import BranchInventoryPopUp from "./BranchInventoryPopUp";




const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#2196f3",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));



const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .MuiTextField-root": {
        marginTop: theme.spacing(2),
      },
    },
    headerTitle: {
      fontSize: "1.125rem",
    },
    typo: {
      marginBottom: 20,
    },
  })
);

const UploadImage = () => {
  return (
    <Box
      component="img"
      sx={{
        height: 170,
        width: 170,
        borderRadius: 2,
        marginLeft: 15,
      }}
      src={avaUpload}
    />
  );
};
const InventoryDetail = (props) => {
  const { row, openRow, setReload, isManageInventory } = props.parentProps;
  const { isMini } = props;
  const theme = useTheme();
  const classes = useStyles(theme);
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [thisReload, setThisReload] = useState(false);


  const [openUOMPopup, setOpenUOMPopup] = useState(false);

  const dispatch = useDispatch();

  const [productDetail, setProductDetail] = useState({
    name: "",
    bar_code: "",
    category: { name: "" },
    images: [],
    suppliers: [],
  });

  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const handleCloseDelete = () => {
    setDeleteConfirm(false);
  };
  const handleConfirmDelete = async () => {
    handleCloseDelete();
    try {
      const response = await productApi.deleteProduct(store_uuid, row.uuid);
      dispatch(statusAction.successfulStatus("Xóa thành công"));
      setReload();
      // console.log(response);
    } catch (error) {
      // console.log(error);
      dispatch(statusAction.failedStatus("Xóa thất bại"));
    }
  };
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const branchs = info.store.branches;

  // const [branchs, setBranchs] = useState(info.branchsOfStore);

  const [isOpenVarianceDetailModal, setIsOpenVariaceDetailModal] =
    useState(false);
  const [selectedVariance, setSelectedVariance] = useState({});
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productApi.getProduct(store_uuid, row.uuid, {
          branch_uuid: branch_uuid,
        });
        setProductDetail(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (openRow === row.uuid) {
      fetchProduct();
    }
  }, [store_uuid, openRow, thisReload]);
  const handleCloseUpdate = (status) => {
    setIsOpenUpdate(false);
  };

  const [openDetailInventory, setOpenDetailInventory] = useState(false);
  //console.log("productDetail.img_urls", productDetail);

  let imageList = row.img_urls ? JSON.parse(row.img_urls) : null;
  imageList = Array.isArray(imageList) ? imageList : [imageList];
  // || defaultProduct
  return row.has_variance ? (
    <>
      {openRow === row.uuid &&
        productDetail.variations?.map((variance) => {
          return !xsScreen ? (
            <>
              <TableRow>
                <TableCell align="left">{"               "}</TableCell>
                <TableCell align="left">{variance.product_code}</TableCell>
                <TableCell align="left" style={{ minWidth: 200 }}>
                  <ListItem
                    style={{
                      marginLeft: -30,
                      marginTop: -10,
                      marginBottom: -10,
                    }}
                  >
                    <Box
                      component="img"
                      sx={{
                        height: 50,
                        width: 50,
                        borderRadius: 10,
                        marginRight: 15,
                      }}
                      src={
                        JSON.parse(row.img_urls ? row.img_urls : "[]").at(0) ||
                        defaultProduct
                      }
                    />
                    <Typography className={classes.fontName}>
                      {variance.name}
                    </Typography>
                  </ListItem>
                </TableCell>

                <TableCell align="left">{variance.category?.name}</TableCell>
                <TableCell align="right">
                  <VNDFormat value={variance.list_price} />
                </TableCell>
                <TableCell align="right">
                  <VNDFormat value={variance.standard_price} />
                </TableCell>
                <TableCell align="center">
                  <FormatedProductStatus
                    quantity={variance.branch_quantity}
                    lowStock={variance.min_reorder_quantity}
                  />
                </TableCell>
                <TableCell align="right" className={classes.fontName}>
                  {variance.branch_quantity}
                </TableCell>
                <TableCell
                  onClick={() => {
                    setIsOpenVariaceDetailModal(true);
                    setSelectedVariance(variance);
                  }}
                >
                  <Button size="small" color="primary" variant="outlined">
                    Chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            </>
          ) : (
            <VarianceProductMiniTableRow
              key={row.uuid}
              variance={variance}
              onClick={() => {
                setIsOpenVariaceDetailModal(true);
                setSelectedVariance(variance);
              }}
            />
          );
        })}
      {isOpenVarianceDetailModal && (
        <VarianceModal
          open={isOpenVarianceDetailModal}
          parentProps={props.parentProps}
          row={selectedVariance}
          handleClose={() => setIsOpenVariaceDetailModal(false)}
          branchs={branchs}
          // handleBranchQuantity={()=>{setOpenDetailInventory(true); console.log("helllllooo")}}
          setReload={() => {
            setReload();
            setThisReload(!thisReload);
          }}
          batches={row.batches}
          has_batches={row.has_batches}
          isManageInventory={isManageInventory}
        />
      )}
    </>
  ) : (
    <Collapse
      in={isMini ? true : openRow === row.uuid}
      timeout="auto"
      unmountOnExit
    >
      {isOpenUpdate && (
        <UpdateInventory
          handleClose={handleCloseUpdate}
          open={isOpenUpdate}
          productInfo={productDetail}
          setReload={() => {
            setReload();
            setThisReload(!thisReload);
          }}
          isManageInventory={isManageInventory}
        />
      )}
      <ConfirmPopUp
        open={deleteConfirm}
        handleConfirm={handleConfirmDelete}
        handleClose={handleCloseDelete}
        message={
          <Typography>
            Xóa vĩnh viễn sản phẩm <b>{productDetail.name} ?</b>
          </Typography>
        }
      />

      {row.unit_of_measurement_categories && <UOMPopup
        openUOMPopup = {openUOMPopup}
        handleCloseUOMPopup = {() => {
          setOpenUOMPopup(false); 
        }}
        //UOMList = {row.unit_of_measurement_categories}
        product ={row}
    
      />}




      <Box margin={0} sx={{ mt: 3, mb: 2 }}>
        <Grid container direction="row" justifyContent="flex-start">
          <Grid item xs={12} sm={3}>
            <Grid item xs={9} align="center">
              {imageList.at(0) ? (
                <Box
                  sx={{
                    // height: 170,
                    // width: 170,
                    height: xsScreen ? 100 : 170,
                    width: xsScreen ? 100 : 170,
                    borderRadius: 2,
                    marginLeft: 15,
                    marginBottom: xsScreen ? 10 : 0,
                  }}
                >
                  <Carousel showThumbs={false}>
                    {imageList?.map((url) => (
                      <img
                        // uh yeah this is just one of many places that will have to be changed
                        // just prepend url with REACT_APP_SERVER_HOST env
                        key={process.env.REACT_APP_SERVER_HOST + url}
                        src={process.env.REACT_APP_SERVER_HOST + url}
                        height={xsScreen ? "100" : "170"}
                        width={xsScreen ? "100" : "170"}
                        // height= "170"
                        // width= "170"
                      />
                    ))}
                  </Carousel>
                </Box>
              ) : (
                <Box
                  component="img"
                  sx={{
                    height: xsScreen ? 100 : 170,
                    width: xsScreen ? 100 : 170,
                    //marginLeft: 7,
                    //marginRight: 7,
                    borderRadius: 2,
                  }}
                  src={defaultProduct}
                  style={{ marginBottom: 25 }}
                />
              )}
            </Grid>
            <Grid item xs={9} align="center">
              <Box
                sx={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: "#212121",
                  mb: 2,
                }}
              >
                {productDetail.name}
              </Box>
            </Grid>
          </Grid>

          <Grid container direction="column" item xs={12} sm={9}>
            <Grid container direction="row">
              <Grid item xs={6}>
                <Box
                  sx={{
                    fontSize: 18,
                    fontWeight: 400,
                    color: "#212121",
                    mb: 2,
                  }}
                >
                  Thông tin sản phẩm
                </Box>
                <Grid container direction="row" justifyContent="flex-start">
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "#878787",
                        mb: 2,
                      }}
                    >
                      Tên sản phẩm
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box
                      sx={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "#212121",
                      }}
                    >
                      {productDetail.name}
                    </Box>
                  </Grid>
                </Grid>
                <Grid container direction="row" justifyContent="flex-start">
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "#878787",
                        mb: 2,
                      }}
                    >
                      Mã sản phẩm
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box
                      sx={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "#212121",
                      }}
                    >
                      {productDetail.product_code}
                    </Box>
                  </Grid>
                </Grid>
                <Grid container direction="row" justifyContent="flex-start">
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "#878787",
                        mb: 2,
                      }}
                    >
                      Mã vạch
                    </Box>
                  </Grid>
                  <Grid item sm={6}>
                    <Box
                      sx={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "#212121",
                      }}
                    >
                      {productDetail.bar_code}
                    </Box>
                  </Grid>
                </Grid>
                <Grid container direction="row" justifyContent="flex-start">
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "#878787",
                        mb: 2,
                      }}
                    >
                      Danh mục
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box
                      sx={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "#212121",
                      }}
                    >
                      {productDetail.category.name}
                    </Box>
                  </Grid>
                </Grid>
                <Grid container direction="row" justifyContent="flex-start">
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "#878787",
                      }}
                    >
                      Đơn vị
                    </Box>
                  </Grid>
                  <Grid ListItemText>
                    <Box
                      sx={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "#212121",
                      }}
                    >
                      {productDetail.quantity_per_unit}
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <Box
                  sx={{
                    fontSize: 18,
                    fontWeight: 400,
                    color: "#212121",
                    mb: 2,
                  }}
                >
                  Giá
                </Box>
                <Grid container direction="row" justifyContent="flex-start">
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "#878787",
                        mb: 2,
                      }}
                    >
                      Giá bán
                    </Box>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1" gutterBottom component="div">
                      <VNDFormat value={productDetail.list_price}></VNDFormat>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container direction="row" justifyContent="flex-start">
                  <Grid item xs={4}>
                    <Box
                      sx={{
                        fontSize: 14,
                        fontWeight: 400,
                        color: "#878787",
                        mb: 2,
                      }}
                    >
                      Giá vốn
                    </Box>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1" gutterBottom component="div">
                      <VNDFormat
                        value={productDetail.standard_price}
                      ></VNDFormat>{" "}
                    </Typography>
                  </Grid>
                </Grid>
                {isManageInventory ? (
                  <>
                    <Box
                      sx={{
                        fontSize: 18,
                        fontWeight: 400,
                        color: "#212121",
                        mb: 2,
                      }}
                    >
                      Số lượng
                    </Box>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-start"
                      //alignItems="center"
                    >
                      <Grid item xs={4}>
                        <Box
                          sx={{
                            fontSize: 14,
                            fontWeight: 400,
                            color: "#878787",
                            mb: 2,
                          }}
                        >
                          Tồn kho
                        </Box>
                      </Grid>
                      <Grid item>
                        {/* <Typography variant="body1" gutterBottom component="div">
                      {row.branch_quantity}{" "}
                    </Typography> */}
                        <ThousandFormat value={row.branch_quantity} />
                      </Grid>
                      {branchs.length > 1 || row.has_batches ? (
                        <Grid
                          item
                          sm={4}
                          style={{ marginTop: -5, marginBottom: 5 }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            style={{ textTransform: "none" }}
                            onClick={() => setOpenDetailInventory(true)}
                          >
                            {" "}
                            Chi tiết
                          </Button>
                        </Grid>
                      ) : null}
                      {openDetailInventory ? (
                        <BranchInventoryPopUp
                          branch_inventories={row.branch_inventories}
                          branchs={branchs}
                          open={openDetailInventory}
                          onClose={() => setOpenDetailInventory(false)}
                          setReload={() => {
                            setReload();
                            setThisReload(!thisReload);
                          }}
                          batches={row.batches}
                          has_batches={row.has_batches}
                          row={row}
                        />
                      ) : null}
                    </Grid>
                    {row.has_batches ? (
                      <Typography
                        variant="h6"
                        style={{
                          color: theme.customization.primaryColor[500],
                        }}
                      >
                        * Sản phẩm quản lý theo lô *
                      </Typography>
                    ) : null}
                    {row.has_batches ? (
                      <Typography
                        variant="h6"
                        style={{
                          color: theme.customization.primaryColor[500],
                          marginBottom: 10,
                        }}
                      >
                        Thông báo hết HSD trước {row.notification_period} ngày
                      </Typography>
                    ) : null}

                    <Grid container direction="row" justifyContent="flex-start">
                      <Grid item xs={4}>
                        <Box
                          sx={{
                            fontSize: 14,
                            fontWeight: 400,
                            color: "#878787",
                            mb: 2,
                          }}
                        >
                          SL đặt hàng lại
                        </Box>
                      </Grid>
                      <Grid item>
                        {/* <Typography variant="body1" gutterBottom component="div">
                      {row.min_reorder_quantity}{" "}
                    </Typography> */}
                        <ThousandFormat value={row.min_reorder_quantity} />
                      </Grid>
                    </Grid>

                    <Grid container direction="row" justifyContent="flex-start">
                      <Grid item xs={4}>
                        <Box
                          sx={{
                            fontSize: 14,
                            fontWeight: 400,
                            color: "#878787",
                            mb: 2,
                          }}
                        >
                          SL nhập hàng tối đa
                        </Box>
                      </Grid>
                      <Grid item>
                        {/* <Typography variant="body1" gutterBottom component="div">
                      {row.max_order}{" "}
                    </Typography> */}
                        <ThousandFormat value={row.max_order} />
                      </Grid>
                    </Grid>
                  </>
                ) : null}
              </Grid>
            </Grid>

            {row.recipe_data.ingredients && <Grid
            container
            direction="column"
            >
              <Box
                  sx={{
                    fontSize: 18,
                    fontWeight: 400,
                    color: "#212121",
                    mb: 2,
                  }}
                >
                  Thành phần nguyên liệu
                </Box>
              <Table>
                <TableHead sx={{ borderBottom: 0 }}>
                  <TableRow sx={{ borderBottom: 0 }}>
                    <StyledTableCell>Tên thành phần</StyledTableCell>
                    <StyledTableCell>Số lượng</StyledTableCell>
                    <StyledTableCell>Đơn vị</StyledTableCell>
                    <StyledTableCell>Giá nhập</StyledTableCell>
                    <StyledTableCell>Thành tiền</StyledTableCell>
                    
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.recipe_data.ingredients.map((ingredient, index) => (
                    <StyledTableRow key = {index} >
                      <StyledTableCell component="th" scope="row">
                        {ingredient.product_name}
                      </StyledTableCell>

                      <StyledTableCell component="th" scope="row">
                        {ingredient.quantity_required}
                      </StyledTableCell>

                      <StyledTableCell component="th" scope="row">
                        {ingredient.quantity_per_unit}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        <ThousandFormat value = {ingredient.standard_price}/>
                      </StyledTableCell>

                      <StyledTableCell component="th" scope="row">
                        <ThousandFormat value = {ingredient.standard_price * ingredient.quantity_required}  />
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>

            </Grid>}

            <Grid
              container
              direction="row"
              justifyContent={"flex-end"}
              style={{ marginTop: 20 }}
            >

            {row.unit_of_measurement_categories.length > 0  ? 
              <Tooltip title = "Sản phẩm có nhiều đơn vị quy đổi">

                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  // startIcon={<DeleteIcon />}
                  style={{ marginLeft: 15 }}
                  onClick={() => {
                    setOpenUOMPopup(true);
                  }}
                >
                  Đơn vị quy đổi
              </Button>

              </Tooltip>
            
            : null
            }


              <Button
                variant="contained"
                size="small"
                color="primary"
                startIcon={<CreateIcon />}
                style={{ marginLeft: 15 }}
                onClick={() => {
                  setIsOpenUpdate(true);
                }}
              >
                Sửa
              </Button>
              <Button
                variant="contained"
                size="small"
                color="secondary"
                startIcon={<DeleteIcon />}
                style={{ marginLeft: 15 }}
                onClick={() => {
                  setDeleteConfirm(true);
                }}
              >
                Xoá
              </Button>


              

              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
                size="small"
                style={{ marginLeft: 10 }}
              >
                <MoreVertIcon />
              </IconButton>

              <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <StyledMenuItem>
                  <ListItemIcon style={{ marginRight: -15 }}>
                    <InboxIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="In mã tem" />
                </StyledMenuItem>

                <StyledMenuItem>
                  <ListItemIcon style={{ marginRight: -15 }}>
                    <HighlightOffTwoToneIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Ngừng kinh doanh" />
                </StyledMenuItem>

                {/* <StyledMenuItem>
                  <ListItemIcon style={{ marginRight: -15 }}>
                    <LocalOfferTwoToneIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Lịch sử giá" />
                </StyledMenuItem>

                <StyledMenuItem>
                  <ListItemIcon style={{ marginRight: -15 }}>
                    <VerifiedUserTwoToneIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Lịch sử kiểm kê" />
                </StyledMenuItem> */}
              </StyledMenu>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Collapse>
  );
};

export default InventoryDetail;
