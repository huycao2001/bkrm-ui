import React, { useRef, useEffect, useState } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import { useReactToPrint } from "react-to-print";
import { ImportReceiptPrinter } from "../../../../../components/ReceiptPrinter/ReceiptPrinter";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { calculateTotalQuantity } from "../../../../../components/TableCommon/util/sortUtil";

//import library
import {
  Dialog,
  Tooltip,
  Chip,
  Card,
  DialogContent,
  Box,
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
//import icon
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PrintTwoToneIcon from "@material-ui/icons/PrintTwoTone";
import GetAppTwoToneIcon from "@material-ui/icons/GetAppTwoTone";

//import project
import {
  StyledMenu,
  StyledMenuItem,
} from "../../../../../components/Button/MenuButton";
import InventoryReturnPopUp from "../../../../../components/PopUpReturn/InventoryReturnPopUp/InventoryReturnPopUp";

import { grey } from "@material-ui/core/colors";

// api
import purchaseOrderApi from "../../../../../api/purchaseOrderApi";
import { useSelector, useDispatch } from "react-redux";
import { VNDFormat } from "../../../../../components/TextField/NumberFormatCustom";
import PayRemaining from "../../../../../components/Modal/PayRemaining";
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
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
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

const InventoryOrderDetail = (props) => {
  const { row, openRow, onReload } = props.parentProps;
  const { isMini } = props;
  //  tam thoi

  const currentUser = "Minh Tri";
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const dispatch = useDispatch();

  const theme = useTheme();
  const classes = useStyles(theme);
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));

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
      const res = purchaseOrderApi.deletePurchaseOrder(
        store_uuid,
        branch_uuid,
        row.uuid
      );
      dispatch(statusAction.successfulStatus("Xóa đơn nhập thành công"));
      onReload();
    } catch (err) {
      dispatch(statusAction.failedStatus("Xóa đơn nhập thất bại"));
      console.log(err);
    }
  };

  const [purchaseOrder, setPurchaseOrder] = useState({
    branch: null,
    details: [],
  });

  const [reload, setReload] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await purchaseOrderApi.getPurchaseOrder(
          store_uuid,
          row.uuid
        );
        setPurchaseOrder(res.data);
      } catch (error) {
        setPurchaseOrder({
          branch: null,
          details: [],
        });
      }
    };
    if (openRow === row.uuid) {
      loadData();
    }
  }, [props.parentProps.openRow, reload]);

  useEffect(() => {}, [purchaseOrder]);
  const debtAmount =
    Number(row.total_amount) - Number(row.discount) - Number(row.paid_amount);
  const [openPayRemaining, setOpenPayRemaining] = useState(false);
  const editInventoryOrderApiCall = async (
    store_uuid,
    branch_uuid,
    uuid,
    body
  ) => {
    return purchaseOrderApi.editPurchaseOrder(
      store_uuid,
      branch_uuid,
      uuid,
      body
    );
  };

  //print

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Collapse
      in={isMini ? true : openRow === row.uuid}
      timeout="auto"
      unmountOnExit
    >
      <PayRemaining
        reloadDetail={() => setReload(!reload)}
        onReload={props.parentProps.onReload}
        uuid={row.uuid}
        debt={debtAmount}
        paid={Number(row.paid_amount)}
        title={
          <Typography variant="h4">
            Trả nợ đơn nhập hàng <i>{row.purchase_order_code}</i>
          </Typography>
        }
        open={openPayRemaining}
        handleClose={() => setOpenPayRemaining(false)}
        editApiCall={editInventoryOrderApiCall}
      />
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
                  MÃ ĐƠN NHẬP
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {row.purchase_order_code}
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
                  NGƯỜI NHẬP
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
                  {purchaseOrder.created_by_user
                    ? purchaseOrder.created_by_user.name
                    : ""}{" "}
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
                  {purchaseOrder.branch ? purchaseOrder.branch.name : ""}
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
                  NGÀY NHẬP
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
                  NHÀ CUNG CẤP
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
                  {row.supplier_name}
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
                  TỔNG TIỀN NHẬP
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
            {purchaseOrder.details.map((detail) => (
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
                  <VNDFormat value={purchaseOrder.total_amount} />
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
                  <VNDFormat value={purchaseOrder.discount} />
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
                  TỔNG TIỀN NHẬP
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
        </Grid>
      </Box>
      {/* <Collapse in={ true } timeout="auto" unmountOnExit> */}
    </Collapse>
  );
};

export default InventoryOrderDetail;

const headCells = [
  { id: "stt", numeric: false, disablePadding: true, label: "Stt" },
  { id: "id", numeric: false, disablePadding: true, label: "#" },
  { id: "name", numeric: false, disablePadding: true, label: "Tên" },
  { id: "price", numeric: true, disablePadding: true, label: "Đơn giá" },
  { id: "quantity", numeric: true, disablePadding: true, label: "Số lượng" },
  { id: "protein1", numeric: true, disablePadding: true, label: "Thành tiền" },
];
