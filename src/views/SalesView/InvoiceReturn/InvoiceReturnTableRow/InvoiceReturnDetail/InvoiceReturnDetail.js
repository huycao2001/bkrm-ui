import React, { useRef } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import { useReactToPrint } from "react-to-print";
import { ReceiptPrinter } from "../../../../../components/ReceiptPrinter/ReceiptPrinter";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  VNDFormat,
  ThousandFormat,
} from "../../../../../components/TextField/NumberFormatCustom";
import { calculateTotalQuantity } from "../../../../../components/TableCommon/util/sortUtil";

// import library
import {
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
  Chip,
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

// import project
import { grey } from "@material-ui/core/colors";
import {
  StyledMenu,
  StyledMenuItem,
} from "../../../../../components/Button/MenuButton";
import { useSelector } from "react-redux";
import refundApi from "../../../../../api/refundApi";
// dơn trả giá trả có khác ko ???

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
    background: {
      background:
        theme.customization.mode === "Light"
          ? theme.customization.primaryColor[50]
          : grey[700],
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

function InvoiceReturnDetail(props) {
  const { row, openRow } = props.parentProps;
  const { isMini } = props;

  //  tam thoi
  const currentUser = "Minh Tri";

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

  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;

  const [refund, setRefund] = React.useState({
    branch: null,
    details: [],
  });

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const res = await refundApi.getRefund(store_uuid, row.uuid);
        setRefund(res.data);
      } catch (error) {
        setRefund({
          branch: null,
          details: [],
        });
      }
    };
    if (openRow === row.uuid) {
      loadData();
    }
  }, [props.parentProps.openRow]);

  //print

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  console.log("refund", refund);

  return (
    <Collapse
      in={isMini ? true : openRow === row.uuid}
      timeout="auto"
      unmountOnExit
    >
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
                  MÃ ĐƠN TRẢ
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {row.refund_code}
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
                  {refund.order?.order_code}
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
                  NGƯỜI THỰC HIỆN
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
                  {refund.created_by_user?.name}
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
                  {refund.branch?.name}
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
                  NGÀY TRẢ
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
                  {row.created_at
                    ?.split(" ")[0]
                    .split("-")
                    .reverse()
                    .join("/")
                    .concat(
                      "\u00a0\u00a0" +
                        row.created_at?.split(" ")[1].substr(0, 5)
                    )}
                </Box>
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item md={4}>
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
          </Grid> */}
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
                  {refund.customer?.name}
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
                  TỔNG TIỀN TRẢ
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
                  <VNDFormat value={row.total_amount}></VNDFormat>{" "}
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
            {refund.details.map((detail) => (
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
                  TỔNG TIỀN TRẢ
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
                  <VNDFormat value={row.total_amount} />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          container
          direction="row"
          justifyContent={"flex-end"}
          style={{ marginTop: 20 }}
        >
          {/* Chỉ có nhân viên thực hiện nhập đơn đó  mới có thể xoá sửa */}
          {/* {currentUser === row.employee
            ? (
              <>
                {' '}
                <Button variant="contained" size="small" style={{ marginLeft: 15 }}>Sửa</Button>
                <Button variant="contained" size="small" style={{ marginLeft: 15 }}>Xoá</Button>
                {' '}

              </>
            )
            : null} */}

          {/* <IconButton
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
            <StyledMenuItem onClick={()=> handlePrint()}>
              <ListItemIcon style={{ marginRight: -15 }}>
                <PrintTwoToneIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="In đơn trả" />
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

      {/* 3. Receipt */}
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <ReceiptPrinter cart={refund} date={row.created_at} />
        </div>
      </div>
    </Collapse>
  );
}

export default InvoiceReturnDetail;
