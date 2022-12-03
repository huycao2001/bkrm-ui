
// import React from react; 

import { useDispatch, useSelector } from "react-redux";
import useStyles from "../../../components/TableCommon/style/mainViewStyle";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useState, useEffect } from "react";
import SearchBar from "../../../components/SearchBar/SearchBar";
import LoadingIndicator from "../../../components/LoadingIndicator/LoadingIndicator";
import { trackPromise } from "react-promise-tracker";

import {
  Typography,
  Card,
  Divider,
  Grid,
  ButtonBase,
  Avatar,
  Tooltip,
  Box,
  InputAdornment,
  TextField,
  Modal
} from "@material-ui/core";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import adminApi from '../../../api/adminApi'
import Error from "@material-ui/icons/Error";
import { Edit } from "@material-ui/icons";

import SearchTwoToneIcon from "@material-ui/icons/SearchTwoTone";
import barcodeIcon from "../../../assets/img/icon/barcode_grey.png";
import UserInfoPopUp from "./UserInfoPopUp";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  // [`&.${tableCellClasses.head}`]: {
  //   backgroundColor: theme.palette.common.black,
  //   color: theme.palette.common.white,
  // },
  // [`&.${tableCellClasses.body}`]: {
  //   fontSize: 14,
  // },
}));

export default function Admin() {
  const theme = useTheme();
  const classes = useStyles(theme);
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const [users, setUsers] = useState([]);
  const [backupUsers, setBackupUsers] = useState([]);
  const [sortASC, setSortASC] = useState(true);
  const [sortKey, setSortKey] = useState("");
  const [trialPeriod, setTrialPeriod] = useState(0);
  const [updateFlag, setUpdateFlag] = useState(true);
  const [searchKey, setSearchKey] = useState("");
  const [userInfoModalOpen, setUserInfoModalOpen] = useState(false);

  const pointer = {"cursor": "pointer"};

  const [userIndex, setUserIndex] = useState(0);

  const fetchUsers = async () => {
    const response = await trackPromise(adminApi.getUsers(searchKey));
    // console.log(JSON.stringify(response.users));
    setUsers(response.users);
    setBackupUsers(response.users.slice(0));
    setTrialPeriod(response.trial_period);
  }

  const sortUsersBy = (key, sASC) => {
    if (key == sortKey) {
      console.log("Same " + ((sASC) ? "ASC" : "DESC"));
      sASC = !sASC;
      setSortASC(sASC);
      console.log("Same " + ((sASC) ? "ASC" : "DESC"));
    }
    else {
      console.log("Diff " + ((sASC) ? "ASC" : "DESC"));
      sASC = true;
      setSortASC(sASC);
      console.log("Diff " + ((sASC) ? "ASC" : "DESC"));
    }
    setSortKey(key);
    const sortMultiplier = (sASC) ? 1 : -1;
    let sortedUsers = backupUsers.slice(0);
    sortedUsers.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 * sortMultiplier : ((x > y) ? 1 * sortMultiplier : 0));
    });
    setUsers(sortedUsers);
  }

  useEffect(() => {
    setUsers([]);
    fetchUsers();
  }, [updateFlag, searchKey])

  const renderTable = () => {
    return (
      <TableContainer container component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell style={pointer} onClick={() => { sortUsersBy("name", sortASC); }}><b>Name</b></StyledTableCell>
              <StyledTableCell style={pointer} onClick={() => { sortUsersBy("user_name", sortASC); }} align="right"><b>Username</b></StyledTableCell>
              <StyledTableCell style={pointer} onClick={() => { sortUsersBy("email", sortASC); }} align="right"><b>Email</b></StyledTableCell>
              <StyledTableCell style={pointer} onClick={() => { sortUsersBy("time_since_creation", sortASC); }} align="right"><b>Days since creation &#40;max {trialPeriod}&#41;</b></StyledTableCell>
              <StyledTableCell style={pointer} onClick={() => { sortUsersBy("approved_by_admin", sortASC); }} align="right"><b>Current status</b></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>


            {
              users.map((user, index) => (
                <TableRow
                  key={user.uuid}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">{user.name}</TableCell>
                  <TableCell align="right">{user.user_name}</TableCell>
                  <TableCell align="right">{user.email ? user.email : "Not set"}</TableCell>
                  {user.expired ?
                    <TableCell align="right" style={{ color: "#FF0000" }}>{user.time_since_creation}</TableCell> :
                    <TableCell align="right" style={{ color: "#4BB543" }}>{user.time_since_creation}</TableCell>}
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color={user.approved_by_admin ? "success" : "error"}
                      // onClick={() => { handleToggleApproval(index); }}
                      onClick={() => { handleOpenUserInfoModal(index); }}
                      startIcon={<Edit />}
                    // startIcon={user.approved_by_admin ? <CheckCircle /> : <Error />}
                    >
                      {user.approved_by_admin ? "Approved" : "Unapproved"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>)
  };

  const handleToggleApproval = async (index) => {
    const response = await adminApi.toggleAprroveUser(users[index].uuid);
    if (response.user) {
      let updatedUser = response.user;
      let oldUsers = users;
      oldUsers[index] = updatedUser;
      setUsers(oldUsers.slice(0));
    }
  };

  const handleOpenUserInfoModal = (index) => {
    setUserInfoModalOpen(true);
    setUserIndex(index);
  }

  const handleCloseUserInfoModal = () => {
    setUserInfoModalOpen(false);
  }

  return (
    <Card className={classes.root} >
      <Grid container direction="row" justifyContent="space-between">
        <Typography className={classes.headerTitle} variant="h5" >
          Admin
        </Typography>
        {/* <SearchBar title="Hmm"/> */}
        <Tooltip title="Nhấn Enter để tìm kiếm">
          <TextField
            style={{ marginTop: 12, marginLeft: 10 }}
            variant="outlined"
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.target.value === "") {
                setSearchKey(e.target.value)
              }
            }
            }
            placeholder="Find a user..." /*placeholder='Tìm kiếm ...'*/
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchTwoToneIcon className={classes.icon} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                </InputAdornment>
              ),
              className: classes.search,
            }}
          />
        </Tooltip>
        <Grid className={classes.btngroup} sx={{ padding: "10px" }}>
          {/* <Tooltip title="Refresh">
            <Button
              variant="outlined"
              color="primary"
              // onClick={() => { refreshView(); }}
            >
              Refresh
            </Button>
          </Tooltip> */}
        </Grid>
      </Grid>
      <Grid container>
        <LoadingIndicator />
        {renderTable()}
      </Grid>
      <LoadingIndicator />
      {/* <Modal open={userInfoModalOpen} onClose={() => { handleCloseUserInfoModal(); }} aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <Card className={classes.root}>
          <Grid container direction="row" justifyContent="space-between">
            <Typography>{(users[userIndex]) ? users[userIndex].user_name : "No"};
            </Typography>
          </Grid>
        </Card>
      </Modal> */}
      <UserInfoPopUp open={userInfoModalOpen} handleClose={handleCloseUserInfoModal} user={users[userIndex]} index={userIndex} handleToggle={handleToggleApproval}></UserInfoPopUp>

    </Card >
  );
};