import React, { useEffect } from "react";
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
import { Link } from "react-router-dom";
import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "../../assets/img/background.jpg";
import { logInHandler } from "../../store/actionCreator";
import userAPi from "../../api/userApi";
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";
import { styled } from "@mui/material/styles";
import EmployeeIcon from "../../assets/img/ava/employee.png";
import OwnerIcon from "../../assets/img/ava/owner.png";
import AdminIcon from "../../assets/img/ava/admin.png";
import FBIcon from "../../assets/img/icon/F&B.png";
import GroceryIcon from "../../assets/img/icon/grocery.png";
import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import Backdrop from "@mui/material/Backdrop";

const styles = {
  paperContainer: {
    backgroundImage: `url(${Image})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center center",
  },
};

const EmployeeRadioIcon = styled("span")(({ theme }) => ({
  width: 130,
  height: 150,
  backgroundImage: `url(${EmployeeIcon})`,
  backgroundSize: "120px 140px",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundColor: "transparent",
}));

const OwnerRadioIcon = styled("span")(({ theme }) => ({
  width: 130,
  height: 150,
  backgroundImage: `url(${OwnerIcon})`,
  backgroundSize: "130px 140px",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundColor: "transparent",
}));

const AdminRadioIcon = styled("span")(({ theme }) => ({
  width: 130,
  height: 150,
  backgroundImage: `url(${AdminIcon})`,
  backgroundSize: "140px 140px",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundColor: "transparent",
}));

const OwnerRadioCheckedIcon = styled(OwnerRadioIcon)({
  borderRadius: "10%",
  backgroundColor: "#ebf1f5",
});

const EmployeeRadioCheckedIcon = styled(EmployeeRadioIcon)({
  borderRadius: "10%",
  backgroundColor: "#ebf1f5",
});

const AdminRadioCheckedIcon = styled(AdminRadioIcon)({
  borderRadius: "10%",
  backgroundColor: "#ebf1f5",
});

const FBRadioIcon = styled("span")(({ theme }) => ({
  width: 130,
  height: 150,
  backgroundImage: `url(${FBIcon})`,
  backgroundSize: "140px 140px",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundColor: "transparent",
}));

const GroceryRadioIcon = styled("span")(({ theme }) => ({
  width: 130,
  height: 150,
  backgroundImage: `url(${GroceryIcon})`,
  backgroundSize: "140px 140px",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundColor: "transparent",
}));

const FBRadioCheckedIcon = styled(FBRadioIcon)({
  borderRadius: "10%",
  backgroundColor: "#ebf1f5",
});

const GroceryRadioCheckedIcon = styled(GroceryRadioIcon)({
  borderRadius: "10%",
  backgroundColor: "#ebf1f5",
});

const LoginPage = (props) => {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  const [role, setRole] = useState("owner");
  const [storeType, setStoreType] = useState("");
  const classes = useStyles();
  const dispatch = useDispatch();

  const loginFormik = useFormik({
    initialValues: {
      user_name: "",
      password: "",
      storeType: "",
      role: "",
    },
    validationSchema: Yup.object({
      user_name: Yup.string().required("Nhập tên đăng nhập"),
      password: Yup.string().required("Nhập mật khẩu"),
    }),
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('user_name'),
      password: data.get('password'),
    });
  };
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
        <Paper className={classes.container} >
          <FormControl>
            <FormLabel
              sx={{ fontSize: 20 }}
              align="center"
              id="demo-row-radio-buttons-group-label"
            >
              Chọn loại tài khoản
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              defaultValue={role}
            //style={{ display: "flex" }}
            >
              <FormControlLabel
                value="owner"
                control={
                  <Radio
                    disableFocusRipple
                    disableRipple
                    color="default"
                    checkedIcon={<OwnerRadioCheckedIcon />}
                    icon={<OwnerRadioIcon />}
                    {...props}
                  />
                }
                label="Chủ cửa hàng"
                labelPlacement="bottom"
                onClick={() => {
                  setRole("owner");
                }}
              />
              <FormControlLabel
                value="employee"
                control={
                  <Radio
                    disableFocusRipple
                    disableRipple
                    color="default"
                    checkedIcon={<EmployeeRadioCheckedIcon />}
                    icon={<EmployeeRadioIcon />}
                    {...props}
                  />
                }
                label="Nhân viên"
                labelPlacement="bottom"
                onClick={() => {
                  setRole("employee");
                }}
              />
              <FormControlLabel
                value="admin"
                control={
                  <Radio
                    disableFocusRipple
                    disableRipple
                    color="default"
                    checkedIcon={<AdminRadioCheckedIcon />}
                    icon={<AdminRadioIcon />}
                    {...props}
                  />
                }
                label="Admin"
                labelPlacement="bottom"
                onClick={() => {
                  setRole("admin");
                }}
              />
            </RadioGroup>
          </FormControl>
          {/* <Typography align="center" variant="h2">
            Xin chào {role}-san !!!
          </Typography> */}
          <Box className={classes.form} component="form" onSubmit={(e) => {
            e.preventDefault();
            handleToggle();
            //if (role) {
            dispatch(
              logInHandler(
                loginFormik.values.user_name,
                loginFormik.values.password,
                role
              )
            );

          }}>

            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              sx={{ marginRight: 5, width: 300, marginTop: 3 }}
              variant="standard"
              margin="normal"
              required
              fullWidth
              label="Tên đăng nhập"
              name="user_name"
              autoFocus
              value={loginFormik.values.user_name}
              onChange={loginFormik.handleChange}
              error={
                loginFormik.touched.user_name && loginFormik.errors.user_name
              }
              helperText={
                loginFormik.touched.user_name
                  ? loginFormik.errors.user_name
                  : null
              }
              onBlur={loginFormik.handleBlur}
            />

            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ marginRight: 5, width: 300 }}
              variant="standard"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              value={loginFormik.values.password}
              onChange={loginFormik.handleChange}
              error={
                loginFormik.touched.password && loginFormik.errors.password
              }
              helperText={
                loginFormik.touched.password
                  ? loginFormik.errors.password
                  : null
              }
              onBlur={loginFormik.handleBlur}
            />

            <button type="submit" style={{ display: 'none' }}>Submit</button> {/*To help hit enter when submit the form */}
          </Box>
          <Button
            sx={{ marginTop: 2, width: 300, borderRadius: 10 }}
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            // && Object.keys(loginFormik.touched).length > 0
            disabled={!loginFormik.isValid}
            onClick={() => {
              handleToggle();
              //if (role) {
              dispatch(
                logInHandler(
                  loginFormik.values.user_name,
                  loginFormik.values.password,
                  role
                )
              );

            }}
          >
            Đăng nhập
          </Button>
          <Grid container justifyContent="flex-end">
            <Typography
              style={{
                textDecoration: "none",
                marginTop: 5,
                alignItems: "flex-end",
              }}
              component={Link}
              to="/signup"
            >
              Chưa có tài khoản? Đăng kí cửa hàng mới
            </Typography>
          </Grid>
        </Paper>
      </Grid >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <LoadingIndicator />
      </Backdrop>
    </Paper >
  );
};

export default LoginPage;
