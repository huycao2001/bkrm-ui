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
import FBTableDetail from "./FBTableDetail/FBTableDetail";
import defaultProduct from "../../../../assets/img/product/default-product.png";

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

const FBTableRow = (props) => {
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
          {row.name}
        </TableCell>
        {/* <TableCell className={classes.cell} align="left" style={{ color: colorText }}>
          {row.description ? row.description : 'Trống'}
        </TableCell> */}
        <TableCell className={classes.cell} align="left" style={{ color: colorText }}>
          {row.table_group_name}
        </TableCell>
        <TableCell className={classes.cell} align="left" style={{ color: colorText }}>
          {row.seats}
        </TableCell>
        <TableCell className={classes.cell} align="left" style={{ color: colorText }}>
          {row.status === 'empty' ? 'Trống' : row.status}
        </TableCell>
      
      
      </TableRow>

      <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}
          >
              <FBTableDetail
                row={row}
                openRow = {openRow}
                setReload ={setReload}
                handleSetReloadTableGroupEditor = {handleSetReloadTableGroupEditor}
                
              
              />
          </TableCell>
      </TableRow>
    </>
  );
};

export default FBTableRow;
