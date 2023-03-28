import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
//import library
import { trackPromise } from "react-promise-tracker";
import { styled } from "@mui/material/styles";

import { statusAction } from "../../store/slice/statusSlice";

import {
  Button,
  TextField,
  Typography,
  Grid,
  Box,
  InputAdornment,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Dialog,
  FormControlLabel,
  Switch,
  Collapse,
  Paper,
  Card,
  CardHeader,
  Checkbox,
  ListItem,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
} from "@material-ui/core";


import { VNDFormat,ThousandFormat } from "../TextField/NumberFormatCustom";

import TableHeader from "../TableCommon/TableHeader/TableHeader";
import TableWrapper from "../TableCommon/TableWrapper/TableWrapper";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";


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


const UOMPopup = (props) =>{
    const dispatch = useDispatch();
    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch_uuid = info.branch.uuid;


    const {
        openUOMPopup,
        handleCloseUOMPopup,
        //UOMList,
        product
    } = props; 

    return (
        <Dialog open={openUOMPopup} onClose = {handleCloseUOMPopup}>
          <DialogTitle id="alert-dialog-title">
            <Grid
              container
              direction="row"
              justifyContent="space-between"
            >
              <Typography variant="h3">Bảng quy đổi nguyên liệu</Typography>
              {/* <Tooltip
                title = 'Thêm nhóm bàn'
              >
                <IconButton
                  onClick = {handleOpenAddTableGroupDialog}
                  size = "small"
                >
                    <AddIcon/>
                </IconButton>
    
              </Tooltip> */}
            </Grid>
          </DialogTitle>
          <DialogContent
            style={{  minHeight: "50vh", maxHeight: "80vh", overflowY: "auto" }}
          >
            
            <Table
                size="small"
                aria-label="purchases"
                sx={{
                  borderBottom: 0,
                  marginTop: "20px",
                  marginRight: "10px",
                  marginLeft: "0px",
                }}
            >
            <TableHead sx={{ borderBottom: 0 }}>
              <TableRow sx={{ borderBottom: 0 }}>
                <StyledTableCell>Mã đơn vị</StyledTableCell>
                <StyledTableCell>Tên đơn vị</StyledTableCell>
                <StyledTableCell>Giá trị quy đổi</StyledTableCell>
                <StyledTableCell>Tổng số lượng hiện tại</StyledTableCell>
                <StyledTableCell>Đơn giá quy đổi</StyledTableCell>
                
                
              </TableRow>
            </TableHead>

            <TableBody>
                {product.unit_of_measurement_categories && product.unit_of_measurement_categories[0]?.unit_of_measurements?.map((uom,index) => (
                    <StyledTableRow key = {index}>
                        <StyledTableCell component="th" scope="row">
                            {"SP001"}
                        </StyledTableCell>

                        <StyledTableCell component="th" scope="row">
                            {uom.name}
                        </StyledTableCell>

                        <StyledTableCell component="th" scope="row">
                            {uom.quantity}
                        </StyledTableCell>

                        <StyledTableCell component="th" scope="row">
                           
                            <ThousandFormat
                                value = {Number(product.branch_quantity * uom.quantity)}
                            />
                            
                        </StyledTableCell>

                        <StyledTableCell component="th" scope="row">
                            {<VNDFormat
                            
                                value = {Number(product.standard_price* 1/uom.quantity)}
                            />}


                            
                        </StyledTableCell>

                    </StyledTableRow>
                ))}
            </TableBody>

            </Table>
            
    
    
          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              variant="contained"
              size="small"
              onClick = {handleCloseUOMPopup}
    
            >
              Hủy
            </Button>
    
          </DialogActions>
    
    
        </Dialog>
    )
}

export default UOMPopup; 