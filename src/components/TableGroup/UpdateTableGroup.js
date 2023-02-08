import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
//import library

import CategoryIcon from "@material-ui/icons/Category";
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

import fbTableGroupApi from "../../api/fbTableGroup";
import { statusAction } from "../../store/slice/statusSlice";

const UpdateTableGroup = (props) => {

    const {
        openTableGroupUpdate,
        handleCloseTableGroupUpdate,
        tableGroup,
        setReload,
        setReloadTableGroupEditor
    } = props; 

    const [newTableGroupName, setNewTableGroupName] = useState(tableGroup.name);
    const dispatch = useDispatch(); 
    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch_uuid = info.branch.uuid;


    const handleDelete =async () => {
        try{
            const response = await fbTableGroupApi.deleteTableGroup(store_uuid, branch_uuid, tableGroup.uuid );
    
            if(response.message === 'Success'){
                dispatch(statusAction.successfulStatus("Xóa nhóm bàn thành công"));
                handleCloseTableGroupUpdate();
                setReload();
                setReloadTableGroupEditor();
                
            }
            else if(response.error){
                dispatch(statusAction.failedStatus(response.error));
            }
        }catch(e){
            dispatch(statusAction.failedStatus("Lỗi khi xóa nhóm bàn : Check console"));
            console.log(e);
        }
    }

    const handleUpdate = async () => {
        try{
            const response = await fbTableGroupApi.updateTableGroup(store_uuid, branch_uuid, tableGroup.uuid,{
                table_group_name : newTableGroupName
            } );
    
            if(response.message === 'Success'){
                dispatch(statusAction.successfulStatus("Cập nhật phòng bàn thành công"));
                handleCloseTableGroupUpdate();
                setReload();
                setReloadTableGroupEditor();
                
            }
            else if(response.error){
                dispatch(statusAction.failedStatus(response.error));
            }
        }catch(e){
            dispatch(statusAction.failedStatus("Lỗi khi cập nhật nhóm bàn : Check console"));
            console.log(e);
        }
        
    } 
  return (
    <Dialog
        open = {openTableGroupUpdate}
        onClose = {handleCloseTableGroupUpdate}    
    >
        <DialogTitle>
        <   Typography variant="h3">Cập nhật nhóm bàn</Typography>
        </DialogTitle>

        <DialogContent>
            <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nhập tên mới"
            type="text"
            fullWidth
            required
            defaultvalue = {tableGroup.name}
            value = {newTableGroupName}
            onChange={(e) => {
                setNewTableGroupName(e.target.value);
            }}
    
            />
        </DialogContent>

        <DialogActions>
            <Button
            color="primary"
            variant="contained"
            size="small"
            onClick = {handleUpdate}
            disabled = {newTableGroupName === tableGroup.name}
            >
                Cập nhật
            </Button>

            <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={handleDelete}
            >
                Xóa
            </Button>

            <Button
            color="secondary"
            variant="contained"
            size="small"
            onClick = {handleCloseTableGroupUpdate}

            >
            Hủy
            </Button>

      </DialogActions>
    </Dialog>
  )
}

export default UpdateTableGroup