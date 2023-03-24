import React from "react";

import { styled } from "@mui/material/styles";
import { useTheme, makeStyles, createStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//Table
import TableHeader from "../../../../components/TableCommon/TableHeader/TableHeader";
import TableWrapper from "../../../../components/TableCommon/TableWrapper/TableWrapper";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ThousandFormat } from "../../../../components/TextField/NumberFormatCustom";
import {Select, TreeSelect} from 'antd';

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
import productApi from "../../../../api/productApi";

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
    // handleAddIngredient,
    // handleDeleteIngredient,
    // handleUpdateIngredientQuantity,
    ingredients,
    setIngredients
  } = props;

  const theme = useTheme();
  const classes = useStyles(theme);

  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;

  var total_standard_price = 0;
  for(var ingredient of ingredients){
    if(ingredient.uom){
      total_standard_price+= ingredient.quantity_required * ingredient.standard_price * 1/ingredient.conversion;
    }else{
      total_standard_price+= ingredient.quantity_required * ingredient.standard_price;
    }
    
  } 


  const [listUOMs, setListUOMs] = useState([]); 

  const handleGetUOMs = async (product_uuid) => {
    try{
      const response = await productApi.getUOMs(store_uuid, product_uuid); 
      console.log("response go : " + JSON.stringify(response)); 
      var uoms = response.data.unit_of_measurements;
      if(uoms.length > 0 ){
        var defaultUOM = {
          value :product_uuid, 
          label : products.find(product => product.uuid === product_uuid).quantity_per_unit,
          parent : product_uuid,
          conversion : 1
        }


        var newMeasurement = {
          product_uuid : product_uuid, 
          uoms : [ defaultUOM, ...uoms.map (uom => { 
            return {
              value : uom.uuid,
              label : uom.quantity_per_unit,
              parent : product_uuid,
              conversion : uom.conversion_number

            }
          })]
        }
        setListUOMs([ newMeasurement, ...listUOMs]); 
      }

    }
    catch(e){
      console.log("get uoms failed : " + e); 
    }
  }


  const handleFindUOMs = (product_uuid) => { 
    const uomList =listUOMs.find(item => item.product_uuid === product_uuid); 
    if(uomList){
      return uomList.uoms;

    }
    return [];
  } 


  const handleDeleteUOMs = (product_uuid) => { 
    setListUOMs(prev => { 
      var newList = [...listUOMs]; 
      newList = newList.filter(item => item.product_uuid !== product_uuid);
      return newList;
    })
  }

  useEffect(() => {
    console.log("uoms : " + JSON.stringify(listUOMs)); 
  }, [listUOMs]);


  const handleAddIngredient = (selectedItem) => {
    // find the item in the list 
    const input = ingredients.find((recipeInput) => recipeInput.uuid === selectedItem.uuid);
    if(input){
      //input.quantity_required += 1;
      setIngredients(prevIngredients => {
        const updatedIngredients = prevIngredients.map(ingredient => {
          if (ingredient.uuid === input.uuid) {
            return {...ingredient, quantity_required: ingredient.quantity_required + 1};
          }
          return ingredient;
        });
        return updatedIngredients;
      });
    } else { // if not found -> add new
      const newItem =  {
        name : selectedItem.name,
        product_code : selectedItem.product_code,
        standard_price: selectedItem.standard_price,
        list_price : selectedItem.list_price,
        uuid : selectedItem.uuid, 
        quantity_required : 1,
        img_urls : selectedItem.img_urls
      }
      handleGetUOMs(selectedItem.uuid);
      setIngredients(prevIngredients => [...prevIngredients, newItem]); 
    }
  }



  const handleDeleteIngredient = (selectedItem) => {
    const newIngredients = ingredients.filter((item) => {
      return item.uuid !== selectedItem.uuid
    });

    handleDeleteUOMs(selectedItem.uuid);
    setIngredients(newIngredients);
  }


  const handleUpdateIngredientQuantity = (selectedItem, newQuantity) => {
    const input = ingredients.find((recipeInput) => recipeInput.uuid === selectedItem.uuid);
    if(input){
      setIngredients(prevIngredients => {
        const updatedIngredients = prevIngredients.map(ingredient => {
          if (ingredient.uuid === input.uuid) {
            return {...ingredient, quantity_required: newQuantity};
          }
          return ingredient;
        });
        return updatedIngredients;
      });
    }
  }

   
  useEffect(() => {
    console.log("ingredients : " + JSON.stringify(ingredients));
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
                <StyledTableRow key = {ingredient.uuid}>
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
                  {handleFindUOMs(ingredient.uuid).length > 0 ?  <Select
                      defaultValue={handleFindUOMs(ingredient.uuid)[0].label}
                      style={{ width: '100%'}}  
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto',zIndex:100000000  }}
                      onChange = {(uomUuid, object) => {
                          //tableFormik.values.table_group_name = value;
                          console.log("value is " + uomUuid);
                          console.log("label is "  + JSON.stringify(object))

                          // set Ingredient
                          const newIngredients = ingredients.map((item) => {
                            if (item.uuid === object.parent) {
                              console.log("found it")

                              return {
                                ...item,
                                standard_uom_price : item.standard_price * 1/object.conversion,
                                uom: uomUuid,
                                conversion : object.conversion
                              };
                            } else {
                              console.log("wait why ?")
                              return item;
                            }
                          });
                          
                          setIngredients(newIngredients);
                          

                      } }
                      options={handleFindUOMs(ingredient.uuid) }
                    /> : "Cái"}

                    {/* {"cais"} */}
                  </StyledTableCell>

                  <StyledTableCell component="th" scope="row">
                    {ingredient.uom ? <ThousandFormat value = {ingredient.standard_price * 1/ingredient.conversion}/> : 
                      <ThousandFormat value = {ingredient.standard_price }/>
                    }
                  </StyledTableCell>

                  <StyledTableCell component="th" scope="row">
                  {ingredient.uom ? <ThousandFormat value = {ingredient.standard_price* ingredient.quantity_required  * 1/ingredient.conversion}/> : 
                      <ThousandFormat value = {ingredient.standard_price * ingredient.quantity_required }/>
                    }
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
