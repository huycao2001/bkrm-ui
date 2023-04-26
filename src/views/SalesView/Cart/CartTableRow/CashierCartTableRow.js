import React, { useEffect, useState } from "react";
//import style
import useStyles from "../../../../components/TableCommon/style/mainViewStyle";
//impỏrt library
import {
  Box,
  TextField,
  ListItem,
  IconButton,
  TableRow,
  TableCell,
  Tooltip,
  Chip,
  Button,
  Typography,
  Grid,
  Paper,
  Card
} from "@material-ui/core";
import { BorderColor, DeleteOutline } from "@material-ui/icons";
import {useTheme,withStyles} from "@material-ui/core/styles";

import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone';
//import project
import * as Input from "../../../../components/TextField/NumberFormatCustom";
import ButtonQuantity from "../../../../components/Button/ButtonQuantity";
import { VNDFormat } from "../../../../components/TextField/NumberFormatCustom";
import DiscountPopUp from "../DiscountPopup/DiscountPopup";
import icon from "../../../../assets/img/product/tch.jpeg";
// import SelectBatch from "../../../../components/SelectBatch/SelectBatch";
import SelectBatch from "../../../../components/SelectBatch/SelectBatch";
import { useSelector } from "react-redux";

import MoreInfo from "../../../../components/MoreInfo/MoreInfo";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import defaultProduct from "../../../../assets/img/product/default-product.png";
import setting from "../../../../assets/constant/setting";

export const CashierCartTableRow = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const haveDiscount = true;
  const info = useSelector((state) => state.info);
  const branch = info.branch;
  const branchs = info.store.branches
  const {
    row,
    // branchs,
    discountData,
    handleDeleteItemCart,
    handleChangeItemQuantity,
    handleUpdateBatches,
    handleChangeItemPrice,
    mini,
    imageType,
    index,
    typeShow,
    showImage
  } = props;
  //console.log("cart table row", row)
  const updateQuantity = (newQuantity) => {
    handleChangeItemQuantity(row.uuid, newQuantity);
  };
  const [openDiscount, setOpenDiscount] = React.useState(false);
  const handleOpenDiscount = () => {
    setOpenDiscount(!openDiscount);
  };

  const [selectBatchOpen, setSelectBatchOpen] = useState(false);
  const [selectedBatches, setSelectedBatches] = useState([]);

  useEffect(() => {
    if (row.batches?.length >= 1) {
      setSelectedBatches([{ ...row.batches[0], additional_quantity: 0 }]);
    }
  }, []);

  useEffect(() => {

    if(!handleUpdateBatches) return;
    let total = 0;
    selectedBatches.forEach((batch) => {
      total += Number(batch.additional_quantity);
    });

    updateQuantity(total);
    if(handleUpdateBatches){
      handleUpdateBatches(row.uuid, selectedBatches);
    }
    
  }, [selectedBatches]);

  const handleSelectBatches = (batches) => {
    const newBatches = [];
    selectedBatches.forEach((selectedBatch) => {
      const newBatch = batches.find(
        (batch) => batch.batch_code === selectedBatch.batch_code
      );
      if (newBatch) {
        newBatches.push({
          ...selectedBatch,
          additional_quantity:
            Number(selectedBatch.additional_quantity) +
            Number(newBatch.additional_quantity),
        });
      } else {
        newBatches.push(selectedBatch);
      }
    });
    batches.forEach((newBatch) => {
      if (
        !newBatches.find((batch) => newBatch.batch_code === batch.batch_code)
      ) {
        newBatches.push(newBatch);
      }
    });

    setSelectedBatches(newBatches);
  };

  const store_setting = info.store.general_configuration
    ? JSON.parse(info.store.general_configuration)
    : setting;

  const canFixPriceSell = store_setting?.canFixPriceSell;

  const [show, setShow] = React.useState(false);

  const findBranchQuantity = (id) => {
    const rs = row.branch_inventories.find(
      (x) => x.uuid === id
    )?.quantity_available;
    if (rs) {
      return rs;
    } else {
      return 0;
    }
  };

  var color = theme.customization.mode === "Light"? typeShow==='list'?'#000':null: null
  return (
    <>
      <TableRow style={{marginTop : "2px"}}>
        <Paper elevation={4} style={{
          marginTop : "8px", 
          padding: '10px 16px',
          border : "solid 2px",
          borderColor : theme.palette.primary.main,
          borderRadius : "10px"
        }}>
          <Grid 
            container
            direction="row"
            justifyContent="space-between"
          >
            <Grid item container  direction = 'row' justifyContent="flex-start" flex={1} xs={4} alignItems = "center"> 
              
              {<Typography style={!mini?{}:{fontWeight:imageType?600:null,color:color}}>{ index + '.' +row.name}</Typography>} 
            </Grid>


            <Grid container item xs={4} alignItems = "center" >
            <ButtonQuantity
              // isMini={mini?true:false}
              miniCart={mini}
              quantity={row.quantity}
              setQuantity={updateQuantity}
              branch_quantity={row.branch_quantity}
              isManageInventory={store_setting?.inventory.status}
            />
            </Grid>

            <Grid container item  xs={3} alignItems = "center">
              {!mini?<VNDFormat value={row.unit_price * row.quantity} style={{color:color}}/>:<Input.ThousandFormat value={row.unit_price * row.quantity} style={{paddingLeft:imageType? 0:20, color:color}}/>}
            </Grid>

            <Grid item  xs={1} justifyContent="flex-end" >
              <IconButton aria-label="expand row" size="small" style={{marginLeft:10}}>
                <DeleteForeverTwoToneIcon
                  onClick={() => handleDeleteItemCart(row.uuid)}
                />
            </IconButton>

            </Grid>
          </Grid>

          {
            row.kitchen_notified_quantity != null ? 
            <Box>
            <Grid 
              container
              direction="column"
            >
              <Box>
                  {"Đã thông báo cho bếp : " + row.kitchen_notified_quantity}
              </Box>

              <Box>
              {"Đã cung ứng : " + + row.kitchen_prepared_quantity}
              </Box>

            </Grid>
          </Box> : null 
          }
        </Paper>

      </TableRow>
      {/* {row.has_batches ? (
        <TableRow>
          <TableCell colSpan={1}></TableCell>
          <TableCell colSpan={10}>
            <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => setSelectBatchOpen(true)}
                
              >
                Chọn lô
              </Button>
              {selectedBatches.map((batch) => (
                <Tooltip title={`Tồn kho - ${batch.quantity}`}>
                  <Chip
                    label={`${
                      batch?.batch_code ? batch?.batch_code : "Mới"
                    } - ${batch?.expiry_date ? batch?.expiry_date : ""} - ${
                      batch.additional_quantity
                    }`}
                    key={batch.id}
                    onDelete={() => {
                      const newBatches = selectedBatches.filter(
                        (selectedBatch) => selectedBatch.id !== batch.id
                      );
                      setSelectedBatches(newBatches);
                    }}
                    color={batch.is_new ? "primary" : "secondary"}
                    deleteIcon={<DeleteOutline />}
                    variant="outlined"
                  />
                </Tooltip>
              ))}
              {selectBatchOpen && (
                <SelectBatch
                  handleSubmit={handleSelectBatches}
                  row={row}
                  handleClose={() => setSelectBatchOpen(false)}
                />
              )}
            </div>
          </TableCell>
        </TableRow>
      ) : null} */}
    </>
  );
};


