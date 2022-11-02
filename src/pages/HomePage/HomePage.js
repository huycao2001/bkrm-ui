import React from "react";
import { useLocation, useParams, useRouteMatch } from "react-router-dom";

import { useTheme } from "@material-ui/core/styles";

import { useDispatch, useSelector } from "react-redux";

import { AppBar, Toolbar, Typography, AdbIcon } from "@material-ui/core";

// import AdbIcon from '@mui/icons-material/Adb';

import useStyles from "./styles";

const HomePage = (props) => {
    const path = useRouteMatch();
    
    const customization = useSelector((state) => state.customize);
    const theme = useTheme();
    const classes = useStyles(theme);
    console.log("home page called with path " + `/${path.path}`);
    
    return (
        <AppBar className={classes.appBar}>
            <Toolbar>
            {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
                <Typography variant="h3" style={{ marginTop: 15, marginLeft: 20 }}>
                    BKRM
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default HomePage; 