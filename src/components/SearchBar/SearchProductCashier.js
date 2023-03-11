/* eslint-disable no-use-before-define */
import React, { useRef, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Box, Button, Grid, InputAdornment, Typography } from "@material-ui/core";
import productApi from "../../api/productApi";
import { useEffect } from "react";
import SearchIcon from "@material-ui/icons/Search";
import defaultProduct from "../../assets/img/product/default-product.png"
import { VNDFormat } from "../TextField/NumberFormatCustom";

export default function SearchProductCashier(props) {
//   const {
//     //searchApiCall,
//     onSelect,
//     renderInput,
//     renderOption,
//     getOptionLabel,
//     value,
//     nextRef,
//     handleDefaultSelect
//   } = props;


const {
  products,
  setProducts
} = props


const FormatedImage = (props) => {


    return (
      <Box component="img" sx={{height: 53, width: 53,  borderRadius: 10, marginRight: 15, }} src={props.url ? props.url : defaultProduct} />
  
    );
  };
const renderNameInput = (params) => {
    return (
      <TextField
        {...params}
        required
        label="Tìm kiếm sp mẫu bằng tên hoặc mã vạch"
        variant="outlined"
        autoFocus
        size="small"
        sx = {{color : 'black'}}
        InputProps={{
          ...params.InputProps,
          sx : {color : "black"},
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),

        }}
      />
    );
  };

  const renderOptionTest = (option) => {
    return (
      <Grid fullWidth container direction="row">
        <Grid item xs={3}>
          <FormatedImage url={option.img_url} />
        </Grid>
        <Grid item xs={9} container direction="column">
          <Typography variant="h5">{option.name}</Typography>
          <Typography variant="body2"> Giá bán: {<VNDFormat value = {option.list_price}/>}</Typography>
          <Typography variant="body2"> Tồn kho: {option.branch_quantity}</Typography>
        </Grid>
      </Grid>
    );
  };


  const getOptionLabel = (option) => {
    if (option.name) {
      return option.name ;
    }
    return option;
  };
  // const [options, setOptions] = useState([
  //   {name : "do uong 1", img_url : "http://localhost:8000/storage/product-images/wBdzpgaRD9bHp4tMvOOq8MWl24e0ySzirxxCLYp5.jpg"}, 
  //   {name : "do uong 2", img_url : "http://localhost:8000/storage/product-images/wBdzpgaRD9bHp4tMvOOq8MWl24e0ySzirxxCLYp5.jpg"},
  //   {name : "do uong 3", img_url : "http://localhost:8000/storage/product-images/wBdzpgaRD9bHp4tMvOOq8MWl24e0ySzirxxCLYp5.jpg"}, 



  // ]);
  const [searchValue, setSearchValue] = useState("");

//   const loadingData = async (e, searchKey) => {
//     setSearchValue(searchKey);
//   };


//   useEffect(() => {
//     const fetchData = async (searchKey = searchValue) => {
//       if (searchKey !== "") {
//         try {
//           const key = searchKey.slice(0, searchKey.indexOf("("))
//           const response = await searchApiCall(key);
//           setOptions(response.data);
//           onSelect(response.data[0])
//         } catch (error) {
//           console.log(error)
//         }
//       }
//     };
//     const timer = setTimeout(() => fetchData(), 500);
//     return () => clearTimeout(timer);
//   }, [searchValue]);
  return (
    <Autocomplete
      options={products}
      freeSolo
      fullWidth
      style = {{width : "300px", color : "black",
      marginLeft : "20px",
      "& label.Mui-focused": {
        color: "black"
      },
      "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
          borderColor: "black"
        }
      }}}
      getOptionLabel={getOptionLabel}
      renderOption={renderOptionTest}
      //onInputChange={loadingData}
      autoSelect
      getOptionSelected={(option, value) => option.name === value.name}
      onChange={(e, value) => {
        console.log("value " + value)
      }}
      size="small"
      renderInput={renderNameInput}

    />
  );
}
