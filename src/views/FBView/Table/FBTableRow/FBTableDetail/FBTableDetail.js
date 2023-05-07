import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { statusAction } from "../../../../../store/slice/statusSlice";
import {
    Button,
    TextField,
    Typography,
    Grid,
    Box,
    Divider,
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
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from "@material-ui/core";
import ConfirmPopUp from "../../../../../components/ConfirmPopUp/ConfirmPopUp";
import fbTableApi from "../../../../../api/fbTableApi";

import UpdateTable from "./UpdateTable";

const FBTableDetail = (props) => {
    const {
        row,
        openRow,
        setReload,
        handleSetReloadTableGroupEditor
    } = props;

    const dispatch = useDispatch(); 
    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch_uuid = info.branch.uuid;
    const [openTableUpdate, setOpenTableUpdate] = useState(false);
    const [openDeleteTableConfirm, setOpenDeleteTableConfirm] = useState(false);



    const handleDeleteTable = async () => {
        try{
            const response = await fbTableApi.deleteTable(store_uuid, branch_uuid, row.uuid);
            if(response.message = "Success"){
                dispatch(statusAction.successfulStatus("Xóa bàn thành công"));
                setReload();
                handleCloseTableUpdate();
            }
            else if(response.error){
                dispatch(statusAction.failedStatus(response.message.error));
            }
        }catch(e){
            dispatch(statusAction.failedStatus("Xóa bàn thất bại, check console"));
            console.log(e);
        }    
    }

    const handleOpenTableUpdate = () => {
        setOpenTableUpdate(true);
    }

    const handleCloseTableUpdate = () => {
        setOpenTableUpdate(false);
    }
    return (
        <Collapse
            in={row.uuid === openRow}
        >
            {openTableUpdate && <UpdateTable
                table = {row}
                openTableUpdate = {openTableUpdate}
                handleCloseTableUpdate = {handleCloseTableUpdate}
                setReload={setReload}
                handleSetReloadTableGroupEditor = {handleSetReloadTableGroupEditor}
            />}

            {openDeleteTableConfirm && <ConfirmPopUp
                open ={openDeleteTableConfirm}
                handleClose = {()=>{
                    setOpenDeleteTableConfirm(false)
                }}
                handleConfirm = {handleDeleteTable}
                message ={
                    <Typography>
                        Xóa vĩnh viễn bàn ?
                    </Typography>
                }
            />}
            <Box margin={1}>
                <Typography
                    variant="h3"
                    gutterBottom
                    component="div"
                //   className={classes.typo}
                >

                    Tên bàn :  {row.name}
                </Typography>

                <Grid container direction="row" justifyContent="flex-start">
                    <Grid container direction='column' item xs={12} sm={6}>
                        <Grid container direction="row" justifyContent="flex-start">
                            <Grid item xs={7} sm={6}>
                                <Typography variant="h5" gutterBottom component="div">
                                    Nhóm bàn
                                </Typography>

                            </Grid>

                            <Grid item sm={3}>
                                <Typography variant="body1" gutterBottom component="div">
                                    {row.table_group_name}{" "}
                                </Typography>

                            </Grid>

                        </Grid>
                        <Divider sx={{ marginBottom: "2px", width: '70%' }} />

                        <Grid container direction="row" justifyContent="flex-start">
                            <Grid item xs={7} sm={6}>
                                <Typography variant="h5" gutterBottom component="div">
                                    Tên bàn: {" "}
                                </Typography>

                            </Grid>
                            <Grid item sm={3}>
                                <Typography variant="body1" gutterBottom component="div">
                                    {row.name}{" "}
                                </Typography>


                            </Grid>
                        </Grid>
                        <Divider sx={{ marginBottom: "2px", width: '70%' }} />

                        <Grid container direction="row" justifyContent="flex-start">
                            <Grid item xs={7} sm={6}>
                                <Typography variant="h5" gutterBottom component="div">
                                    Số ghế
                                </Typography>
                            </Grid>
                            <Grid item sm={3}>
                                <Typography variant="body1" gutterBottom component="div">
                                    {row.seats}{" "}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ marginBottom: "2px", width: '70%' }} />

                        <Grid container direction="row" justifyContent="flex-start">
                            <Grid item xs={7} sm={6}>
                                <Typography variant="h5" gutterBottom component="div">
                                    Mô tả:
                                </Typography>
                            </Grid>
                            <Grid item sm={3}>
                                <Typography variant="body1" gutterBottom component="div">
                                    {row.description}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider sx={{ marginBottom: "2px", width: '70%' }} />


                        <Grid container direction="row" justifyContent="flex-start">
                            <Grid item xs={7} sm={6}>
                                <Typography variant="h5" gutterBottom component="div">
                                    Trạng thái:
                                </Typography>
                            </Grid>
                            <Grid item sm={3}>
                                <Typography variant="body1" gutterBottom component="div">
                                    {row.status === 'empty' ? 'Trống' : row.status === 'occupied' ? "Đang sử dụng" : "Đã được đặt"}
                                </Typography>
                            </Grid>
                        </Grid>


                                    </Grid>

                    <Grid container direction="column" item xs={12} sm={6}>


                    </Grid>
                </Grid>
                {/* Button */}
                <Grid
                    container
                    direction="row"
                    justifyContent={"flex-end"}
                    style={{ marginTop: 20 }}
                >
                    <Button 
                        color="primary" 
                        variant="contained" 
                        size="small" style={{ marginLeft: 15 }}
                        onClick = {handleOpenTableUpdate}
                    >
                        Sửa
                    </Button>
                    <Button
                        variant="contained"
                        color='secondary'
                        size="small"
                        style={{ marginLeft: 15 }}
                        onClick={() => {
                            setOpenDeleteTableConfirm(true);
                        }}
                    // startIcon={<DeleteIcon />}
                    //sx={{ color: 'warning.main' }}

                    >
                        Xóa
                    </Button>

                </Grid>
            </Box>
        </Collapse>
    )
}



export default FBTableDetail