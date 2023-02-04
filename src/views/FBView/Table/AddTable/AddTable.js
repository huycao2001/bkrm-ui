import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
//import library
import {
  Button,
  TextField,
  Typography,
  Grid,
  Box,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
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
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useFormik } from "formik";
import * as Yup from "yup";
import fbTableApi from "../../../../api/fbTableApi";
import { statusAction } from "../../../../store/slice/statusSlice";
const AddTable = (props) => {
  const { openAddTableDialog, handleCloseAddTableDialog } = props;

  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const tableFormik = useFormik({
    initialValues: {
      name: "",
      seats: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nhập tên bàn"),
      seats: Yup.number().required("Nhập mật khẩu"),
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
      console.log(response);
      dispatch(statusAction.successfulStatus("Tạo sản phẩm thành công"));
    } catch (error) {
      console.log(error);
      dispatch(statusAction.failedStatus("Tạo sản phẩm thất bại"));
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
          type="email"
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
          type="email"
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
          type="Description"
          fullWidth
          value={tableFormik.values.description}
          onChange={tableFormik.handleChange}
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
        >
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTable;
