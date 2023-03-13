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
    MenuItem,
} from "@material-ui/core";
// import { Select, TreeSelect } from 'antd';
import { makeStyles } from '@material-ui/core/styles';

import AddIcon from "@material-ui/icons/Add";
import { useFormik } from "formik";
import * as Yup from "yup";
// import fbTableApi from "../../../../api/fbTableApi";
import fbReservationApi from "../../../../../api/fbReservationApi";
import { statusAction } from "../../../../../store/slice/statusSlice";
import { Icon } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';


import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import fbTableGroupApi from "../../../../../api/fbTableGroup";
const useStyles = makeStyles((theme) => ({
    typography: {
        marginTop: "10px",
    },
    marginRight: {
        marginRight: "10px",
    }
}));

const UpdateReservation = (props) => {
    const classes = useStyles();
    const {
        reservation,
        openAddReservationDialog,
        handleCloseAddReservationDialog,
        setReload,
    } = props;


    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch_uuid = info.branch.uuid;
    const reservationFormik = useFormik({
        initialValues: {
            name: reservation.name,
            phone: reservation.phone,
            reservation_datetime: reservation.reservation_datetime,
            reservation_endtime: reservation.reservation_endtime,
            // reservation_duration: 1,
            number_of_guests: reservation.number_of_guests,
            //description: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Nhập tên bàn"),
            phone: Yup.string()
                .length(10, "Số điện thoại không chính xác")
                .required("Nhập số điện thoại").matches(/^\d+$/),
            reservation_datetime: Yup.date().required("Nhập ngày đặt"),
            // reservation_duration: Yup.number().required("Nhập thời lượng"),
            number_of_guests: Yup.number().required("Nhập số ghế"),
        }),
    });

    const dispatch = useDispatch();

    const handleAddReservation = async () => {
        handleCloseAndResetReservationDialog();
        try {
            const response = await fbReservationApi.createReservation(
                store_uuid,
                branch_uuid,
                {
                    name: reservationFormik.values.name,
                    phone: reservationFormik.values.phone,
                    reservation_datetime: reservation_datetime.format().slice(0, 19).replace('T', ' '),
                    reservation_endtime: reservation_endtime.format().slice(0, 19).replace('T', ' '),
                    // reservation_duration: reservationFormik.values.reservation_duration,
                    number_of_guests: reservationFormik.values.number_of_guests,
                    timezone: "Asia/Ho_Chi_Minh"
                },
                tableID
            );
            if (response.message === 'Reservation created successfully') {
                dispatch(statusAction.successfulStatus("Đặt bàn thành công"));
            } else {
                dispatch(statusAction.failedStatus(response.error));
            }

            //console.log(response);
            setReload();
            //dispatch(statusAction.successfulStatus("Tạo bàn thành công"));
        } catch (error) {
            console.log(error);
            console.log("FAILED");
            dispatch(statusAction.failedStatus(error));
        }
    }

    const handleUpdateReservation = async () => {
        handleCloseAndResetReservationDialog();
        try {
            const response = await fbReservationApi.updateReservation(
                store_uuid,
                branch_uuid,
                reservation.uuid,
                {
                    name: reservationFormik.values.name,
                    phone: reservationFormik.values.phone,
                    reservation_datetime: reservation_datetime.format().slice(0, 19).replace('T', ' '),
                    reservation_endtime: reservation_endtime.format().slice(0, 19).replace('T', ' '),
                    // reservation_duration: reservationFormik.values.reservation_duration,
                    number_of_guests: reservationFormik.values.number_of_guests,
                    timezone: "Asia/Ho_Chi_Minh",
                    table_uuid: tableID,
                },
            );
            if (response.message === 'Reservation created successfully') {
                dispatch(statusAction.successfulStatus("Đặt bàn thành công"));
            } else {
                dispatch(statusAction.failedStatus(response.error));
            }

            //console.log(response);
            setReload();
            //dispatch(statusAction.successfulStatus("Tạo bàn thành công"));
        } catch (error) {
            console.log(error);
            console.log("FAILED");
            dispatch(statusAction.failedStatus("FAILED"));
        }
    }

    useEffect(() => {
        console.log("table" + JSON.stringify(reservationFormik.values));
    }, [reservationFormik.values]);

    const [tables, setTables] = useState([]);
    useEffect(() => {
        const loadTables = async () => {
            try {
                const response = await fbReservationApi.getTables(
                    store_uuid,
                    branch_uuid,
                    {
                        seats: reservationFormik.values.number_of_guests,
                    }
                );
                console.log("table");
                console.log(response.data.tables);
                setTables(response.data.tables);


            } catch (error) {
                console.log(error);
            }
        };
        if (store_uuid && branch_uuid) {
            loadTables();
        }
    }, [branch_uuid, reservationFormik.values.number_of_guests]);
    const handleCloseAndResetTableDialog = () => {
        reservationFormik.resetForm();
    };

    const handleCloseAndResetReservationDialog = () => {
        handleCloseAddReservationDialog();
        reservationFormik.resetForm();
    };

    const [tableID, setTableID] = useState(reservation.table.uuid);
    const handleChangeTableID = (event) => {
        setTableID(event.target.value);
    };

    const [reservation_datetime, setReservation_datetime] = React.useState(dayjs(reservation.reservation_datetime));

    const handleChangeReservation_datetime = (newReservation_datetime) => {
        setReservation_datetime(newReservation_datetime);
    };

    const [reservation_endtime, setReservation_endtime] = React.useState(dayjs(reservation.reservation_endtime));

    const handleChangeReservation_endtime = (newReservation_endtime) => {
        setReservation_endtime(newReservation_endtime);
    };
    const [tableGroupList, setTableGroupList] = useState([]);
    useEffect(() => {
        const loadTableGroups = async () => {
            const response = await fbTableGroupApi.getTableGroupsOfBranch(store_uuid, branch_uuid);
            if (response.message === 'Success') {
                console.log(response.data.table_groups);
                setTableGroupList(response.data.table_groups.reverse());
            }
        }
        loadTableGroups()
    }, [branch_uuid])
    return (
        <Dialog open={openAddReservationDialog} onClose={handleCloseAddReservationDialog}>
            <DialogTitle id="alert-dialog-title">
                <Typography variant="h3">Đặt bàn</Typography>
            </DialogTitle>
            <DialogContent>
                <Box display="inline">
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DateTimePicker
                            required
                            label="Chọn thời gian đặt"
                            value={reservation_datetime}
                            onChange={handleChangeReservation_datetime}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Box>

                <Box m={2} display="inline">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                            required
                            label="Chọn thời gian kết thúc"
                            value={reservation_endtime}
                            onChange={handleChangeReservation_endtime}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Box>

                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Tên người đặt"
                    type="text"
                    fullWidth
                    required
                    value={reservationFormik.values.name}
                    onChange={reservationFormik.handleChange}
                />
                <TextField

                    margin="dense"
                    id="phone"
                    label="Số điện thoại"
                    // type="number"
                    fullWidth
                    required
                    value={reservationFormik.values.phone}
                    onChange={reservationFormik.handleChange}
                />
                {/* <TextField

                    margin="dense"
                    id="reservation_duration"
                    label="Thời lượng (giờ)"
                    type="number"
                    fullWidth
                    required
                    value={reservationFormik.values.reservation_duration}
                    onChange={reservationFormik.handleChange}
                /> */}
                <TextField

                    margin="dense"
                    id="number_of_guests"
                    label="Số khách"
                    type="number"
                    InputProps={{
                        inputProps: {
                            max: 10, min: 1
                        }
                    }}
                    fullWidth
                    required
                    value={reservationFormik.values.number_of_guests}
                    onChange={reservationFormik.handleChange}
                />
                <TextField

                    margin="dense"
                    id="description"
                    label="Mô tả"
                    type="text"
                    fullWidth
                    value={reservationFormik.values.description}
                    onChange={reservationFormik.handleChange}
                />


                <FormControl variant="outlined" className={classes.typography}>
                    <InputLabel id="demo-simple-select-outlined-label">Bàn</InputLabel>
                    <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={tableID}
                        onChange={handleChangeTableID}
                        label="Table"
                        required
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {tables.map((table) => {
                            return (
                                <MenuItem value={table.uuid}>{table.name}</MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                {/* {(tableID != "") ? <Typography className={classes.typography}>Số ghế của bàn: {tables.find(table => table.uuid == tableID).seats}</Typography> : <></>}
                {(tableID != "") ? <Typography className={classes.typography}>Nhóm bàn: {tableGroupList[tables.find(table => table.uuid == tableID).table_group_id - 1].name}</Typography> : <></>} */}

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
                    onClick={handleUpdateReservation}
                    disabled={reservationFormik.values.seats === 0 || reservationFormik.values.name === '' || reservationFormik.values.phone.toString().length != 10 || reservationFormik.values.number_of_guests === 0}
                >
                    Cập nhật
                </Button>
            </DialogActions>

        </Dialog>
    );
};

export default UpdateReservation;
