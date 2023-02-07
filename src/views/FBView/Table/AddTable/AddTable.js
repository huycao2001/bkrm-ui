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
  const { openAddTableDialog, handleCloseAddTableDialog, setReload } = props;

  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const tableFormik = useFormik({
    initialValues: {
      name: "",
      seats: 0,
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nhập tên bàn"),
      seats: Yup.number().required("Nhập số ghế"),
    }),
  });
  const treeData = [
    {
      value: 'parent 1',
      title: 'parent 1',
      children: [
        {
          value: 'parent 1-0',
          title: 'parent 1-0',
          children: [
            {
              value: 'leaf1',
              title: 'leaf1',
            },
            {
              value: 'leaf2',
              title: 'leaf2',
            },
          ],
        },
        {
          value: 'parent 1-1',
          title: 'parent 1-1',
          children: [
            {
              value: 'leaf3',
              title: <b style={{ color: '#08c' }}>leaf3</b>,
            },
          ],
        },
      ],
    },
  ];
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
      setReload();
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
          type="text"
          fullWidth
          required
          value={tableFormik.values.name}
          onChange={tableFormik.handleChange}
        />
        <TextField
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
          margin="dense"
          id="description"
          label="Mô tả"
          type="text"
          fullWidth
          value={tableFormik.values.description}
          onChange={tableFormik.handleChange}
        />



      <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          style = {{marginTop : '20px'}}
      >
            <Select
              defaultValue="Nhóm"
              style={{ width: '50%'}}  
              dropdownStyle={{ maxHeight: 400, overflow: 'auto',zIndex:100000000  }}
              
              options={[
                {value : '', label : 'Chọn nhóm'},
                { value: '39b7f811-f62f-45a3-9bbe-926ca1e4d48f', label: 'Tầng 1' },
                { value: '39b7f811-f62f-45a3-9bbe-926ca1e4d48d', label: 'Tầng 2' },
                { value: '39b7f811-f62f-45a3-9bbe-926ca1e4d48q', label: 'Tầng 3' },
      
              ]}
            />

            <Tooltip title ='Thêm nhóm mới'>
              <IconButton>
                  <AddIcon/>
              </IconButton>
            </Tooltip>
      </Grid>





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
    </Dialog>
  );
};

export default AddTable;
