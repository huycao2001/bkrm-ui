import React from "react";
import { useLocation, useParams, useRouteMatch } from "react-router-dom";

import { useTheme, styled } from "@material-ui/core/styles";

import { useDispatch, useSelector } from "react-redux";

import { AppBar, Toolbar, Typography, AdbIcon, Grid, Button } from "@material-ui/core";

import InventoryIcon from '@mui/icons-material/Inventory';

// import AdbIcon from '@mui/icons-material/Adb';

import useStyles from "./styles";

const HomePage = (props) => {
    const path = useRouteMatch();

    const customization = useSelector((state) => state.customize);
    const theme = useTheme();
    const classes = useStyles(theme);
    console.log("home page called with path " + `/${path}`);
    console.log(useLocation());
    console.log( "DD : "+ classes.appBar)

    const ColorButton = styled(Button)(({ theme }) => ({
        color: "#ffffff",
        backgroundColor: "#ff906d",
        padding : "5px",
        width: 100,
        "&:hover": {
          backgroundColor: "#fa6232",
        },
      }));

    return (
        <div className={classes.root}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <Grid container direction="row" alignItems="center" >
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
                            spacing={1}
                        >

                            
                            <Grid item xs={6}><ColorButton> Đăng nhập</ColorButton></Grid>
                            <Grid item xs={6}><ColorButton> Đăng kí</ColorButton></Grid>
                        </Grid>

                    </Grid>

                </Toolbar>
            </AppBar>
        </div>
    )
}

export default HomePage; 