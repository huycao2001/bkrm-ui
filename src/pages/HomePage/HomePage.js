import React from "react";
import { useLocation, useParams, useRouteMatch } from "react-router-dom";

import { useTheme, styled } from "@material-ui/core/styles";

import { useDispatch, useSelector } from "react-redux";

import { AppBar, Toolbar, Typography, AdbIcon, Grid, Button, Box, IconButton } from "@material-ui/core";

import PersonIcon from "@material-ui/icons/Person";



import BasicMenu from "../../components/Menu/BasicMenu";

import NotificationsIcon from '@mui/icons-material/Notifications';

import LogoutIcon from '@mui/icons-material/Logout';

// import AdbIcon from '@mui/icons-material/Adb';

import useStyles from "./styles";

const HomePage = (props) => {
    const path = useRouteMatch();

    const customization = useSelector((state) => state.customize);
    const theme = useTheme();
    const classes = useStyles(theme);
    console.log("home page called with path " + `/${path}`);
    console.log(useLocation());
    console.log("DD : " + classes.appBar)

    const ColorButton = styled(Button)(({ theme }) => ({
        color: "#ffffff",
        backgroundColor: "#ff906d",
        padding: "5px",
        width: 100,
        "&:hover": {
            backgroundColor: "#fa6232",
        },
    }));

    return (
        <div className={classes.root}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    {/* <Grid container direction="row" alignItems="center" >
                        <Grid item sm={2}>
                            <Typography variant="h3" noWrap className={classes.searchEngine}>
                                BKRM
                            </Typography>
                        </Grid>

                        <Grid container item sm={6} direction="row" alignItems="center">
                            <Grid container item sm={8} direction="row">
                                <Button >Bán hàng</Button>
                                <Button >Kho hàng</Button>
                                <Button >Nhân sự</Button>
                                <Button >Quản lý</Button>
                                <Button >Giới thiệu</Button>
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            item
                            sm={2}
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                        >

                            <Grid item sm ={8}>
                                <IconButton color="text" size="small">
                                    <PersonIcon fontSize="large" />
                                </IconButton>

                                <Typography variant ="h4">
                                    Chủ cửa hàng
                                </Typography>
                            </Grid>

                            <Grid item sm={4} ><ColorButton> Đăng xuất</ColorButton></Grid>
                        </Grid>

                    </Grid> */}

                    <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" style={{ width: "100%" }}>
                        <Typography variant="h3" className={classes.searchEngine}>
                            BKRM
                        </Typography>



                        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                            {/* <Button style = {{textTransform: "none"}}>Bán hàng</Button> */}
                            {/* <Button style ={{color : "white"}}>Bán hàng</Button>
                            <Button style ={{color : "white"}} >Kho hàng</Button>
                            <Button style ={{color : "white"}} >Nhân sự</Button>
                            <Button style ={{color : "white"}} >Quản lý</Button>
                            <Button style ={{color : "white"}} >Giới thiệu</Button> */}
                            <BasicMenu section = "Bán hàng" />
                            <BasicMenu section = "Kho hàng" />
                            <BasicMenu section = "Nhân sự" />
                            <BasicMenu section = "Quản lý" />
                            <BasicMenu section = "Cài đặt" />
                            <BasicMenu section = "Thống kê" />

                        </Box>

                        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between"  >
                            {/* <Box display="flex" flexDirection="column" alignItems="center"> */}
                                <IconButton  size="small">
                                    <PersonIcon fontSize="large" />
                                </IconButton>

                                <IconButton  size="small">
                                    <NotificationsIcon fontSize ="large"/>
                                </IconButton>

                                <IconButton  size = "small">
                                    <LogoutIcon fontSize ="large" color ="white"/>
                                </IconButton>

                                {/* <Typography variant="h4">
                                    Chủ cửa hàng
                                </Typography> */}

                            {/* </Box> */}

                            



                        </Box>
                    </Box>

                </Toolbar>
            </AppBar>
        </div>
    )
}

export default HomePage; 