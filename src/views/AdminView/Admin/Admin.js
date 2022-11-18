
// import React from react; 

import { useDispatch, useSelector } from "react-redux";
import useStyles from "../../../components/TableCommon/style/mainViewStyle";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Divider,
  Grid,
  ButtonBase,
  Avatar,
  Tooltip,
  Box
} from "@material-ui/core";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import adminApi from '../../../api/adminApi'
import Error from "@material-ui/icons/Error";
import { CheckCircle } from "@material-ui/icons";

export default function Admin() {
  const theme = useTheme();
  const classes = useStyles(theme);
  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const [users, setUsers] = useState([]);
  const [trialPeriod, setTrialPeriod] = useState(0);
  const [updateFlag, setUpdateFlag] = useState(true);

  const fetchUsers = async () => {
    const response = await adminApi.getUsers();
    console.log(JSON.stringify(response.users));
    setUsers(response.users);
    setTrialPeriod(response.trial_period);
  }

  useEffect(() => {
    fetchUsers();
  }, [updateFlag])

  const refreshView = () => {
    setUpdateFlag(!updateFlag);
  }

  const renderTable = () => {
    return (<TableContainer container component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Name</b></TableCell>
            <TableCell align="right"><b>Username</b></TableCell>
            <TableCell align="right"><b>Email</b></TableCell>
            <TableCell align="right"><b>Days since creation &#40;max {trialPeriod}&#41;</b></TableCell>
            <TableCell align="right"><b>Current status</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
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
                  onClick={() => { handleToggleApproval(user.uuid); }}
                  startIcon={user.approved_by_admin ? <CheckCircle /> : <Error />}
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

  const handleToggleApproval = async (userUuid) => {
    const response = await adminApi.toggleAprroveUser(userUuid);
    if (response) {
      refreshView();
    }
  };

  return (
    <Card className={classes.root} >
      <Grid container direction="row" justifyContent="space-between">
        <Typography className={classes.headerTitle} variant="h5" >
          Admin
        </Typography>
        <Grid className={classes.btngroup} sx={{ padding: "10px" }}>
          <Tooltip title="Refresh">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {refreshView();}}
            >
              Refresh
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid container>
        {renderTable()}
      </Grid>
    </Card>
  );
};