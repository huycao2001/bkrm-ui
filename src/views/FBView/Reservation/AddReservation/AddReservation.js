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
    MenuItem,
} from "@material-ui/core";
// import { Select, TreeSelect } from 'antd';

import AddIcon from "@material-ui/icons/Add";
import { useFormik } from "formik";
import * as Yup from "yup";
import fbTableApi from "../../../../api/fbTableApi";
import fbReservationApi from "../../../../api/fbReservationApi";
import { statusAction } from "../../../../store/slice/statusSlice";
import { Icon } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
// import AdapterJalaali from '@date-io/jalaali';
import dayjs from 'dayjs';

const AddReservation = (props) => {
    var utc = require('dayjs/plugin/utc')
    var timezone = require('dayjs/plugin/timezone') // dependent on utc plugin

    dayjs.extend(utc)
    dayjs.extend(timezone)
    const {
        openAddReservationDialog,
        handleCloseAddReservationDialog,
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
            phone: 0,
            reservation_datetime: dayjs('2023-02-20T10:00:00'),
            reservation_duration: 3,
            number_of_guests: 0,
            //description: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Nhập tên bàn"),
            phone: Yup.string()
                .length(10, "Số điện thoại không chính xác")
                .required("Nhập số điện thoại").matches(/^\d+$/),
            reservation_datetime: Yup.date().required("Nhập ngày đặt"),
            reservation_duration: Yup.number().required("Nhập thời lượng"),
            number_of_guests: Yup.number().required("Nhập số ghế"),
        }),
    });

    const dispatch = useDispatch();
    const handleAddTable = async () => {
        //handleCloseAndResetTableDialog();
        try {
            const response = await fbTableApi.createTable(
                store_uuid,
                branch_uuid,
                tableFormik.values
            );
            if (response.message === 'Success') {
                dispatch(statusAction.successfulStatus("Tạo bàn thành công"));
            } else {
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

    const handleAddReservation = async () => {
        handleCloseAndResetReservationDialog();
        try {
            // const response = await fbTableApi.createTable(
            //     store_uuid,
            //     branch_uuid,
            //     tableFormik.values
            // );
            console.log("KONICHIWA");
            console.log(value.toISOString().slice(0, 19).replace('T', ' '));
            const response = await fbReservationApi.createReservation(
                store_uuid,
                branch_uuid,
                {
                    name: tableFormik.values.name,
                    phone: tableFormik.values.phone,
                    reservation_datetime: value.format().slice(0, 19).replace('T', ' '),
                    reservation_duration: tableFormik.values.reservation_duration,
                    number_of_guests: tableFormik.values.number_of_guests,
                    timezone: "Asia/Ho_Chi_Minh"
                },
                tableID
            );
            if (response.message === 'Reservation created successfully') {
                dispatch(statusAction.successfulStatus("Đặt bàn thành công"));
            } else {
                dispatch(statusAction.failedStatus("Đặt bàn thất bại"));
            }

            //console.log(response);
            setReload();
            //dispatch(statusAction.successfulStatus("Tạo bàn thành công"));
        } catch (error) {
            console.log(error);
            console.log("FAILED");
            dispatch(statusAction.failedStatus("Tạo bàn thất bại"));
        }
    }

    useEffect(() => {
        console.log("table" + JSON.stringify(tableFormik.values));
    }, [tableFormik.values]);

    const [tables, setTables] = useState([]);
    useEffect(() => {
        const loadTables = async () => {
            try {
                const response = await fbTableApi.getTablesOfBranch(
                    store_uuid,
                    branch_uuid,
                    {
                        //   ...query,
                        //   ...pagingState
                    }
                );
                //setTotalRows(response.total_rows);
                // setTableList(response.data.tables);
                // setTotalRows(response.data.total_rows);
                setTables(response.data.tables);
                console.log("zzzzzzzz");
                console.log(response.data.tables);
            } catch (error) {
                console.log(error);
            }
        };
        if (store_uuid && branch_uuid) {
            loadTables();
        }
    }, [branch_uuid]);
    const handleCloseAndResetTableDialog = () => {
        //handleCloseAddTableDialog();
        tableFormik.resetForm();
    };

    const handleCloseAndResetReservationDialog = () => {
        handleCloseAddReservationDialog();
        tableFormik.resetForm();
    };

    const [tableID, setTableID] = useState("");
    const handleChangeTableID = (event) => {
        setTableID(event.target.value);
    };

    const [value, setValue] = React.useState(dayjs('2023-02-20T9:00:00'));

    const handleChange = (newValue) => {
        // console.log(newValue.format().slice(0, 19).replace('T', ' '));
        setValue(newValue);
    };
    return (
        <Dialog open={openAddReservationDialog} onClose={handleCloseAddReservationDialog}>
            <DialogTitle id="alert-dialog-title">
                <Typography variant="h3">Thêm bàn</Typography>
            </DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        required
                        label="Date&Time picker"
                        value={value}
                        onChange={handleChange}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>

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
                    id="phone"
                    label="Số điện thoại"
                    // type="number"
                    fullWidth
                    required
                    value={tableFormik.values.phone}
                    onChange={tableFormik.handleChange}
                />
                {/* <TextField
                    autoFocus
                    margin="dense"
                    id="reservation_datetime"
                    label="Ngày đến"
                    type="date"
                    fullWidth
                    required
                    value={tableFormik.values.reservation_datetime}
                    onChange={tableFormik.handleChange}
                /> */}
                <TextField
                    autoFocus
                    margin="dense"
                    id="reservation_duration"
                    label="Thời lượng (giờ)"
                    type="number"
                    fullWidth
                    required
                    value={tableFormik.values.reservation_duration}
                    onChange={tableFormik.handleChange}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="number_of_guests"
                    label="Số khách"
                    type="number"
                    fullWidth
                    required
                    value={tableFormik.values.number_of_guests}
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


                <FormControl variant="outlined" >
                    <InputLabel id="demo-simple-select-outlined-label">Bàn</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={tableID}
                        onChange={handleChangeTableID}
                        label="Table"
                        required
                    >
                        {/* <MenuItem value="">
                            <em>None</em>
                        </MenuItem> */}
                        {tables.map((table) => {
                            return (
                                <MenuItem value={table.uuid}>{table.name}</MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                {/* <TableGroupSelect
        tableFormik = {tableFormik}
        handleOpenAddTableGroupDialog = {handleOpenAddTableGroupDialog}
        reloadTableGroup = {reloadTableGroup}
      /> */}

            </DialogContent>
            <DialogActions>
                <Button
                    color="secondary"
                    variant="contained"
                    size="small"
                    onClick={handleCloseAddReservationDialog}
                >
                    Hủy
                </Button>
                <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={handleAddReservation}
                    disabled={tableFormik.values.seats === 0 || tableFormik.values.name === ''}
                >
                    Thêm
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
};

export default AddReservation;
