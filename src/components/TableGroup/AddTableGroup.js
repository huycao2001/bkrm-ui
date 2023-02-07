import React, { useState, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { statusAction } from "../../store/slice/statusSlice";

import fbTableGroupApi from "../../api/fbTableGroup";

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

function AddTableGroup(props) {
    const {
        openAddTableGroupDialog,
        handleCloseAddTableGroupDialog,
        handleSetReloadTableGroup
    } = props;

    const dispatch = useDispatch();
    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch_uuid = info.branch.uuid;
    const [tableGroupName, setTableGroupName] = useState('');

    const handleAddTableGroup = async () => {
        try{
            const response = await fbTableGroupApi.createTableGroup(store_uuid, branch_uuid, {
                table_group_name : tableGroupName
            })
            
            if(response.message === 'Success'){
                dispatch(statusAction.successfulStatus("Tạo nhóm bàn thành công"));
                handleSetReloadTableGroup();
                
            }
            else if(response.error){
                dispatch(statusAction.failedStatus("Tên nhóm bàn đã được sử dụng"));
            }
            else{
                dispatch(statusAction.failedStatus("Tạo nhóm thất bại"));
            }
            handleCloseAddTableGroupDialog();
            console.log(response);
        }
        catch(e){
            dispatch(statusAction.failedStatus("Tạo nhóm thất bại"));
        }


    }
  return (
    <Dialog open={openAddTableGroupDialog} onClose={handleCloseAddTableGroupDialog}>
    <DialogTitle id="alert-dialog-title">
      <Typography variant="h3">Thêm nhóm bàn</Typography>
    </DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label="Tên nhóm bàn mới"
        type="text"
        fullWidth
        required
        onChange={(e) => {
            setTableGroupName(e.target.value);
        }}
 
      />

    </DialogContent>
    <DialogActions>
      <Button
        color="secondary"
        variant="contained"
        size="small"
        onClick ={handleCloseAddTableGroupDialog}

      >
        Hủy
      </Button>
      <Button
        color="primary"
        variant="contained"
        size="small"
        onClick = {handleAddTableGroup }
        disabled = {tableGroupName === ''}
      >
        Thêm
      </Button>
    </DialogActions>
  </Dialog>
  )
}


export default AddTableGroup
