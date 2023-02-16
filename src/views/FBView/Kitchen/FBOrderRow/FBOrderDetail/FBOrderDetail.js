import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { statusAction } from "../../../../../store/slice/statusSlice";
import {
  Button,
  TextField,
  Typography,
  Grid,
  Box,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Dialog,
  FormControlLabel,
  Switch,
  Collapse,
  Paper,
  Card,
  CardHeader,
  Checkbox,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from "@material-ui/core";
import ConfirmPopUp from "../../../../../components/ConfirmPopUp/ConfirmPopUp";
import fbTableApi from "../../../../../api/fbTableApi";
import fbOrderApi from "../../../../../api/fbOrderApi";
import ButtonQuantity from "../../../../../components/Button/ButtonQuantity";
// import FBOrderButtonQuantity from "./FBOrderButtonQuantity";
import { trackPromise } from "react-promise-tracker";

// import UpdateTable from "./UpdateTable";

const FBOrderDetail = (props) => {
  const {
    openRow,
    setReload,
    handleSetReloadTableGroupEditor,
    refetch,
    ogData
  } = props;

  let { row } = props;

  const dispatch = useDispatch();
  const info = useSelector((state) => state.info);
  const store_uuid = info.store.uuid;
  const branch_uuid = info.branch.uuid;
  const [openTableUpdate, setOpenTableUpdate] = useState(false);
  const [openDeleteTableConfirm, setOpenDeleteTableConfirm] = useState(false);

  const [prepareList, setPrepareList] = useState([{ product_id: 0, product_name: 'None', prepared_quantity: 0, ordered_quantity: 0 }]);
  const [prepareMap, setPrepareMap] = useState(new Map());
  const [regen, setRegen] = useState(false);

  // initially generate a list to use based on a getAllFBOrders response, and a map (to facilitate data manipulation)
  const initGeneratePrepareList = (r) => {
    console.log(row);
    let tmpPrepList = [];
    let tmpPrepMap = new Map();
    // console.log(r);
    r.fb_order_details.forEach((element) => {
      let tmpPrepObj = {
        product_id: element.product_id,
        prepared_quantity: element.prepared_quantity,
        product_name: element.product_name,
        ordered_quantity: element.ordered_quantity,
        quantity_to_prepare: 0
      }
      tmpPrepList.push(tmpPrepObj);
      tmpPrepMap.set(element.product_id, { product_name: element.product_name, prepared_quantity: element.prepared_quantity, ordered_quantity: element.ordered_quantity, quantity_to_prepare: 0 });
    });
    setPrepareList(tmpPrepList);
    console.table(tmpPrepList);
    setPrepareMap(tmpPrepMap);
    return 0;
  }

  // whenever the qtt is changed (through btn press or something), update the map and rebuild the list
  const handleUpdatePreparedQuantity = (product_id, new_quantity) => {
    let tmpPrepMap = new Map(prepareMap);
    let item = tmpPrepMap.get(product_id);
    tmpPrepMap.set(product_id, { product_name: item.product_name, prepared_quantity: item.prepared_quantity, ordered_quantity: item.ordered_quantity, quantity_to_prepare: new_quantity });
    let tmpPrepList = [];
    tmpPrepMap.forEach((val, key) => {
      let tmpPrepObj = {
        product_id: key,
        prepared_quantity: val.prepared_quantity,
        product_name: val.product_name,
        ordered_quantity: val.ordered_quantity,
        quantity_to_prepare: val.quantity_to_prepare
      }
      tmpPrepList.push(tmpPrepObj);
    })
    setPrepareMap(tmpPrepMap);
    setPrepareList(tmpPrepList);
  }

  useEffect(() => {
    initGeneratePrepareList(row);
    console.log("OGData changed");
  }, [ogData]);

  const handleCloseTableUpdate = () => {
    setOpenTableUpdate(false);
  }

  const handlePrepareOrder = async () => {
    try {
      const response = await trackPromise(
        fbOrderApi.prepareFBOrder(
          store_uuid,
          branch_uuid,
          row.uuid,
          {
            items: prepareList
          }
        )
      );
      row = response.data.fb_order;
      dispatch(statusAction.successfulStatus("Cập nhật đơn FB thành công"));
    } catch (error) {
      console.log(error);
      dispatch(statusAction.successfulStatus("Cập nhật đơn FB thất bại"));
    }
    refetch();
  }

  return (
    <Collapse
      in={row.uuid === openRow}
    >
      {/* {openTableUpdate && <UpdateTable
                table = {row}
                openTableUpdate = {openTableUpdate}
                handleCloseTableUpdate = {handleCloseTableUpdate}
                setReload={setReload}
                handleSetReloadTableGroupEditor = {handleSetReloadTableGroupEditor}
            />} */}

      {/* {openDeleteTableConfirm && <ConfirmPopUp
        open={openDeleteTableConfirm}
        handleClose={() => {
          setOpenDeleteTableConfirm(false)
        }}
        handleConfirm={handleDeleteTable}
        message={
          <Typography>
            Xóa vĩnh viễn bàn ?
          </Typography>
        }
      />} */}
      <Box margin={1}>
        <Typography
          variant="h3"
          gutterBottom
          component="div"
        //   className={classes.typo}
        >

          Tên bàn:  {row.table.name}
        </Typography>

        <Grid container direction="row" justifyContent="flex-start">
          <Grid container direction='column' item xs={12} sm={6}>
            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={6}>
                <Typography variant="h5" gutterBottom component="div">
                  Ghi chú:
                </Typography>
              </Grid>
              <Grid item sm={3}>
                <Typography variant="body1" gutterBottom component="div">
                  {row.note}
                </Typography>
              </Grid>
            </Grid>
            <Divider sx={{ marginBottom: "2px", width: '70%' }} />

            <Grid container direction="row" justifyContent="flex-start">
              <Grid item xs={7} sm={6}>
                <Typography variant="h5" gutterBottom component="div">
                  Số món:
                </Typography>
              </Grid>
              <Grid item sm={3}>
                <Typography variant="body1" gutterBottom component="div">
                  {prepareList.length}
                </Typography>
              </Grid>
            </Grid>

            {prepareList.map((prepItem, index) => {
              return (
                <React.Fragment>
                  <Divider sx={{ marginBottom: "2px", width: '70%' }} />

                  <Grid container direction="row" justifyContent="flex-start">
                    <Grid item xs={7} sm={6}>
                      <Typography variant="h3" gutterBottom component="div">
                        {prepItem.product_name}
                      </Typography>
                    </Grid>
                    <Grid item sm={3}>
                      <Typography variant="h3" gutterBottom component="div">
                        {prepItem.prepared_quantity} / {prepItem.ordered_quantity}
                      </Typography>
                    </Grid>
                    <Grid item sm={3}>
                      <ButtonQuantity
                        miniCart={false}
                        product_id={prepItem.product_id}
                        quantity={prepItem.quantity_to_prepare}
                        // setQuantity={handleUpdatePreparedQuantity}
                        setQuantity={(newQtt) => { handleUpdatePreparedQuantity(prepItem.product_id, newQtt) }}
                        branch_quantity={prepItem.ordered_quantity - prepItem.prepared_quantity}
                        isManageInventory={true}
                      />
                    </Grid>
                  </Grid>
                </React.Fragment>
              );
            })}


          </Grid>

          <Grid container direction="column" item xs={12} sm={6}>


          </Grid>
        </Grid>
        {/* Button */}
        <Grid
          container
          direction="row"
          justifyContent={"flex-end"}
          style={{ marginTop: 20 }}
        >
          <Button
            color="primary"
            variant="contained"
            size="small" style={{ marginLeft: 15 }}
            onClick={handlePrepareOrder}
          >
            Chuẩn bị
          </Button>
        </Grid>
      </Box>
    </Collapse>
  )
}



export default FBOrderDetail;