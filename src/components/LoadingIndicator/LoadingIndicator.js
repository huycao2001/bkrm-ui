import React, { Component } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import { usePromiseTracker } from "react-promise-tracker";
const LoadingIndicator = (props) => {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress && (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={3}>
          <CircularProgress />
        </Grid>
      </Grid>
    )
  );
};
export default LoadingIndicator;
