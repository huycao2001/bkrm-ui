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
            setQuery({
                ...values,
                minReservation_datetime: minReservation_datetime.format().slice(0, 19).replace('T', ' '),
                maxReservation_datetime: maxReservation_datetime.format().slice(0, 19).replace('T', ' '),
                minNumber_of_guests: minNumberOfGuests,
                maxNumber_of_guests: maxNumberOfGuests,
            })
            // console.log("tornado");
            // console.log({ ...values, minReservation_datetime: minReservation_datetime, maxReservation_datetime: maxReservation_datetime });
        },
    });

    const [minReservation_datetime, setMinReservation_datetime] = React.useState(dayjs("2023-01-01"));

    const handleChangeMinReservation_datetime = (newReservation_datetime) => {
        setMinReservation_datetime(newReservation_datetime);
    }
    const [maxReservation_datetime, setMaxReservation_datetime] = React.useState('');

    const handleChangeMaxReservation_datetime = (newReservation_datetime) => {
        setMaxReservation_datetime(newReservation_datetime);
    };

    const [minNumberOfGuests, setMinNumberOfGuests] = React.useState(1);
    const [maxNumberOfGuests, setMaxNumberOfGuests] = React.useState(10);

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
                    format = "DD/MM/YYYY HH:mm:ss A"
                    inputFormat="DD/MM/YYYY HH:mm:ss A"
                    //required
                    label="Từ"
                    value={minReservation_datetime}
                    onChange={handleChangeMinReservation_datetime}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                    format = "DD/MM/YYYY HH:mm:ss A"
                    inputFormat="DD/MM/YYYY HH:mm:ss A"
                    //required
                    label="Đến"
                    value={maxReservation_datetime}
                    onChange={handleChangeMaxReservation_datetime}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>

            <TextField

                margin="dense"
                // id="number_of_guests"
                label="Số khách ít nhất"
                type="number"
                fullWidth
                InputProps={{
                    inputProps: {
                        max: 10, min: 1
                    }
                }}
                // required
                value={minNumberOfGuests}
                onChange={(e) => {
                    setMinNumberOfGuests(e.target.value);
                }}
            />

            <TextField

                margin="dense"
                // id="number_of_guests"
                label="Số khách nhiều nhất"
                type="number"
                fullWidth
                InputProps={{
                    inputProps: {
                        max: 10, min: 1
                    }
                }}
                required
                value={maxNumberOfGuests}
                onChange={(e) => {
                    setMaxNumberOfGuests(e.target.value);
                }}
            />
            {/* BUTTON */}
            <Button onClick={formik.handleSubmit} variant="contained" color="primary" style={{ marginTop: 30 }}>
                Lọc
            </Button>




        </Drawer>
    )
}

export default ReservationFilter

