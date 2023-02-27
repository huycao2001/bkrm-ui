import React from "react";

import { styled } from "@mui/material/styles";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";
import { useEffect } from "react";
//Table
import TableHeader from "../../../../components/TableCommon/TableHeader/TableHeader";
import TableWrapper from "../../../../components/TableCommon/TableWrapper/TableWrapper";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ThousandFormat } from "../../../../components/TextField/NumberFormatCustom";
// import TextField from '@mui/material/TextField';
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";

import { ThousandSeperatedInput } from "../../../../components/TextField/NumberFormatCustom";
import {
  Grid,
  Card,
  IconButton,
  Box,
  Divider,
  TableContainer,
  FormControlLabel,
  Switch,
  ListItem,
  //TableBody,
  Typography,
  ButtonBase,
  Avatar,
  Tooltip,
  //TextField,
  Button,
  CircularProgress,
  //Table,
} from "@material-ui/core";

import SearchProduct from "../../../../components/SearchBar/SearchProduct";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#2196f3",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      "& .MuiTextField-root": {
        marginTop: theme.spacing(2),
      },
    },
    headerTitle: {
      fontSize: "1.125rem",
    },
    typo: {
      marginBottom: 20,
    },
    card: {
      background: theme.customization.mode === "Light" ? null : grey[800],
      borderRadius: theme.customization.borderRadius,
      color: "#000000",
      borderWidth: 2,
    },
    background: {
      background:
        theme.customization.mode === "Light"
          ? theme.customization.primaryColor[50]
          : grey[700],
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1,
    },
  })
);

const AddRecipe = (props) => {
  const {
    products,
    handleAddIngredient,
    handleDeleteIngredient,
    handleUpdateIngredientQuantity,
    ingredients,
  } = props;

  const theme = useTheme();
  const classes = useStyles(theme);

  var total_standard_price = 0;
  for(var item of ingredients){
    total_standard_price+= item.quantity_required*item.standard_price;
  } 


   
  useEffect(() => {
    console.log("????" + JSON.stringify(ingredients));
  }, [ingredients]);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      style={{ margin: "10px", padding: "10px" }}
    >
      <SearchProduct
        products={products}
        handleSearchBarSelect={handleAddIngredient}
      />

      {ingredients?.length > 0 ? (
        <>
          <Table
            size="small"
            aria-label="purchases"
            sx={{
              borderBottom: 0,
              marginTop: "20px",
              marginRight: "10px",
              marginLeft: "0px",
            }}
          >
            <TableHead sx={{ borderBottom: 0 }}>
              <TableRow sx={{ borderBottom: 0 }}>
                <StyledTableCell>Mã SP</StyledTableCell>
                <StyledTableCell>Tên thành phần</StyledTableCell>
                <StyledTableCell>Số lượng</StyledTableCell>
                <StyledTableCell>Đơn vị</StyledTableCell>
                <StyledTableCell>Giá nhập</StyledTableCell>
                <StyledTableCell>Thành tiền</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {ingredients.map((ingredient) => (
                <StyledTableRow>
                  <StyledTableCell component="th" scope="row">
                    {ingredient.product_code}
                  </StyledTableCell>

                  <StyledTableCell component="th" scope="row">
                    {ingredient.name}
                  </StyledTableCell>

                  <StyledTableCell component="th" scope="row">
                    <ThousandSeperatedInput
                      value={ingredient.quantity_required}
                      style={{ maxWidth: "100px" }}
                      onChange={(e) => {
                        handleUpdateIngredientQuantity(
                          ingredient,
                          Number(e.target.value)
                        );
                      }}
                    />
                  </StyledTableCell>

                  <StyledTableCell component="th" scope="row">
                    {"Cái"}
                  </StyledTableCell>

                  <StyledTableCell component="th" scope="row">
                    <ThousandFormat value = {ingredient.standard_price}/>
                  </StyledTableCell>

                  <StyledTableCell component="th" scope="row">
                    <ThousandFormat value = {ingredient.standard_price * ingredient.quantity_required}  />
                  </StyledTableCell>

                  <StyledTableCell component="th" scope="row">
                    <IconButton
                      size="small"
                      onClick={() => {
                        handleDeleteIngredient(ingredient);
                      }}
                    >
                      <DeleteForeverOutlinedIcon />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>

          <Box sx={{ marginTop : '20px' }}>
            <Grid container justifyContent="flex-end" sx={{ p: 2 }}>
              <Typography variant="h4">
                Tổng giá vốn thành phần : {<ThousandFormat
                  value = {total_standard_price}
                />}
              </Typography>
            </Grid>
          </Box>


        </>
      ) : (
        <div>Vui lòng nhập nguyên liệu thành phần</div>
      )}
    </Grid>
  );
};

export default AddRecipe;
