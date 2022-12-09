import React, { useRef, useState, useEffect } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import { useReactToPrint } from "react-to-print";
import { ReceiptPrinter } from "../../../../../components/ReceiptPrinter/ReceiptPrinter";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { calculateTotalQuantity } from "../../../../../components/TableCommon/util/sortUtil";
// import library
import {
  Dialog,
  Card,
  DialogContent,
  Box,
  Tooltip,
  Chip,
  //Grid,
  //TableHead,
  //TableBody,
  //Typography,
  //Table,
  //TableCell,
  //TableRow,
  Collapse,
  Button,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@material-ui/core";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import Divider from "@mui/material/Divider";

// import icon
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PrintTwoToneIcon from "@material-ui/icons/PrintTwoTone";
import GetAppTwoToneIcon from "@material-ui/icons/GetAppTwoTone";
import CloseIcon from "@material-ui/icons/Close";

// import project
import { grey } from "@material-ui/core/colors";
import { useSelector, useDispatch } from "react-redux";
import {
  StyledMenu,
  StyledMenuItem,
} from "../../../../../components/Button/MenuButton";
import InvoiceReturnPopUp from "../../../../../components/PopUpReturn/InvoiceReturnPopUp/InvoiceReturnPopUp";

import orderApi from "../../../../../api/orderApi";
import { VNDFormat } from "../../../../../components/TextField/NumberFormatCustom";
import PayRemaining from "../../../../../components/Modal/PayRemaining";
import invoiceApi from "../../../../../api/invoiceApi";
import setting from "../../../../../assets/constant/setting";
import { statusAction } from "../../../../../store/slice/statusSlice";

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
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    card: {
      background: theme.customization.mode === "Light" ? null : grey[800],
      borderRadius: theme.customization.borderRadius,
      color: "#000000",
      borderWidth: 2,
    },
    background: {
      background:
        theme.customization.mode === "Light"
          ? theme.customization.primaryColor[50]
          : grey[700],
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
  })
);

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

