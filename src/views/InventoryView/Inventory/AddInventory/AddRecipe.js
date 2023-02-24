import React from 'react';
import {
    Grid,
    Card,
    Box,
    TableContainer,
    FormControlLabel,
    Switch,
    ListItem,
    TableBody,
    Typography,
    ButtonBase,
    Avatar,
    Tooltip,
    TextField,
    Button,
    CircularProgress,
    Table,
    Divider
  } from "@material-ui/core";


import SearchProduct from '../../../../components/SearchBar/SearchProduct';

const AddRecipe = (props) => {
    const {
        products,
        handleSelectSearchRecipe
    } = props;
  return (
    <Grid container justifyContent="center" alignItems="center" style = {{margin : "10px"}}>
        <SearchProduct
            products = {products}
            handleSearchBarSelect = {handleSelectSearchRecipe}
        />
    </Grid>


  )
}

export default AddRecipe;