import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { statusAction } from "../../../../../store/slice/statusSlice";
import {
    Button,
    TextField,
    Typography,
    Grid,
    Box,
    Divider,
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
import ConfirmPopUp from "../../../../../components/ConfirmPopUp/ConfirmPopUp";
import UpdateReservation from "./UpdateReservation";
// import fbTableApi from "../../../../../api/fbTableApi";

// import UpdateTable from "./UpdateTable";
import fbReservationApi from "../../../../../api/fbReservationApi"
const ReservationDetail = (props) => {
    const {
        row,
        openRow,
        setReload,
        handleSetReloadTableGroupEditor
    } = props;

    const dispatch = useDispatch();
    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch_uuid = info.branch.uuid;
    const [openReservationUpdate, setopenReservationUpdate] = useState(false);
    const [openDeleteReservationConfirm, setOpenDeleteReservationConfirm] = useState(false);



    const handleDeleteReservation = async () => {
        try {
            const response = await fbReservationApi.deleteReservation(store_uuid, branch_uuid, row.uuid);
            if (response.message = "Success") {
                dispatch(statusAction.successfulStatus("Xóa thành công"));
                setReload();
                handleCloseReservationUpdate();
            }
            else if (response.error) {
                dispatch(statusAction.failedStatus(response.message.error));
            }
        } catch (e) {
            dispatch(statusAction.failedStatus("Xóa thất bại, check console"));
            console.log(e);
        }
    }

    const handleopenReservationUpdate = () => {
        setopenReservationUpdate(true);
    }

    const handleCloseReservationUpdate = () => {
        setopenReservationUpdate(false);
    }
    return (
        <Collapse
            in={row.uuid === openRow}
        >
            {openReservationUpdate && <UpdateReservation
                reservation={row}
                openAddReservationDialog={openReservationUpdate}
                handleCloseAddReservationDialog={handleCloseReservationUpdate}
                setReload={setReload}
            />}

            {openDeleteReservationConfirm && <ConfirmPopUp
                open={openDeleteReservationConfirm}
                handleClose={() => {
                    setOpenDeleteReservationConfirm(false)
                }}
                handleConfirm={handleDeleteReservation}
                message={
                    <Typography>
                        Xóa vĩnh viễn ?
                    </Typography>
                }
            />}
            <Box margin={1}>
                <Typography
                    variant="h3"
                    gutterBottom
                    component="div"
                //   className={classes.typo}
                >

                    Tên bàn :  {row.name}
                </Typography>

                <Grid container direction="row" justifyContent="flex-start">
                    <Grid container direction='column' item xs={12} >
                        <Grid container direction="row" justifyContent="flex-start">
                            <Grid item xs={7} sm={6}>
                                <Typography variant="h5" gutterBottom component="div">
                                    Mã bàn đặt
                                </Typography>

                            </Grid>

                            <Grid item sm={6}>
                                <Typography variant="body1" gutterBottom component="div">
                                    {row.id}{" "}
                                </Typography>

                            </Grid>

                        </Grid>
                        <Divider sx={{ marginBottom: "2px", width: '70%' }} />

                        <Grid container direction="row" justifyContent="flex-start">
                            <Grid item xs={7} sm={6}>
                                <Typography variant="h5" gutterBottom component="div">
                                    Giờ đến : {" "}
                                </Typography>

                            </Grid>
                            <Grid item sm={6}>
                                <Typography variant="body1" gutterBottom component="div">
                                    {row.reservation_datetime}{" "}
                                </Typography>


                            </Grid>
                        </Grid>
                        <Divider sx={{ marginBottom: "2px", width: '70%' }} />

                        <Grid container direction="row" justifyContent="flex-start">
                            <Grid item xs={7} sm={6}>
                                <Typography variant="h5" gutterBottom component="div">
                                    Điện thoại
                                </Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography variant="body1" gutterBottom component="div">
                                    {row.phone}{" "}
                                </Typography>
                            </Grid>
                        </Grid>

                        <Divider sx={{ marginBottom: "2px", width: '70%' }} />

                        <Grid container direction="row" justifyContent="flex-start">
                            <Grid item xs={7} sm={6}>
                                <Typography variant="h5" gutterBottom component="div">
                                    Bàn
                                </Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography variant="body1" gutterBottom component="div">
                                    {row.table.name} {" "}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Divider sx={{ marginBottom: "2px", width: '70%' }} />


                        <Grid container direction="row" justifyContent="flex-start">
                            <Grid item xs={7} sm={6}>
                                <Typography variant="h5" gutterBottom component="div">
                                    Trạng thái:
                                </Typography>
                            </Grid>
                            <Grid item sm={6}>
                                <Typography variant="body1" gutterBottom component="div">
                                    {row.status}{" "}
                                </Typography>
                            </Grid>
                        </Grid>


                    </Grid>

                    <Grid container direction="column" item xs={12} sm={6}>


                    </Grid>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justifyContent={"flex-end"}
                    style={{ marginTop: 20 }}
                >
                    <Button
                        color="primary"
                        variant="contained"
                        size="small" style={{ marginLeft: 15 }}
                        onClick={handleopenReservationUpdate}
                    >
                        Sửa
                    </Button>
                    <Button
                        variant="contained"
                        color='secondary'
                        size="small"
                        style={{ marginLeft: 15 }}
                        onClick={() => {
                            setOpenDeleteReservationConfirm(true);
                        }}
                    // startIcon={<DeleteIcon />}
                    //sx={{ color: 'warning.main' }}

                    >
                        Xóa
                    </Button>

                </Grid>
            </Box>
        </Collapse>
    )
    // return (
    //     <Box>

    //     </Box>
    // )
}



export default ReservationDetail