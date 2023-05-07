import React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import useRowStyles from "../../../../components/TableCommon/style/rowStyle";
import clsx from "clsx";
import { grey } from "@material-ui/core/colors";

import {
    //TableCell,
    //TableRow,
    Box,
    Avatar,
    ListItem,
    Typography,
    Chip,
    Tooltip,
} from "@material-ui/core";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";

// import Tooltip from '@mui/material/Tooltip';

//import InventoryDetail from "./InventoryDetail/InventoryDetail";
import { FormatedProductStatus } from "../../../../components/TableCommon/util/format";
import icon from "../../../../assets/img/product/img.jpeg";
import { VNDFormat } from "../../../../components/TextField/NumberFormatCustom";
import { useDispatch, useSelector } from "react-redux";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ProductMiniTableRow } from "../../../../components/MiniTableRow/MiniTableRow";
import defaultProduct from "../../../../assets/img/product/default-product.png";
import ReservationDetail from "./ReservationDetail/ReservationDetail";
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

function formatDateTime(dateString){
    //const dateString = "2023-03-02 11:05:00";
    const date = new Date(dateString);
    
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    
    let hours = date.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const time = hours.toString().padStart(2, "0") + ":" + minutes + ":" + seconds + " " + ampm;
    
    return  `${day}/${month}/${year} ${time}`;



}

const ReservationTableRow = (props) => {
    const {
        row,
        handleOpenRow,
        openRow,
        setReload,
        isManageInventory,
        hidenCollumn,
        colorText,
        handleSetReloadTableGroupEditor
    } = props;

    const classes = useRowStyles();

    // let imageList = row.img_urls ? JSON.parse(row.img_urls) : null;
    // imageList = imageList
    //   ? Array.isArray(imageList)
    //     ? imageList
    //     : [imageList]
    //   : null;
    return (
        <>
            <TableRow
                onClick={() => handleOpenRow(row.uuid)}
                className={clsx(
                    classes.row,
                    openRow === row.uuid ? classes.rowClicked : null
                )}
                key={row.uuid}
                style={{ color: colorText }}
            >
                <TableCell className={classes.cell} align="left" style={{ color: colorText }}>
                    {row.id}
                </TableCell>
                <TableCell className={classes.cell} align="left" style={{ color: colorText }}>
                    {formatDateTime(row.reservation_datetime)}
                </TableCell>
                <TableCell className={classes.cell} align="left" style={{ color: colorText }}>
                    {row.name}
                </TableCell>
                <TableCell className={classes.cell} align="left" style={{ color: colorText }}>
                    {row.phone}
                </TableCell>
                <TableCell className={classes.cell} align="left" style={{ color: colorText }}>
                    {row.number_of_guests}
                </TableCell>
                <TableCell className={classes.cell} align="left" style={{ color: colorText }}>
                    {row.table.name}
                </TableCell>
                <TableCell className={classes.cell} align="left" style={{ color: colorText }}>
                    {row.status == "active" ? "Đang mở" : row.status == "closed" ? "Hủy" : "Đã nhận bàn"}
                </TableCell>


            </TableRow>

            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}
                >
                    <ReservationDetail
                        row={row}
                        openRow={openRow}
                        setReload={setReload}
                        handleSetReloadTableGroupEditor={handleSetReloadTableGroupEditor}


                    />
                </TableCell>
            </TableRow>
        </>
    );
};

export default ReservationTableRow;
