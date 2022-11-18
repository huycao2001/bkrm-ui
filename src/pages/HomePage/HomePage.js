import { React, Suspense } from "react";
import { Route, Redirect, useLocation, useParams, useRouteMatch, Switch } from "react-router-dom";
import clsx from "clsx";
import { Spin } from 'antd'

import { useTheme, styled } from "@material-ui/core/styles";

import { useDispatch, useSelector } from "react-redux";

import { authActions } from "../../store/slice/authSlice";
import BranchSelectAppBar from "../../components/CheckoutComponent/BranchSelect/BranchSelectAppBar";

import { AppBar, Toolbar, Typography, AdbIcon, Grid, Button, Box, IconButton, useMediaQuery } from "@material-ui/core";

import PersonIcon from "@material-ui/icons/Person";

import { logOutHandler } from "../../store/actionCreator"

import InventoryView from "../../views/InventoryView/InventoryView";
import AdminView from "../../views/AdminView/AdminView";


import BasicMenu from "../../components/Menu/BasicMenu";

import NotificationsIcon from '@mui/icons-material/Notifications';

import LogoutIcon from '@mui/icons-material/Logout';

import MenuIcon from "@material-ui/icons/Menu";

// import AdbIcon from '@mui/icons-material/Adb';

import useStyles from "./styles";





const HomePage = (props) => {
  const { path } = useRouteMatch();

  const customization = useSelector((state) => state.customize);
  const theme = useTheme();
  const classes = useStyles(theme);
  const infoDetail = useSelector((state) => state.info);
  const dispatch = useDispatch();
  const roleUser = infoDetail.role === "owner" ? "Chủ cửa hàng" : infoDetail.role === "employee" ? "Nhân viên" : "Admin";
  const permissions = useSelector((state) => state.info.user.permissions);
  console.log("home page called with path " + `${path}`);
  // console.log(useLocation());
  // console.log("DD : " + classes.appBar)


  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm")); // sm : 600

  // const ColorButton = styled(Button)(({ theme }) => ({
  //     color: "#ffffff",
  //     backgroundColor: "#ff906d",
  //     padding: "5px",
  //     width: 100,
  //     "&:hover": {
  //         backgroundColor: "#fa6232",
  //     },
  // }));

  const logOutHandler = () => {
    dispatch(authActions.logOut());
    localStorage.removeItem("token");
    localStorage.removeItem("customer");
    localStorage.removeItem("cartListData");
    localStorage.removeItem("suppliers");
    localStorage.removeItem("importListData");
    localStorage.removeItem("products");
    sessionStorage.removeItem("BKRMprev");
    sessionStorage.removeItem("BKRMopening");

  };

  //console.log( "Permissions : " +  JSON.stringify(permissions))

  return (
    <div className={classes.root}>


      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          {matchDownSm ? (
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" style={{ width: "100%" }} >
              <Typography variant="h3" className={classes.searchEngine}>
                BKRM
              </Typography>
              <IconButton
                aria-label="open drawer"
                onClick={() => { }}
                edge="start"
              >
                <MenuIcon />
              </IconButton>

            </Box>
          ) :

            (
              <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" style={{ width: "100%", padding: "0 50px 0 0" }}>
                <Typography variant="h3" className={classes.searchEngine}>
                  BKRM
                </Typography>
                {(infoDetail.role == "admin") ?
                  <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between"></Box> :
                  <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                    <BasicMenu section="Bán hàng" />
                    <BasicMenu section="Kho hàng" />
                    <BasicMenu section="Nhân sự" />
                    <BasicMenu section="Quản lý" />
                    <BasicMenu section="Cài đặt" />
                    <BasicMenu section="Thống kê" />
                  </Box>}
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between" style={{ width: "10%", marginRight: "200px" }} >
                  {(infoDetail.role == "admin") ?
                    <BranchSelectAppBar store_uuid={undefined} /> :
                    <BranchSelectAppBar store_uuid={infoDetail.store.uuid} />}
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    style={{ width: "100%", padding: "0 20px 0 20px", textAlign: "right" }}

                  >

                    <Typography variant="h5" style={{ fontWeight: 700, fontSize: 13 }}>
                      {roleUser}
                    </Typography>
                    <Typography variant="h5" noWrap>
                      {infoDetail.role == "admin" ? infoDetail.admin.name : infoDetail.user.name}
                    </Typography>
                  </Box>

                  <IconButton size="small">
                    <PersonIcon fontSize="large" />
                  </IconButton>

                  <IconButton size="small">
                    <NotificationsIcon fontSize="large" />
                  </IconButton>

                  <Button style={{ color: "black" }} onClick={() => logOutHandler()}>
                    Đăng xuất
                  </Button>

                  {/* <IconButton size="small">
                                        <LogoutIcon fontSize="large" color="white" onClick={() => logOutHandler()} />
                                    </IconButton> */}




                </Box>
              </Box>
            )
          }


        </Toolbar>
      </AppBar>
      <main
        className={clsx([classes.content], {
          [classes.contentShift]: false,
        })}
      >
        <Box className={classes.background}>
          <Suspense fallback={<div style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)', height: '100vh', width: '100%' }}>
            <Spin style={{ margin: 'auto' }} />
          </div>} >
            {(infoDetail.role == "admin") ?
              <Switch>
                <Route path={`${path}/`}>
                  <Redirect to={`${path}/admin`} component={AdminView} />
                </Route>
              </Switch> :
              <Switch>
                <Route path={`${path}/inventory`} component={InventoryView} />
                <Route path={`${path}/`} >
                  <Redirect to={`${path}/inventory`} component={InventoryView} />
                </Route>
              </Switch>}
          </Suspense>
        </Box>

      </main>
    </div >
  )
}

export default HomePage; 