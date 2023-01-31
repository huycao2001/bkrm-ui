import {
  Grid,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Button,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from "@material-ui/core";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
// import userApi from "../../api/userApi";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Paper from "@mui/material/Paper";
import FBIcon from "../../assets/img/icon/F&B.png";
import GroceryIcon from "../../assets/img/icon/grocery.png";
import { styled } from "@mui/material/styles";

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
const StoreInfo = (props) => {
  const { store_formik, cityList, districtList, wardList } = {
    ...props,
  };
  const [storeType, setStoreType] = useState("");

  const handleSetStoreTypes = e => {
    //console.log('changing' + store_formik.values.store_type + ' to ' + e.target.value);
    store_formik.values.store_type = e.target.value;
    //console.log('after changing : ' + store_formik.values.store_type );
  }

  return (
    <React.Fragment>
      <Grid container spacing={2} style={{ maxWidth: 600, marginTop: 10 }}>
        <Grid item xs={12}>
          <TextField
            name="name"
            variant="standard"
            required
            fullWidth
            label="Tên cửa hàng"
            onChange={store_formik.handleChange}
            value={store_formik.values.name}
            error={store_formik.touched.name && store_formik.errors.name}
            helperText={
              store_formik.touched.name ? store_formik.errors.name : null
            }
            onBlur={store_formik.handleBlur}
          />
        </Grid>
        <FormControl>
          <FormLabel align="center" id="demo-row-radio-buttons-group-label">
            Chọn loại cửa hàng
          </FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            defaultValue={store_formik.values.store_type}
          >
            <FormControlLabel
              value="fb"
              control={
                <Radio
                  disableFocusRipple
                  disableRipple
                  color="default"
                  checkedIcon={<FBRadioCheckedIcon />}
                  icon={<FBRadioIcon />}
                  {...props}
                />
              }
              label="F&B"
              labelPlacement="bottom"
              onChange={e => handleSetStoreTypes(e)}
              onClick={() => {
                setStoreType("fnb");
                //console.log("Store type : " + storeType);
              }}
            />
            <FormControlLabel
              value="grocery"
              control={
                <Radio
                  disableFocusRipple
                  disableRipple
                  color="default"
                  checkedIcon={<GroceryRadioCheckedIcon />}
                  icon={<GroceryRadioIcon />}
                  {...props}
                />
              }
              label="Tạp hoá"
              labelPlacement="bottom"
              onChange={e => handleSetStoreTypes(e)}
              onClick={() => {
                setStoreType("grocery");
                //console.log("Store type : " + storeType);
              }}
            />
          </RadioGroup>
        </FormControl>
        {/* <Grid item xs={5}>
          <TextField
            variant="standard"
            required
            fullWidth
            label="Số điện thoại"
            name="phone"
            onChange={store_formik.handleChange}
            value={store_formik.values.phone}
            error={store_formik.touched.phone && store_formik.errors.phone}
            helperText={store_formik.touched.phone ? store_formik.errors.phone : null}
            onBlur={store_formik.handleBlur}
          />
        </Grid> */}
        <Grid item xs={12}>
          <FormControl
            required
            fullWidth
            variant="standard"
            error={store_formik.touched.city && store_formik.errors.city}
          >
            <InputLabel>Tỉnh</InputLabel>
            <Select
              native
              name="city"
              label="Tỉnh"
              value={store_formik.values.city}
              onChange={store_formik.handleChange}
              onBlur={store_formik.handleBlur}
            >
              <option value="" />
              {cityList.map((city) => (
                <option value={city.id}>{city.name}</option>
              ))}
            </Select>
            {store_formik.touched.city ? (
              <FormHelperText>{store_formik.errors.city}</FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl
            required
            fullWidth
            variant="standard"
            error={
              store_formik.touched.district && store_formik.errors.district
            }
          >
            <InputLabel>Huyện</InputLabel>
            <Select
              native
              label="Huyện"
              name="district"
              value={store_formik.values.district}
              onChange={store_formik.handleChange}
              onBlur={store_formik.handleBlur}
            >
              <option value="" />
              {districtList.map((district) => (
                <option value={district.id}>{district.name}</option>
              ))}
            </Select>
            {store_formik.touched.district ? (
              <FormHelperText>{store_formik.errors.district}</FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl
            required
            fullWidth
            variant="standard"
            error={store_formik.touched.ward && store_formik.errors.ward}
          >
            <InputLabel htmlFor="ward">Xã</InputLabel>
            <Select
              native
              label="Xã"
              name="ward"
              value={store_formik.values.ward}
              onChange={store_formik.handleChange}
              onBlur={store_formik.handleBlur}
            >
              <option aria-label="None" value="" />
              {wardList.map((ward) => (
                <option value={ward.id}>{ward.name}</option>
              ))}
            </Select>
            {store_formik.touched.ward ? (
              <FormHelperText>{store_formik.errors.ward}</FormHelperText>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="address"
            variant="standard"
            required
            fullWidth
            label="Địa chỉ"
            onChange={store_formik.handleChange}
            value={store_formik.values.address}
            onBlur={store_formik.handleBlur}
            error={store_formik.touched.address && store_formik.errors.address}
            helperText={
              store_formik.touched.address ? store_formik.errors.address : null
            }
          />
        </Grid>
      </Grid>{" "}
    </React.Fragment>
  );
};

export default StoreInfo;
