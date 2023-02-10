import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
//import library
import AddTableGroup from "../../../../components/TableGroup/AddTableGroup";

import TableGroupSelect from "../../../../components/TableGroup/TableGroupSelect";

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
import {Select, TreeSelect} from 'antd';

import AddIcon from "@material-ui/icons/Add";
import { useFormik } from "formik";
import * as Yup from "yup";
import fbTableApi from "../../../../api/fbTableApi";
import { statusAction } from "../../../../store/slice/statusSlice";
import { Icon } from "@mui/material";
const AddTable = (props) => {
  const { 
    openAddTableDialog, 
    handleCloseAddTableDialog,
    setReload,
    reloadTableGroupEditor,
    setReloadTableGroupEditor
   } = props;

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

  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const tableFormik = useFormik({
    initialValues: {
      name: "",
      seats: 0,
      description: "",
      table_group_name : "Nhóm bàn chung"
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nhập tên bàn"),
      seats: Yup.number().required("Nhập số ghế"),
    }),
  });

  const dispatch = useDispatch();
  const handleAddTable = async () => {
    handleCloseAndResetTableDialog();
    try {
      const response = await fbTableApi.createTable(
        store_uuid,
        branch_uuid,
        tableFormik.values
      );
      if(response.message === 'Success'){
        dispatch(statusAction.successfulStatus("Tạo bàn thành công"));
      }else{
        dispatch(statusAction.failedStatus("Tạo bàn thất bại"));
      }

      //console.log(response);
      setReload();
      //dispatch(statusAction.successfulStatus("Tạo bàn thành công"));
    } catch (error) {
      console.log(error);
      dispatch(statusAction.failedStatus("Tạo bàn thất bại"));
    }
  };

  useEffect(() => {
    console.log("table" + JSON.stringify(tableFormik.values));
  }, [tableFormik.values]);

  const handleCloseAndResetTableDialog = () => {
    handleCloseAddTableDialog();
    tableFormik.resetForm();
  };
  return (
    <Dialog open={openAddTableDialog} onClose={handleCloseAddTableDialog}>
      <DialogTitle id="alert-dialog-title">
        <Typography variant="h3">Thêm bàn</Typography>
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
          color="secondary"
          variant="contained"
          size="small"
          onClick={handleCloseAddTableDialog}
        >
          Hủy
        </Button>
        <Button
          color="primary"
          variant="contained"
          size="small"
          onClick={handleAddTable}
          disabled = {tableFormik.values.seats === 0 || tableFormik.values.name === '' }
        >
          Thêm
        </Button>
      </DialogActions>

      <AddTableGroup
        openAddTableGroupDialog = {openAddTableGroupDialog}
        handleCloseAddTableGroupDialog = {handleCloseAddTableGroupDialog}
        handleSetReloadTableGroup = {handleSetReloadTableGroup}
        handleSetReloadTableGroupEditor = {() => setReloadTableGroupEditor(!reloadTableGroupEditor)}
        
      />
    </Dialog>
  );
};

export default AddTable;
