import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
//import library

import CategoryIcon from "@material-ui/icons/Category";
import fbTableApi from "../../../../../api/fbTableApi";
import { statusAction } from "../../../../../store/slice/statusSlice";
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
import { useFormik } from "formik";
import * as Yup from "yup";
import AddTableGroup from "../../../../../components/TableGroup/AddTableGroup";
import TableGroupSelect from "../../../../../components/TableGroup/TableGroupSelect";


const UpdateTable = (props) => {

    const {
        table,
        openTableUpdate, 
        handleCloseTableUpdate,
        setReload,
        handleSetReloadTableGroupEditor
    } = props;

    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch_uuid = info.branch.uuid;
    const dispatch = useDispatch();
    const [reloadTableGroup, setReloadTableGroup] = useState(false); // reloadTableGroup sẽ load lại TableGroupSelect, setReload khi add 1 tablegroup
    const [openAddTableGroupDialog, setOpenAddTableGroupDialog] = useState(false);
  
   
  
    const handleSetReloadTableGroup = () => {
      setReloadTableGroup(!reloadTableGroup);
    }
  
    const handleCloseAddTableGroupDialog = () => {
      setOpenAddTableGroupDialog(false);
    };
    const handleOpenAddTableGroupDialog = () => {
      setOpenAddTableGroupDialog(true);
    };

    const tableFormik = useFormik({
        initialValues: {
          name: table.name,
          seats: table.seats,
          description: table.description,
          table_group_name : table.table_group_name
        },
        validationSchema: Yup.object({
          name: Yup.string().required("Nhập tên bàn"),
          seats: Yup.number().required("Nhập số ghế"),
        }),
      });
    
    const handleUpdateTable = async () => {
        try{
            const response = await fbTableApi.updateTable(store_uuid, branch_uuid, table.uuid, tableFormik.values);
            if(response.message = "Success"){
                dispatch(statusAction.successfulStatus("Cập nhật bàn thành công"));
                setReload();
                handleCloseTableUpdate();
            }
            else if(response.error){
                dispatch(statusAction.failedStatus(response.message.error));
            }
        }catch(e){
            dispatch(statusAction.failedStatus("Cập nhật bàn thất bại, check console"));
            console.log(e);
        }
    }





  return (
    <Dialog
        open = {openTableUpdate}
        onClose = { handleCloseTableUpdate}    
    >
        <DialogTitle>
        <   Typography variant="h3">Cập nhật nhóm bàn</Typography>
        </DialogTitle>

        <DialogContent>
            <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Tên bàn"
            type="text"
            fullWidth
            required
            value={tableFormik.values.name}
            onChange={tableFormik.handleChange}
            />
            <TextField
            autoFocus
            margin="dense"
            id="seats"
            label="Số ghế"
            type="number"
            fullWidth
            required
            value={tableFormik.values.seats}
            onChange={tableFormik.handleChange}
            />
            <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Mô tả"
            type="text"
            fullWidth
            value={tableFormik.values.description}
            onChange={tableFormik.handleChange}
            />


            <TableGroupSelect
                tableFormik = {tableFormik}
                handleOpenAddTableGroupDialog = {handleOpenAddTableGroupDialog}
                reloadTableGroup = {reloadTableGroup}
            />
        </DialogContent>

        <DialogActions>
            <Button
            color="primary"
            variant="contained"
            size="small"
            onClick = {handleUpdateTable}
            //disabled = {tableFormik.values.name === table.name && tableFormik.values.seats === table.seats && tableFormik.values.description === table.description && tableFormik.values.table_group_name === table.table_group_name}
            >
                Cập nhật
            </Button>


            <Button
            color="secondary"
            variant="contained"
            size="small"
            onClick = {handleCloseTableUpdate}

            >
            Hủy
            </Button>

      </DialogActions>

      <AddTableGroup
        openAddTableGroupDialog = {openAddTableGroupDialog}
        handleCloseAddTableGroupDialog = {handleCloseAddTableGroupDialog}
        handleSetReloadTableGroup = {handleSetReloadTableGroup}
        handleSetReloadTableGroupEditor = {handleSetReloadTableGroupEditor}
        
      />
    </Dialog>
  )
}

UpdateTable.propTypes = {}

export default UpdateTable