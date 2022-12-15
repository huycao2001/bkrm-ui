import React, { useEffect, useState } from "react";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import useStyles from "../../../components/TableCommon/style/mainViewStyle";
//import library
import {
  Box,
  Grid,
  Collapse,
  Typography,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@material-ui/core";
import Button from '@mui/material/Button';
//import icon
import CreateIcon from '@mui/icons-material/Create';
//import image
import avaUpload from "../../../assets/img/product/img.jpeg";
//import project
// import productApi from "../../../../../api/productApi";
// carousel for images
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useDispatch, useSelector } from "react-redux";
import { TableCell, TableRow, Avatar, ListItem, Chip } from "@material-ui/core";
import clsx from "clsx";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import DialogWrapper from "../../../components/Modal/DialogWrapper";
import { Cancel, CheckCircle, Close, Error } from "@material-ui/icons";
import { VNDFormat } from "../../../components/TextField/NumberFormatCustom";
// const useStyles = makeStyles((theme) =>
//   createStyles({
//     root: {
//       "& .MuiTextField-root": {
//         marginTop: theme.spacing(2),
//       },
//     },
//     headerTitle: {
//       fontSize: "1.125rem",
//     },
//     typo: {
//       marginBottom: 20,
//     },
//   })
// );

const UserInfoPopUp = (props) => {
  const { open, handleClose, user, index, handleToggle } = props;

  const theme = useTheme();
  const classes = useStyles(theme);
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const handleOpenConfirm = () => {
    setConfirmOpen(true);
  };
  const handleCloseConfirm = (status) => {
    setConfirmOpen(false);
  };

  useEffect(() => {
    if (!open) {
      handleCloseConfirm();
    }
  }, [open])

  return (
    // <ModalWrapperWithClose
    // handleClose={() => props.handleClose(false)}
    // title={"Chi tiết biến thể"}
    // open={props.open}
    // >
    <DialogWrapper
      handleClose={() => handleClose()}
      title={"Thông tin người dùng"}
      open={open}
      classes={classes}
    >
      <div style={{ width: 800 }}>
        <Box margin={1}>
          <Typography
            variant="h3"
            gutterBottom
            component="div"
            className={classes.typo}
          >
            {user ? user.name : "Not set"}
          </Typography>

          <Grid container direction="row" justifyContent="flex-start">

            {/* Picture slider */}
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  height: 170,
                  width: 170,
                  borderRadius: 2,
                  marginLeft: 15,
                }}
              >
                <Carousel showThumbs={false}>
                  <img
                    key={user ? user.img_url ? user.img_url  : 'https://i.imgur.com/IMX423R.png' : "Not set"}
                    src={user ? user.img_url ? user.img_url  : 'https://i.imgur.com/IMX423R.png' : "Not set"}
                    height={xsScreen ? "100" : "170"}
                    width={xsScreen ? "100" : "170"}
                  />
                </Carousel>
              </Box>
            </Grid>

            <Grid container direction="column" item xs={8}>
              <Grid container direction="row" spacing={4}>
                <Grid item xs={12} sm={6}>
                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={3} sm={6}>
                      <Typography variant="h5" gutterBottom component="div">
                        Username
                      </Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography style={{ overflowWrap: 'break-word' }} variant="body1" gutterBottom component="div">
                        {user ? user.user_name : "Not set"}{ }
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={3} sm={6}>
                      <Typography variant="h5" gutterBottom component="div">
                        Email
                      </Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography style={{ overflowWrap: 'break-word' }} variant="body1" gutterBottom component="div">
                        {user ? user.email : "Not set"}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={3} sm={6}>
                      <Typography variant="h5" gutterBottom component="div">
                        Phone
                      </Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="body1" gutterBottom component="div">
                        {user ? user.phone : "Not set"}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={3} sm={6}>
                      <Typography variant="h5" gutterBottom component="div">
                        Date of birth
                      </Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="body1" gutterBottom component="div">
                        {user ? user.date_of_birth : "Not set"}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={3} sm={6}>
                      <Typography variant="h5" gutterBottom component="div">
                        Gender
                      </Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="body1" gutterBottom component="div">
                        {user ? user.gender : "Not set"}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={3} sm={6}>
                      <Typography variant="h5" gutterBottom component="div">
                        Since creation
                      </Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography style={{ overflowWrap: 'break-word' }} variant="body1" gutterBottom component="div">
                        {(user ? user.time_since_creation : 0) + " " + (user ? (user.time_since_creation ? (user.time_since_creation == 1 ? "day" : "days") : "days") : "days")}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={3} sm={6}>
                      <Typography variant="h5" gutterBottom component="div">
                        Approval status
                      </Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="body1" gutterBottom component="div">
                        {user ? (user.approved_by_admin ? "Approved" : "Unapproved") : "Not set"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>



                <Grid item xs={12} sm={6}>
                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={3} sm={6}>
                      <Typography variant="h5" gutterBottom component="div">
                        Store name
                      </Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="body1" gutterBottom component="div">
                        <Typography style={{ overflowWrap: 'break-word' }} variant="body1" gutterBottom component="div">
                          {user ? user.store_name : "Not set"}
                        </Typography>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={3} sm={6}>
                      <Typography variant="h5" gutterBottom component="div">
                        Branches
                      </Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="body1" gutterBottom component="div">
                        <Typography variant="body1" gutterBottom component="div">
                          {user ? Object.keys(user.branches).length : 0}
                        </Typography>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={3} sm={6}>
                      <Typography variant="h5" gutterBottom component="div">
                        Employees
                      </Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="body1" gutterBottom component="div">
                        <Typography style={{ overflowWrap: 'break-word' }} variant="body1" gutterBottom component="div">
                          {user ? (user.number_of_employees) : 0}
                        </Typography>
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={3} sm={6}>
                      <Typography variant="h5" gutterBottom component="div">
                        Products
                      </Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="body1" gutterBottom component="div">
                        {user ? user.number_of_products : 0}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={3} sm={6}>
                      <Typography variant="h5" gutterBottom component="div">
                        Orders
                      </Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="body1" gutterBottom component="div">
                        {user ? user.number_of_orders : 0}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={3} sm={6}>
                      <Typography variant="h5" gutterBottom component="div">
                        Revenue
                      </Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Typography variant="body1" gutterBottom component="div">
                        <Typography style={{ overflowWrap: 'break-word' }} variant="body1" gutterBottom component="div">
                          <VNDFormat value={user ? user.total_revenue : 0} />
                        </Typography>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent={xsScreen ? null : "flex-end"}
                style={{ marginTop: 20 }}
              >
                <Button
                  variant="contained"
                  size="small"
                  color={(user && user.approved_by_admin) ? "error" : "success"}
                  style={{ marginLeft: 15 }}
                  startIcon={<CreateIcon />}
                  onClick={() => {
                    setConfirmOpen(true);
                  }}
                >
                  {(user && user.approved_by_admin) ? "Unapprove" : "Approve"}
                </Button>

                <DialogWrapper
                  handleClose={() => { setConfirmOpen(false); }}
                  title={"Xác nhận"}
                  open={confirmOpen}
                >
                  <div style={{ width: 800 }}>
                    <Box margin={1}>
                      <Typography
                        variant="h3"
                        gutterBottom
                        component="div"
                        className={classes.typo}
                      >
                        Confirmation
                      </Typography>

                      <Grid container direction="row" justifyContent="center">

                        <Grid container direction="row" justifyContent="center">
                          <Typography variant="h5" gutterBottom component="div">
                            Are you sure you want to {(user && user.approved_by_admin) ? "unapprove" : "approve"} this user?
                          </Typography>
                          <Grid
                            container
                            direction="row"
                            justifyContent={xsScreen ? null : "flex-end"}
                            style={{ marginTop: 20 }}
                          >
                            <Button
                              variant="contained"
                              size="small"
                              color="success"
                              style={{ marginLeft: 15 }}
                              startIcon={<CheckCircle />}
                              onClick={() => {
                                handleToggle(index);
                                handleClose();
                              }}
                            >

                              Yes
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              color="error"
                              style={{ marginLeft: 15 }}
                              startIcon={<Cancel />}
                              onClick={() => {
                                handleCloseConfirm();
                                handleClose();
                              }}
                            >
                              No
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  </div>
                </DialogWrapper>

                {/* <IconButton
                  aria-label="more"
                  aria-controls="long-menu"
                  aria-haspopup="true"
                  onClick={handleClick}
                  size="small"
                  style={{ marginLeft: 10 }}
                >
                  <MoreVertIcon />
                </IconButton> */}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </div>
    </DialogWrapper >
    /* </ModalWrapperWithClose> */
  );
};

export default UserInfoPopUp;
