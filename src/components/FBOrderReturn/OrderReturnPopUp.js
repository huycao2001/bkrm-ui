import React, { useState, useEffect, useRef } from "react";
import { useTheme, makeStyles, styled } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";


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
    TableBody,
    TableRow,
    TableCell
  } from "@material-ui/core";

  import TableWrapper from "../TableCommon/TableWrapper/TableWrapper";
  import TableHeader from "../TableCommon/TableHeader/TableHeader";

  import orderApi from "../../api/orderApi";
  import { statusAction } from "../../store/slice/statusSlice";



  const useStyles = makeStyles((theme) => ({
    formControl: {
        marginRight: 10,
        minWidth: 220,
    },
    row: {
        margin: "15px 20px 10px 20px",
    }

}));


const DateTimeFormat = (dateString) => {
    const dateObj = new Date(dateString);
    const vietnamTime = dateObj.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });

    const day = ('0' + dateObj.getDate()).slice(-2);
    const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    const year = dateObj.getFullYear();
    const hours = ('0' + dateObj.getHours()).slice(-2);
    const minutes = ('0' + dateObj.getMinutes()).slice(-2);

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

    return formattedDate

}




const  OrderReturnPopUp= (props) => {

    const {
        openOrderReturnPopUp,
        handleCloseOrderReturnPopUp,
        fb_order_details,
        item,
        fb_order_uuid,
        loadProducts
    } = props
    const theme = useTheme();
    const classes = useStyles(theme);

    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch_uuid = info.branch.uuid;
    const dispatch = useDispatch();



    const filterProduct = () => {
        var targetList = fb_order_details.filter((fb_order_detail) => {
            return fb_order_detail.product_id === item.product_id
        });
    
        targetList = targetList.map(fb_order_detail => {
            return {
                ...fb_order_detail, 
                quantity_to_return : 0
            }
        })
    
        return targetList;
    }



    // use state
    const [removeFromFBOrder, setRemoveFromFBOrder] = useState(false);
    const [returnToInventory, setReturnToInventory] = useState(false);
    const [reason, setReason] = useState('Return item'); 
    const [FBOrderDetails, setFBOrderDetails] = useState(filterProduct());

    // handle 
    const handleChangeReturnQuantity = (fb_order_detail_uuid, newQuantity) => {
        var newFBOrderDetails = [...FBOrderDetails];
        var targetFBOrderDetail =  newFBOrderDetails.find(fb_order_detail => {
            return fb_order_detail.uuid == fb_order_detail_uuid;
        });

        targetFBOrderDetail.quantity_to_return = newQuantity; 
        setFBOrderDetails(newFBOrderDetails);
    }


    const handleReturnFBOrder = async () =>{
        var target_fb_order_details = []; 
        FBOrderDetails.map(fb_order_detail => {
            if(fb_order_detail.quantity_to_return > 0 ){
                target_fb_order_details = [
                    ...target_fb_order_details, 
                    {
                        uuid : fb_order_detail.uuid, 
                        quantity_to_return : fb_order_detail.quantity_to_return
                    }
                ]
            }
        })

        var body = {
            reason : reason, 
            remove_from_fb_order : removeFromFBOrder,
            return_to_inventory : returnToInventory,
            fb_order_details : target_fb_order_details
        }


        try{
            const response = await orderApi.returnFBOrder(store_uuid, branch_uuid, fb_order_uuid, body); 
            if(response.message == "success"){
                dispatch(statusAction.successfulStatus("Trả món thành công"));
                loadProducts();
                handleCloseOrderReturnPopUp();
                
            }else{
                dispatch(statusAction.successfulStatus("Trả món thất bại " + response.error));

            }
        }catch(e){
            console.log("Return FB order failed : " + e)
        }
    }

    return (
        <Dialog open={openOrderReturnPopUp} onClose={handleCloseOrderReturnPopUp}>
          <DialogTitle id="alert-dialog-title">
            <Typography variant="h3">Trả món</Typography>
          </DialogTitle>
          <DialogContent>
            {/* <TextField
              autoFocus
              margin="dense"
              label="Số lượng trả lại"
              type="number"
              fullWidth
              required
              value={returnQuantity}
              onChange={(e)=>{
                if(e.target.value < 0) return;
                setReturnQuantity(e.target.value)
              }}
            />

              <Grid container direction="column">
                <Tooltip title = "Chọn để vẫn tính tiền món ăn này">
                    <FormControlLabel
                        control={<Checkbox checked={removeFromFBOrder} onChange={() =>{
                            setRemoveFromFBOrder(!removeFromFBOrder)
                        }} />}
                        label="Không tính vào hóa đơn"
                    />
                </Tooltip>
                <Tooltip title = "Chọn để hoàn trả lại số lượng nguyên liệu ">
                    <FormControlLabel
                        control={<Checkbox checked={returnToInventory} onChange={() => {
                            setReturnToInventory(!returnToInventory)
                        }} />}
                        label="Cập nhật lại số lượng nguyên liệu"
                    />
                </Tooltip>
              </Grid> */}

              <TableWrapper isCart = {true} isUnitTable = {true}>
                <TableHeader
                        classes={classes}
                        headerData={OrderReturnHeadCells}
                />

                <TableBody>
                    {FBOrderDetails.map((fb_order_detail,index) =>{
                        return (
                            <TableRow key = {index}>
                                <TableCell align = "center">
                                    {fb_order_detail.product_name}
                                </TableCell>

                                <TableCell align = "center">
                                    {DateTimeFormat(fb_order_detail.created_at)}
                                </TableCell>

                                <TableCell align = "center">
                                    <TextField
                                        autoFocus
                                        margin="dense"
                                        type="number"
                                        fullWidth
                                        required
                                        value={fb_order_detail.quantity_to_return}
                                        onChange={(e)=>{
                                            if(e.target.value < 0) return;
                                            handleChangeReturnQuantity(fb_order_detail.uuid, e.target.value);
                                        }}
                                    />
                                </TableCell>

                                <TableCell align = "center">
                                    {fb_order_detail.prepared_quantity}
                                </TableCell>

                            </TableRow>
                        )
                    } )}
                </TableBody>
              </TableWrapper>

              <Tooltip title = "Chọn để vẫn tính tiền món ăn này">
                    <FormControlLabel
                        control={<Checkbox checked={removeFromFBOrder} onChange={() =>{
                            setRemoveFromFBOrder(!removeFromFBOrder)
                        }} />}
                        label="Không tính vào hóa đơn"
                    />
                </Tooltip>
                <Tooltip title = "Chọn để hoàn trả lại số lượng nguyên liệu ">
                    <FormControlLabel
                        control={<Checkbox checked={returnToInventory} onChange={() => {
                            setReturnToInventory(!returnToInventory)
                        }} />}
                        label="Cập nhật lại số lượng nguyên liệu"
                    />
                </Tooltip>

          </DialogContent>
          <DialogActions>
            <Button
              color="secondary"
              variant="contained"
              size="small"
              onClick={handleCloseOrderReturnPopUp}
            >
              Hủy
            </Button>
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={handleReturnFBOrder}
            //   disabled = {tableFormik.values.seats === 0 || tableFormik.values.name === '' }
            >
              Cập nhật
            </Button>
          </DialogActions>
    
          {/* <AddTableGroup
            openAddTableGroupDialog = {openAddTableGroupDialog}
            handleCloseAddTableGroupDialog = {handleCloseAddTableGroupDialog}
            handleSetReloadTableGroup = {handleSetReloadTableGroup}
            handleSetReloadTableGroupEditor = {() => setReloadTableGroupEditor(!reloadTableGroupEditor)}
            
          /> */}
        </Dialog>
      );
}


const OrderReturnHeadCells = [
    { id: 'name', align: 'center', disablePadding: true, label: 'Tên món' }, 
    { id: 'created_at', align: 'center', disablePadding: true, label: 'Giờ tạo' },
    { id: 'returnQuantity', align: 'center', disablePadding: true, label: 'Số lượng trả' },
    { id: 'canReturnQuantity', align: 'center', disablePadding: true, label: 'Tối đa' },




]


export default OrderReturnPopUp;
