import React, { useEffect, useState } from "react";
import { Snackbar, Button } from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert from "@material-ui/lab/Alert";
import { statusAction } from "../../store/slice/statusSlice";
import { useDispatch, useSelector } from "react-redux";
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const SnackBar = () => {
  const isOpen = useSelector((state) => state.status.open);
  const isSuccess = useSelector((state) => state.status.status);
  const message = useSelector((state) => state.status.message);
  const dispatch = useDispatch();
  useEffect(() => {
    const closeStatus = () => {
      dispatch(statusAction.closeStatus());
    };
    if (isOpen) {
      setTimeout(closeStatus, 6000);
    }
  }, [isOpen, dispatch]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(statusAction.closeStatus());
  };


  return (
    <React.Fragment>
      {isSuccess == 1 ? (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={isOpen}
          
        >
          <Alert onClose={handleClose} severity="success">{message} </Alert>
        </Snackbar>
      ) : isSuccess == 0 ? (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={isOpen}
          
        >
          <Alert onClose={handleClose} severity="error">{message}</Alert>
        </Snackbar>
      ) : null}
    </React.Fragment>
  );
};

export default SnackBar;
