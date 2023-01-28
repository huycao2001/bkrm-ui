import React, { useEffect } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

//import library
import {
  //Tooltip,
  //Chip,
  Dialog,
  Card,
  DialogContent,
  //Box,
  //Grid,
  //TableHead,
  //TableBody,
  //Typography,
  //Table,
  //TableCell,
  //TableRow,
  //Collapse,
  Button,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@material-ui/core";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
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
import {
  ThousandFormat,
  VNDFormat,
} from "../../../../../components/TextField/NumberFormatCustom";

import { grey } from "@material-ui/core/colors";

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

const CheckHistoryDetail = (props) => {
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

  //calculate
  const moneyDif = row.details
    ?.map((detail) => detail.quantity * detail.unit_price)
    .reduce((total, ele) => total + ele, 0);

  return (
    // <Collapse in={ openRow === row.id } timeout="auto" unmountOnExit>
    <Collapse
      in={isMini ? true : openRow === row.uuid}
      timeout="auto"
      unmountOnExit
    >
      <Box margin={5}>
        {/* <Typography
          variant="h3"
          gutterBottom
          component="div"
          className={classes.typo}
        >
          {row.product_name}
        </Typography> */}
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
                  MÃ ĐƠN KIỂM
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {row.inventory_check_code}{" "}
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
                  NGÀY KIỂM
                </Box>
              </Grid>
              <Grid item>
                <Box
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    //color: "#2196f3",
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
                  {row.branch_name}
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
                  {row.user_name}
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* <Typography
          variant="h4"
          gutterBottom
          component="div"
          style={{ marginTop: 30 }}
        >
          Danh sách sản phẩm
        </Typography> */}
        <Table size="small" aria-label="purchases" sx={{ borderBottom: 0 }}>
          <TableHead sx={{ borderBottom: 0 }}>
            <TableRow sx={{ borderBottom: 0 }}>
              <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>Sản phẩm</StyledTableCell>
              {/* <TableCell>Mã vạch</TableCell> */}
              <StyledTableCell align="right">Tồn kho</StyledTableCell>
              <StyledTableCell align="right">SL thực tế</StyledTableCell>
              <StyledTableCell align="right">Lệch</StyledTableCell>
              <StyledTableCell align="right">Giá trị</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {row.details?.map((detail) => (
              <TableRow key={detail.product_id}>
                <TableCell component="th" scope="row">
                  {detail.product_code}
                </TableCell>
                <StyledTableCell>{detail.product_name}</StyledTableCell>
                <StyledTableCell align="right">
                  <ThousandFormat value={detail.branch_inventory} />

                  <div>
                    {JSON.parse(detail.batches)
                      ?.filter((batch) => batch.is_checked)
                      .map((checked_batch) => (
                        <div>
                          <Tooltip
                            title={`${
                              checked_batch.position
                                ? checked_batch.position
                                : ""
                            }-${
                              checked_batch.expiry_date
                                ? checked_batch.expiry_date
                                : ""
                            }`}
                          >
                            <Chip
                              label={`${checked_batch.batch_code}-${checked_batch.quantity}`}
                              size="small"
                            ></Chip>
                          </Tooltip>
                        </div>
                      ))}
                  </div>
                </StyledTableCell>
                <StyledTableCell align="right">
                  <ThousandFormat
                    value={
                      Number(detail.branch_inventory) + Number(detail.quantity)
                    }
                  />
                  <div>
                    {JSON.parse(detail.batches)
                      ?.filter((batch) => batch.is_checked)
                      .map((checked_batch) => (
                        <div>
                          <Tooltip
                            title={`${
                              checked_batch.position
                                ? checked_batch.position
                                : ""
                            }-${
                              checked_batch.expiry_date
                                ? checked_batch.expiry_date
                                : ""
                            }`}
                          >
                            <Chip
                              size="small"
                              label={`${checked_batch.batch_code}-${checked_batch.checked_quantity}`}
                            ></Chip>
                          </Tooltip>
                        </div>
                      ))}
                  </div>
                </StyledTableCell>
                <StyledTableCell align="right" style={{ fontWeight: 700 }}>
                  <ThousandFormat value={detail.quantity} />
                </StyledTableCell>
                <StyledTableCell align="right" style={{ fontWeight: 700 }}>
                  <VNDFormat value={detail.quantity * detail.unit_price} />
                </StyledTableCell>
              </TableRow>
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
                  TỔNG SL LỆCH
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
                  <ThousandFormat
                    value={row.details
                      ?.map((detail) => detail.quantity)
                      .reduce((total, ele) => total + ele, 0)}
                  />
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
                  TỔNG TIỀN LỆCH
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
                  <VNDFormat
                    style={{
                      fontWeight: 700,
                      color: moneyDif > 0 ? "green" : "red",
                    }}
                    value={moneyDif}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* <Grid
            container
            direction="row"
            justifyContent={"flex-end"}
            style={{ marginTop: 20 }}
          >
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
                  <PrintTwoToneIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="In đơn nhập" />
              </StyledMenuItem>

              <StyledMenuItem>
                <ListItemIcon style={{ marginRight: -15 }}>
                  <GetAppTwoToneIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Xuất excel" />
              </StyledMenuItem>
            </StyledMenu>
          </Grid> */}
      </Box>
    </Collapse>
  );
};

export default CheckHistoryDetail;

const headCells = [
  { id: "stt", numeric: false, disablePadding: true, label: "Stt" },
  { id: "id", numeric: false, disablePadding: true, label: "#" },
  { id: "name", numeric: false, disablePadding: true, label: "Tên" },
  { id: "price", numeric: true, disablePadding: true, label: "Đơn giá" },
  { id: "quantity", numeric: true, disablePadding: true, label: "Số lượng" },
  { id: "protein1", numeric: true, disablePadding: true, label: "Thành tiền" },
];
