import React from 'react'
import {
    Drawer, Box, TextField, Typography, Button, Grid, MenuItem, Select, InputLabel, FormControl
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/styles";
import { useFormik } from 'formik';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
const drawerWidth = 300;
const useStyles = makeStyles((theme) =>
    createStyles({
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },

        drawerPaper: {
            width: drawerWidth,
            padding: 15
        },
        textField: { marginBottom: 10 },
        text: { marginBottom: 10, marginTop: 15 }
    })
);
const ReservationFilter = (props) => {
    const { handleToggleFilter, openFilter, query, setQuery } = props;

    const theme = useTheme();
    const classes = useStyles(theme);

    const formik = useFormik({
        initialValues: query,
        onSubmit: async values => {
            // console.log(values)
            // const res = await purchaseOrderApi.searchPurchaseOrder(store_uuid, branch_uuid, values)
            // setPurchaseOrders(res.data)
            handleToggleFilter()
            setQuery({ ...values, minReservation_datetime: minReservation_datetime.format().slice(0, 19).replace('T', ' '), maxReservation_datetime: maxReservation_datetime.format().slice(0, 19).replace('T', ' ') })
            // console.log("tornado");
            // console.log({ ...values, minReservation_datetime: minReservation_datetime, maxReservation_datetime: maxReservation_datetime });
        },
    });

    const [minReservation_datetime, setMinReservation_datetime] = React.useState(dayjs());

    const handleChangeMinReservation_datetime = (newReservation_datetime) => {
        setMinReservation_datetime(newReservation_datetime);
    }
    const [maxReservation_datetime, setMaxReservation_datetime] = React.useState(dayjs());

    const handleChangeMaxReservation_datetime = (newReservation_datetime) => {
        setMaxReservation_datetime(newReservation_datetime);
    };
    return (
        <Drawer
            anchor="right"
            onClose={handleToggleFilter}
            open={openFilter}
            classes={{
                paper: classes.drawerPaper,
            }}
            className={classes.drawer}
        >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    required
                    label="Từ"
                    value={minReservation_datetime}
                    onChange={handleChangeMinReservation_datetime}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    required
                    label="Đến"
                    value={maxReservation_datetime}
                    onChange={handleChangeMaxReservation_datetime}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>

            <TextField

                margin="dense"
                id="number_of_guests"
                label="Số khách ít nhất"
                type="number"
                fullWidth
                required
                value={formik.values.minNumber_of_guests}
                onChange={formik.handleChange}
            />

            <TextField

                margin="dense"
                id="number_of_guests"
                label="Số khách nhiều nhất"
                type="number"
                fullWidth
                required
                value={formik.values.maxNumber_of_guests}
                onChange={formik.handleChange}
            />
            {/* BUTTON */}
            <Button onClick={formik.handleSubmit} variant="contained" color="primary" style={{ marginTop: 30 }}>
                Lọc
            </Button>




        </Drawer>
    )
}

export default ReservationFilter