function InvoiceDetail(props) {
  const { row, openRow, onReload } = props.parentProps;
  const { isMini } = props;

  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const dispatch = useDispatch();

  //  tam thoi

  const theme = useTheme();
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const classes = useStyles(theme);
  const [reload, setReload] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseReturn = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    try {
      const res = orderApi.deleteOrder(store_uuid, branch_uuid, row.uuid);
      dispatch(statusAction.successfulStatus("Xóa hóa đơn thành công"));
      onReload();
    } catch (err) {
      dispatch(statusAction.failedStatus("Xóa hóa đơn thất bại"));
      console.log(err);
    }
  };

  const [order, setOrder] = useState({
    customer: { name: "" },
    created_by_user: { name: "" },
    branch: null,
    details: [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await orderApi.getOrder(store_uuid, row.uuid);
        // console.log(res.data)
        console.log("res", res.data);
        setOrder(res.data);
      } catch (error) {
        setOrder({
          customer: { name: "" },
          created_by_user: { name: "" },
          branch: null,
          details: [],
        });
      }

      // },
      //   [props.parentProps.openRow],
      // );
    };
    if (openRow === row.uuid) {
      loadData();
    }
  }, [props.parentProps.openRow, reload]);
  const debtAmount = order.total_amount - order.discount - order.paid_amount;
  const [openPayRemaining, setOpenPayRemaining] = useState(false);
  const editInventoryOrderApiCall = async (
    store_uuid,
    branch_uuid,
    uuid,
    body
  ) => {
    return orderApi.editOrderApi(store_uuid, branch_uuid, uuid, body);
  };

  //print

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  function getDifferenceInDays(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    return diffInMs / (1000 * 60 * 60 * 24);
  }
  const store_setting = info.store.general_configuration
    ? JSON.parse(info.store.general_configuration)
    : setting;
  const type = store_setting?.printReceiptWhenSell.cartModal;

  const returnLimit = store_setting?.returnLimit;

  // const haveReturnQuantity = order.details.ex(()=>returned_quantity)
  var haveReturnQuantity = order.details.every(function (element, index) {
    if (Number(element.returned_quantity) === 0) return false;
    else return true;
  });

  return (
    <Collapse
      in={isMini ? true : openRow === row.uuid}
      timeout="auto"
      unmountOnExit
    >
      <PayRemaining
        onReload={props.parentProps.onReload}
        reloadDetail={() => setReload(!reload)}
        uuid={row.uuid}
        debt={debtAmount}
        paid={Number(row.paid_amount)}
        title={
          <Typography variant="h4">
            Thu thêm hóa đơn <i>{row.order_code}</i>
          </Typography>
        }
        open={openPayRemaining}
        handleClose={() => setOpenPayRemaining(false)}
        editApiCall={editInventoryOrderApiCall}
      />
      {/* <Collapse in={true } timeout="auto" unmountOnExit> */}

      <Box margin={5}>
        <Grid container direction="row" sx={{ mb: 5 }}>
          <Grid item md={4} sx={{ mb: 5 }}>
            <Grid container direction="column">
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#878787",
                    letterSpacing: 1,
                  }}
                >
                  MÃ HOÁ ĐƠN
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {row.order_code}
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4}>
            <Grid container direction="column">
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#878787",
                    letterSpacing: 1,
                  }}
                >
                  NGƯỜI BÁN
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#2196f3",
                  }}
                >
                  {order.created_by_user ? order.created_by_user.name : ""}{" "}
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4}>
            <Grid container direction="column">
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#878787",
                    letterSpacing: 1,
                  }}
                >
                  CHI NHÁNH THỰC HIỆN
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {order.branch ? order.branch.name : ""}
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4} sx={{ mb: 5 }}>
            <Grid container direction="column">
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#878787",
                    letterSpacing: 2,
                  }}
                >
                  NGÀY BÁN
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    //color: "#878787",
                  }}
                >
                  {row.creation_date
                    ?.split(" ")[0]
                    .split("-")
                    .reverse()
                    .join("/")
                    .concat(
                      "\u00a0\u00a0" +
                        row.creation_date?.split(" ")[1].substr(0, 5)
                    )}
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4}>
            <Grid container direction="column">
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#878787",
                  }}
                >
                  TRẠNG THÁI
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    //color: "#878787",
                  }}
                >
                  {debtAmount > 0 ? "Còn nợ " : "Trả đủ"}
                  {debtAmount > 0 ? <VNDFormat value={debtAmount} /> : null}
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4}>
            <Grid container direction="column">
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#878787",
                  }}
                >
                  PHƯƠNG THỨC THANH TOÁN
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    //color: "#878787",
                  }}
                >
                  {row.payment_method === "cash" ? "Tiền mặt" : "Thẻ"}
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4}>
            <Grid container direction="column">
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#878787",
                  }}
                >
                  KHÁCH HÀNG
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    //color: "#878787",
                  }}
                >
                  {order.customer ? order.customer.name : ""}
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={4}>
            <Grid container direction="column">
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#878787",
                  }}
                >
                  TỔNG TIỀN HOÁ ĐƠN
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    //color: "#878787",
                  }}
                >
                  <VNDFormat
                    value={row.total_amount - row.discount}
                  ></VNDFormat>{" "}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Table size="small" aria-label="purchases" sx={{ borderBottom: 0 }}>
          <TableHead sx={{ borderBottom: 0 }}>
            <TableRow sx={{ borderBottom: 0 }}>
              <StyledTableCell>Mã SP</StyledTableCell>
              <StyledTableCell>Sản phẩm</StyledTableCell>
              {/* <TableCell>Mã vạch</TableCell> */}
              <StyledTableCell align="right">Số lượng</StyledTableCell>
              <StyledTableCell align="right">Đổi trả</StyledTableCell>
              <StyledTableCell align="right">Giá nhập</StyledTableCell>
              <StyledTableCell align="right">Thành tiền</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.details.map((detail) => (
              <StyledTableRow key={detail.product_id}>
                <StyledTableCell component="th" scope="row">
                  {detail.product_code}
                </StyledTableCell>
                <StyledTableCell>{detail.name}</StyledTableCell>
                {/* <TableCell>{detail.bar_code}</TableCell> */}
                <StyledTableCell align="right">
                  <div>
                    {detail.quantity}
                    <div>
                      {detail.batches
                        ? JSON.parse(detail.batches).map((batch) => (
                            <Chip
                              size="small"
                              label={`${
                                batch?.batch_code ? batch?.batch_code : "Mới"
                              }(${
                                batch?.expiry_date
                                  ? batch?.expiry_date.substring(0, 10)
                                  : ""
                              })-${batch.additional_quantity}`}
                              key={batch.id}
                              color={batch.is_new ? "primary" : "secondary"}
                              variant="outlined"
                            />
                          ))
                        : null}
                    </div>
                  </div>
                </StyledTableCell>

                <StyledTableCell align="right">
                  <div>
                    {detail.returned_quantity}
                    <div>
                      {detail.batches
                        ? JSON.parse(detail.batches).map((batch) => (
                            <Chip
                              size="small"
                              label={`${
                                batch?.batch_code ? batch?.batch_code : "Mới"
                              }(${
                                batch?.expiry_date
                                  ? batch?.expiry_date.substring(0, 10)
                                  : ""
                              })-${batch.returned_quantity}`}
                              key={batch.id}
                              color={batch.is_new ? "primary" : "secondary"}
                              variant="outlined"
                            />
                          ))
                        : null}
                    </div>
                  </div>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <VNDFormat value={detail.unit_price} />
                </StyledTableCell>
                <StyledTableCell align="right" style={{ fontWeight: 700 }}>
                  <VNDFormat
                    value={Number(detail.quantity) * Number(detail.unit_price)}
                  />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        <Grid container direction="column" sx={{ mt: 5 }}>
          <Grid
            container
            direction="row"
            justifyContent={"flex-end"}
            sx={{ mb: 1 }}
          >
            <Grid item md={2}>
              <Grid container justifyContent="flex-end">
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: 1,
                    //color: "#878787",
                  }}
                >
                  TIỀN HÀNG
                </Box>
              </Grid>
            </Grid>
            <Grid item md={2.5}>
              <Grid container justifyContent="flex-end">
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    //color: "#878787",
                  }}
                >
                  <VNDFormat value={order.total_amount} />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent={"flex-end"}
            sx={{ mb: 1 }}
          >
            <Grid item md={2}>
              <Grid container justifyContent="flex-end">
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: 1,
                    //color: "#878787",
                  }}
                >
                  GIẢM GIÁ
                </Box>
              </Grid>
            </Grid>
            <Grid item md={2.5}>
              <Grid container justifyContent="flex-end">
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    //color: "#878787",
                  }}
                >
                  <VNDFormat value={order.discount} />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid container justifyContent="flex-end">
            <Divider sx={{ width: 410, mb: 1 }}></Divider>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent={"flex-end"}
            sx={{ mb: 1 }}
          >
            <Grid item md={2}>
              <Grid container justifyContent="flex-end">
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: 1,
                    //color: "#878787",
                  }}
                >
                  TỔNG TIỀN HOÁ ĐƠN
                </Box>
              </Grid>
            </Grid>
            <Grid item md={2.5}>
              <Grid container justifyContent="flex-end">
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    //color: "#878787",
                  }}
                >
                  <VNDFormat value={row.total_amount - row.discount} />
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent={"flex-end"}
            sx={{ mb: 1 }}
          >
            <Grid item md={2}>
              <Grid container justifyContent="flex-end">
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: 1,
                    //color: "#878787",
                  }}
                >
                  KHÁCH ĐÃ TRẢ
                </Box>
              </Grid>
            </Grid>
            <Grid item md={2.5}>
              <Grid container justifyContent="flex-end">
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    //color: "#878787",
                  }}
                >
                  <VNDFormat value={row.paid_amount} />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          // justifyContent="flex-end"
          justifyContent={"flex-end"}
          style={{ marginTop: 20 }}
        >
          {/* Chỉ có nhân viên thực hiện nhập đơn đó  mới có thể xoá sửa */}
          {/* {currentUser === row.employee ? (
            <>
              {" "}
              <Button
                variant="contained"
                size="small"
                style={{ marginLeft: 15 }}
              >
                Sửa
              </Button>
              <Button
                variant="contained"
                size="small"
                style={{ marginLeft: 15 }}
              >
                Xoá
              </Button>{" "}
            </>
          ) : null} */}

          {info.user.uuid?.includes(order?.created_by_user.uuid) ||
          info.role?.includes("owner") ? (
            <Button
              variant="contained"
              size="small"
              // disabled={Number(row.total_amount) - Number(row.discount) - Number(row.paid_amount) > 0}
              style={{ marginLeft: 15 }}
              onClick={handleDelete}
            >
              Xóa hóa đơn
            </Button>
          ) : null}

          {returnLimit.status === false ||
          (returnLimit.status === true &&
            getDifferenceInDays(new Date(), new Date(row.creation_date)) <
              returnLimit.day) ? (
            <Button
              variant="contained"
              size="small"
              disabled={
                Number(row.total_amount) -
                  Number(row.discount) -
                  Number(row.paid_amount) >
                0
              }
              style={{ marginLeft: 15 }}
              onClick={handleClickOpen}
            >
              Trả hàng
            </Button>
          ) : null}
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginLeft: 15 }}
            startIcon={<PrintTwoToneIcon fontSize="small" />}
            onClick={() => handlePrint()}
          >
            In hoá đơn
          </Button>

          {/* <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
            size="small"
            style={{ marginLeft: 10 }}
          >
            <MoreVertIcon />
          </IconButton> */}

          {/* <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <StyledMenuItem onClick={() => handlePrint()}>
              <ListItemIcon style={{ marginRight: -15 }}>
                <PrintTwoToneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="In hoá đơn" />
            </StyledMenuItem>

            <StyledMenuItem>
              <ListItemIcon style={{ marginRight: -15 }}>
                <GetAppTwoToneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Xuất excel" />
            </StyledMenuItem>
          </StyledMenu> */}
        </Grid>
      </Box>
      {/* 
      <Dialog fullWidth maxWidth="lg" open={open} onClose={handleCloseReturn} aria-labelledby="form-dialog-title">
        <InvoiceReturnPopUp handleCloseReturn={handleCloseReturn} order={order} classes={classes} /> */}

      {/* 3. Receipt */}
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <ReceiptPrinter
            cart={order}
            date={row.creation_date
              ?.split(" ")[0]
              .split("-")
              .reverse()
              .join("/")}
            code={row.order_code}
            type={type}
          />
        </div>
      </div>

      {/* Tra hang */}

      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        onClose={handleCloseReturn}
        aria-labelledby="form-dialog-title"
      >
        <InvoiceReturnPopUp
          handleCloseReturn={handleCloseReturn}
          order={order}
          classes={classes}
          reloadDetail={() => setReload(!reload)}
          reload={onReload}
        />
      </Dialog>
    </Collapse>
  );
}

export default InvoiceDetail;
