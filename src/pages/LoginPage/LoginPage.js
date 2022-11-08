import React from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/slice/authSlice";
import Typography from "@material-ui/core/Typography";
import Box from "@mui/material/Box";
import useStyles from "./styles";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";

import Image from "../../asset/images/background.jpg";
const styles = {
  paperContainer: {
    backgroundImage: `url(${Image})`,
  },
};

const LoginPage = (props) => {
  const [isOwner, setIsOwner] = useState(true);
  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <Paper style={styles.paperContainer}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Paper className={classes.container}>
          <Box className={classes.paper}>
            <Typography variant="h3" gutterBottom color="textSecondary">
              BKRM HCMUT
            </Typography>
            <Typography variant="h5">Đăng nhập</Typography>
            <Box className={classes.form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  dispatch(authActions.logIn());
                }}
              >
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  label="Tên đăng nhập"
                  name="user_name"
                  autoFocus
                  // value={loginFormik.values.user_name}
                  // onChange={loginFormik.handleChange}
                  // error={
                  //   loginFormik.touched.user_name && loginFormik.errors.user_name
                  // }
                  // helperText={
                  //   loginFormik.touched.user_name
                  //     ? loginFormik.errors.user_name
                  //     : null
                  // }
                  // onBlur={loginFormik.handleBlur}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Mật khẩu"
                  type="password"
                  // value={loginFormik.values.password}
                  // onChange={loginFormik.handleChange}
                  // error={
                  //   loginFormik.touched.password && loginFormik.errors.password
                  // }
                  // helperText={
                  //   loginFormik.touched.password
                  //     ? loginFormik.errors.password
                  //     : null
                  // }
                  //onBlur={loginFormik.handleBlur}
                />
                {/* <Grid justifyContent="flex-end"> */}
                {/* <Box style={{ display: "flex", justifyContent: "flex-end" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={isOwner}
                        color="primary"
                        onChange={() => setIsOwner(!isOwner)}
                      />
                    }
                    label="Nhân viên"
                    labelPlacement="start"
                  />
                </Box> */}
                {/* </Grid> */}
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">
                    Chọn loại cửa hàng
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="F&B"
                      control={<Radio />}
                      label="F&B"
                    />
                    <FormControlLabel
                      value="Tạp hoá"
                      control={<Radio />}
                      label="Tạp hoá"
                    />
                  </RadioGroup>
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  // && Object.keys(loginFormik.touched).length > 0
                  // disabled={!loginFormik.isValid}
                  // onClick={() => {
                  //   if (isOwner) {
                  //     dispatch(
                  //       logInHandler(
                  //         loginFormik.values.user_name,
                  //         loginFormik.values.password
                  //       )
                  //     );
                  //   } else {
                  //     dispatch(
                  //       empLogInHandler(
                  //         loginFormik.values.user_name,
                  //         loginFormik.values.password
                  //       )
                  //     );
                  //   }
                  // }}
                >
                  Đăng nhập
                </Button>
              </form>
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Typography
                    style={{ textDecoration: "none" }}
                    component={Link}
                    to="/signup"
                  >
                    Chưa có tài khoản? Đăng kí cửa hàng mới
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Paper>
  );
};

export default LoginPage;
