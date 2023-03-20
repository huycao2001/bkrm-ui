import React, { useRef, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useTheme, makeStyles } from "@material-ui/core/styles";

import { infoActions } from "../../../store/slice/infoSlice";
import { statusAction } from "../../../store/slice/statusSlice";

import useStyles from "../../../components/TableCommon/style/mainViewStyle";

import { CartRow } from "../../SalesView/Cart/CartTableRow/CartTableRow";
import CartSummary from "../../../components/CheckoutComponent/CheckoutSummary/CartSummary/NewCartSummary";

import LoadingIndicator from "../../../components/LoadingIndicator/LoadingIndicator";
import { trackPromise } from "react-promise-tracker";
import {
  AppBar,
  Toolbar,
  Grid,
  Card,
  Box,
  Table,
  Tabs,
  Tab,
  TableContainer,
  CardContent,
  CardMedia,
  CardActionArea,
  FormControlLabel,
  Switch,
  Menu,
  MenuItem,
  ListItem,
  IconButton,
  TableBody,
  Typography,
  ButtonBase,
  AvatarTypeMap,
  Tooltip,
  Avatar,
  TableCell,
  TableRow,
  Button,
  TableHead,
} from "@material-ui/core";
import PropTypes from "prop-types";


import CashierMenu from "./CashierMenu/CashierMenu";
import SearchProductCashier from "../../../components/SearchBar/SearchProductCashier";

import CashierTableView from "./CashierTableView/CashierTableView";

import productApi from "../../../api/productApi";
import fbTableApi from "../../../api/fbTableApi";
import stateApi from "../../../api/stateApi"; 

// import Tabs from "@material-ui/core/Tabs";
// import Tab from "@material-ui/core/Tab";

// const myStyle = makeStyles((theme) => ({
//     appBar : {
//         backgroundColor : theme.palette.primary.light
//     }
// }));

import Echo from "laravel-echo";
import Pusher from "pusher-js";



function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}


const initCart = {
  table : null,
  reservation : null,
  customer: null,
  cartItem: [],
  total_amount: "0",
  paid_amount: "0",
  discount: "0",
  payment_method: "cash",
  delivery: false,
  scores: "0",
  discountDetail: { value: "0", type: "VND" },
  selectedPromotion: null,
  otherFee: 0,
};

const Cashier = (props) => {
  const theme = useTheme();
  const classes = useStyles(theme);

  //Redux
    // redux
    const dispatch = useDispatch();
    const info = useSelector((state) => state.info);
    const store_uuid = info.store.uuid;
    const branch = info.branch;
    const branch_uuid = info.branch.uuid;

    const user_uuid = useSelector((state) => state.info.user.uuid);


    const loadCartLocalStorage = () => {
      if (window.localStorage.getItem("cashierCartListData")) {
        const data = JSON.parse(window.localStorage.getItem("cashierCartListData"));
        if (data.user_uuid === user_uuid) {
          return data.cartList;
        }
      }
      return [
        {
          customer: null,
          cartItem: [],
          total_amount: "0",
          paid_amount: "0",
          discount: "0",
          payment_method: "cash",
          delivery: false,
          scores: "0",
          discountDetail: { value: "0", type: "VND" },
          selectedPromotion: null,
          otherFee: 0,
        },
      ];
    };


  const [index, setIndex] = useState(0); // Tab index

  const [products, setProducts] = useState([]);

  // const [tables, setTables] = useState([{
  //   uuid : generateUUID(),
  //   seats : 0, 
  //   name : "Mang đi",
  //   type : "away",
  //   status : "empty",
  //   table_group_name : "Bán mang đi"
  // }]);


  const [tables, setTables] = useState([]);

  const [selectedTable, setSelectedTable] = useState(null);

  const [isUpdateTotalAmount, setIsUpdateTotalAmount] = React.useState(false);


  
  const[cashierCartList, setCashierCartList] = useState([]);


  const handleUpdateState = async (type, payload) => {
    try{
      const response = await stateApi.updateState(store_uuid, branch_uuid, {
        eventType : type,
        payload : payload
      });

      if(response.message){
        dispatch(statusAction.successfulStatus(response.message));
      }
    }catch(e){
      dispatch(statusAction.failedStatus("somthing went wrong"))
    }


  }


  const handleAddCell = () => { 
    let newTable = {
      uuid : generateUUID(),
      seats : 0, 
      type : "away",
      name : "Mang đi",
      status : "empty",
      table_group_name : "Bán mang đi"
    }

    setTables(prev => {
      return [
        newTable,
        ...prev
      ]
    });
  }


  const handleDeleteCell = (tableUuid) => { 
    // Delete the table from tables
    var newTables = [...tables];
    newTables = newTables.filter(table => table.uuid != tableUuid); 
    setTables(newTables); 

    // Delete the current order
    var newCashierCartList = [...cashierCartList]; 
    newCashierCartList.filter(cart => cart.table.uuid != tableUuid);

    handleUpdateState("DeleteDeliveryCart", {
      tableUuid : tableUuid
    });
    //setCashierCartList(newCashierCartList);
    setClone(!clone);

    if(selectedTable.uuid === tableUuid){
      setSelectedTable(null);
    }
  }

  


  const [ws, setWs ] = useState(null);
  // useEffect(async () => {
  //   //console.log(process.env.REACT_APP_PUSHER_APP_KEY);
  //   console.log("call use effect again");
  //   if(!selectedTable) {
  //     console.log("denideeddd");
  //     return;
  //   }
  //   if (!ws) {
  //     const echo = new Echo({
  //       broadcaster: 'pusher',
  //       key: 'apollo13',
  //       wsHost: window.location.hostname,
  //       wsPort: 6001,
  //       wssPort: 6001,
  //       forceTLS: false,
  //       disableStats: true,
  //       encrypted: false,
  //       enabledTransports: ['ws', 'wss'],
  //       cluster: 'ap1',
  //     });
  //     if (selectedTable){
  //       var channel = `ws.stores.${store_uuid}.branches.${branch_uuid}.tables.${selectedTable.uuid}`
  //       echo
  //       .channel(channel)
  //       .subscribed(() => {
  //         console.log('You are subscribed to ' + channel);
  //       })
  //       .listen('TemporaryTableOrderUpdatedEvent', (data) => {
  //         console.log("WS got: " + JSON.stringify(data));
  //         //if(data.message === "fetch again"){
  //           console.log("call it again ?");
  //           //setClone(!clone);
  //           loadState();
  //         //}
  //       }
  //       );

        
  //     setWs(echo);
  //     }
      
  //   }
  // } , [selectedTable]);






  useEffect(() => {


    if(!selectedTable) return;
    const channel = `ws.stores.${store_uuid}.branches.${branch_uuid}.tables.${selectedTable.uuid}`;

    if (!ws) {
      let c = window.Echo.channel(channel);
      setWs(c);
      c.subscribed(() => {
        console.log('Now listening to events from channel: ' + channel);
        let ws = new WebSocket(`ws://localhost:6001/app/apollo13?protocol=7&client=js&version=7.5.0&flash=false`);

        ws.onopen = function (event) {
          ws.send(JSON.stringify(
            {
              event: 'bkrm:not-temporary_table_fborder_updated',
              token: localStorage.getItem("token"),
              payload: {
                table_uuid: selectedTable.uuid,
                temporary_fborder: '[food:2]'
              },
            }), []);
        }
      });
      c.listen("TemporaryTableOrderUpdatedEvent", (data) => {
        console.log("WS got: " + JSON.stringify(data));
        // handleReceiveNewMessage(data);
      }
      );

    }
  }, [selectedTable]);

  useEffect(() => {
    updateTotalAmount();
  }, [isUpdateTotalAmount]);


  const [clone,setClone] = useState(false); 


  const loadState = async () => {
    try{
      const response = await stateApi.getState(store_uuid, branch_uuid); 
      if(response.message === "Success"){
        setCashierCartList(response.data);
      }

    console.log("My state" + JSON.stringify(response));
    }catch(e){
      console.log("error when calling state"); 
      console.log(e);
    }
  }
  useEffect(() => { 


    loadState();
  } , [])


  


  const updateTotalAmount = () => {
    if(selectedTable === null) return;
    

    var newCashierCartList = [...cashierCartList];

    let currentCart = newCashierCartList.find(item => item.table.uuid === selectedTable.uuid);
    if(!currentCart) return;
    let total = 0;
    currentCart.cartItem.forEach((item) => {
      total += item.unit_price * item.quantity;
    });

    currentCart.total_amount = total;
    currentCart.paid_amount = total;


    setCashierCartList(newCashierCartList);

  }


  const handleUpdatePaidAmount = (amount) => {
    if (amount < 0 || selectedTable === null) {
      return;
    }

    var newCashierCartList = [...cashierCartList];

    let currentCart = newCashierCartList.find(item => item.table.uuid === selectedTable.uuid);
    currentCart.paid_amount = amount; 
    setCashierCartList(newCashierCartList);
  };


  // const handleSelectTable = (table) => {

  // }

  const handleChangeItemQuantity = (itemUuid, newQuantity) => {

    var newCashierCartList = [...cashierCartList];

    let currentCart = newCashierCartList.find(item => item.table.uuid === selectedTable.uuid);

    //console.log("current cart" + JSON.stringify(currentCart));
    //console.log("current value" + JSON.stringify(selectedOption));

    let itemIndex = currentCart.cartItem.findIndex(
      (item) => item.uuid === itemUuid
    );
    let item = currentCart.cartItem.find(
      (item) => item.uuid === itemUuid
    );



    // if (isNaN(newQuantity)) {
    //   newQuantity = "";
    // }
    if (newQuantity === 0 && !item.has_batches) {
      handleDeleteItemCart(itemUuid);
      return;
    }
    if (newQuantity < 0) {
      return;
    }

    //let newCartList = [...cartList];
    currentCart.cartItem[itemIndex].quantity = newQuantity;
    //setCartList(newCartList);
    handleUpdateState("UpdateItemQuantity", {
      cart : currentCart,
      item : item,
      newQuantity : newQuantity
    })
    //setCashierCartList(newCashierCartList);
    //setClone(!clone);
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };



  const handleDeleteItemCart = (itemUuid) => {
    var newCashierCartList = [...cashierCartList];
    let currentCart = newCashierCartList.find(item => item.table.uuid === selectedTable.uuid);

    let itemIndex = currentCart.cartItem.findIndex(
      (item) => item.uuid === itemUuid
    );

    let item = currentCart.cartItem.find(
      (item) => item.uuid === itemUuid
    );


    currentCart.cartItem.splice(itemIndex, 1);
    if(currentCart.cartItem.length === 0){
      //delete cart if there are no items left
      var cartIndex = newCashierCartList.findIndex(item => item.table.uuid === selectedTable.uuid);
      newCashierCartList.splice(cartIndex,1);
      handleUpdateState("DeleteCart", {
        cart : currentCart
      })
    }else{
      handleUpdateState("DeleteItemFromCart", {
        cart : currentCart,
        item : item
      })
    }


    //setCashierCartList(newCashierCartList);
    //setClone(!clone);
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };


  // Handle add product to cart with search bar
  const handleSearchBarSelect = (selectedOption) => {


    //Return if there is no selected table
    if(selectedTable === null){
      return;
    }

    // Find the current cart of which table
    var newCashierCartList = [...cashierCartList];

    let currentCart = newCashierCartList.find(item => item.table.uuid === selectedTable.uuid);

    var cartCreated = false; 

    if(!currentCart){
      // new item for the table -> create a new cart
      currentCart = {
        table : selectedTable,
        reservation : null,
        customer: null,
        cartItem: [],
        total_amount: "0",
        paid_amount: "0",
        discount: "0",
        payment_method: "cash",
        delivery: false,
        scores: "0",
        discountDetail: { value: "0", type: "VND" },
        selectedPromotion: null,
        otherFee: 0,
      }

      cartCreated = true;

      

      // setCashierCartList([
      //   currentCart,
      //   ...cashierCartList
      // ]);
      newCashierCartList = [currentCart , ...newCashierCartList];
    }
    //console.log("current cart" + JSON.stringify(currentCart));
    //console.log("current value" + JSON.stringify(selectedOption));

    let itemIndex = currentCart.cartItem.findIndex(
      (item) => item.uuid === selectedOption.uuid
    );
    let item = currentCart.cartItem.find(
      (item) => item.uuid === selectedOption.uuid
    );

    if (!item) {
      let newCartItem = {
        id: currentCart.cartItem.length,
        uuid: selectedOption.uuid,
        quantity:  1,
        product_code: selectedOption.product_code,
        bar_code: selectedOption.bar_code,
        unit_price: selectedOption.list_price,
        img_urls: selectedOption.img_urls,
        name: selectedOption.name,
        branch_quantity: Number(selectedOption.branch_quantity),
        has_batches: selectedOption.has_batches,
        batches: selectedOption.batches,
        branch_inventories: selectedOption.branch_inventories.map(item => {
          return {
            uuid : item.uuid,
            quantity_available : item.quantity_available,

          }
        }),
      };



      currentCart.cartItem.push(newCartItem);
      //setCashierCartList(newCashierCartList);
      
      if(cartCreated){
        handleUpdateState("AddNewCartWithAnItem", currentCart);
      }else{
        handleUpdateState("AddItemToCart", {
          cart : currentCart,
          newCartItem : newCartItem
        });
      }
      //setClone(!clone)
      setIsUpdateTotalAmount(!isUpdateTotalAmount);
      return;
    }


    console.log("fff");
    if (!item.has_batches) {
      console.log("heeheh");
      handleChangeItemQuantity(
        selectedOption.uuid,
        currentCart.cartItem[itemIndex].quantity + 1
      );
    } else {
    //   if (
    //     cartList[selectedIndex].cartItem[itemIndex].selectedBatches?.length ===
    //     1
    //   ) {
    //     handleChangeItemQuantity(
    //       selectedOption.uuid,
    //       cartList[selectedIndex].cartItem[itemIndex].quantity + 1
    //     );
    //     const newCartList = [...cartList];
    //     newCartList[selectedIndex].cartItem[
    //       itemIndex
    //     ].selectedBatches[0].additional_quantity += 1;
    //     setCartList(newCartList);
    //   }
    }
  };

  //Load products the initial products are empty
  const loadProducts = async () => {
    try {
      const response = await productApi.searchBranchProduct(
        store_uuid,
        branch_uuid,
        ""
      );
      setProducts(response.data);
    } catch (err) {
      console.log("Load product fails in Cashier.js")
      console.log(err);
    }
  };
  useEffect(() => {
    loadProducts();
  }, [store_uuid,branch_uuid])

  //Load tables;

  useEffect(() => {
    const loadTables = async () => {
      try {
        const response = 
          await trackPromise(
            fbTableApi.getTablesOfBranch(
              store_uuid,
              branch_uuid,
              {
                orderBy : "tables.created_at",
                sort : "desc",
              }
            )
          );
        //setTotalRows(response.total_rows);

        if(response.message === "Successfully fetched tables"){

           
          
          setTables(prev => {
            
            var fetchedTables  = response.data.tables.map(table => {
              return {
                uuid : table.uuid,
                seats : table.seats, 
                name : table.name,
                status : table.status,
                table_group_name : table.table_group_name
              }
            });
            
            return [
              // ...prev, 
              ...fetchedTables

            ]
          });
          //initiate order for each table
          // var fborders = newTables.map(tableItem => {
          //   return     {
          //     table : {
          //       uuid : tableItem.uuid,
          //       seats : tableItem.seats,
          //       name : tableItem.name, 
          //       status : tableItem.status, 
          //       table_group_name : tableItem.table_group_name
          //     },
          //     reservation : null,
          //     customer: null,
          //     cartItem: [],
          //     total_amount: "0",
          //     paid_amount: "0",
          //     discount: "0",
          //     payment_method: "cash",
          //     delivery: false,
          //     scores: "0",
          //     discountDetail: { value: "0", type: "VND" },
          //     selectedPromotion: null,
          //     otherFee: 0,
          //   }
          // }); 

          // console.log("fborders" + JSON.stringify(fborders));

          // setCashierCartList(fborders);


        }
        //console.log("tables" + JSON.stringify(newTables));
      } catch (error) {
        console.log(error);
      }
    };


    loadTables();
  }, [branch_uuid, store_uuid])


  useEffect(() => {
    console.log("cashierCarList" + JSON.stringify(cashierCartList));
  }, [cashierCartList]);

  useEffect(() => {
    console.log("selected" + JSON.stringify(selectedTable));
  }, [selectedTable]);

  // useEffect(() => {

  //   if(selectedTable === null){
  //     return;
  //   }
  //   let currentCart = cashierCartList.find(item => item.table.uuid === selectedTable.uuid);

  //   console.log("newCart" + JSON.stringify(currentCart));
  // }, [cashierCartList]);


  const handleChangeIndex = (event, newIndex) => {
    setIndex(newIndex);
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      {/* 1) Menu on the left */}

      <Grid item xs={12} sm={8}>
        
        <Card className={classes.root}>
          <Box style={{ minHeight: "82vh", paddingBottom: 0 }}>
            <AppBar
              className={classes.appBar}
              position="static"
              style={{ backgroundColor: "#ededed" }}
            >
              <Toolbar>
                <Tabs
                  value={index}
                  onChange={handleChangeIndex}
                  aria-label="simple tabs example"
                >
                  <Tab
                    label="Phòng bàn"
                    style={{ color: "black" }}
                    {...a11yProps(0)}
                  />
                  <Tab
                    label="Thực đơn"
                    style={{ color: "black" }}
                    {...a11yProps(1)}
                  />
                </Tabs>

                <SearchProductCashier
                  products = {products}
                  setProducts = {setProducts}
                  handleSearchBarSelect = {handleSearchBarSelect}
                />

<Button
          onClick={() => {
            if(ws){
              console.log("cancel connection");
              ws.disconnect();
            }
          }}
        >

          Cancel connection
        </Button>
              </Toolbar>
            </AppBar>
            <TabPanel value={index} index={0}>
              
              <CashierTableView
                tables = {tables}
                selectedTable = {selectedTable}
                setSelectedTable = {setSelectedTable}
                handleAddCell = {handleAddCell}
                ws = {ws}
                setWs = {setWs}

              
              />
            </TabPanel>

            <TabPanel value={index} index={1}>
                <CashierMenu
                  products = {products}
                  setProducts = {setProducts}
                  handleSearchBarSelect = {handleSearchBarSelect}
                  selectedCart = {selectedTable ? (cashierCartList.find(item => item.table.uuid === selectedTable.uuid)?.cartItem || []) : [] }
                />
            </TabPanel>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} sm={4} className={classes.root}>
        <Card className={classes.root}>
          <Box style={{ padding: 0, minHeight: "82vh" }}>
            <CartSummary
              
              
              disable = {false}
              cartData = {selectedTable ? cashierCartList.find(item => item.table.uuid === selectedTable.uuid) :initCart}
              handleSelectCustomer = {(item) =>{
                console.log(item)
              }}
              discountData={[]}
              currentBranch = {branch}
              handleSearchCustomer={null}
              handleUpdatePaidAmount = {handleUpdatePaidAmount}
              mode = {true}

              customers={[]}
              selectedTable = {selectedTable}
              setSelectedTable = {selectedTable}
              handleDeleteCell = {handleDeleteCell}
            >
              {selectedTable !== null && <TableContainer
                    style={{
                      maxHeight:
                        "44vh",
                      height:
                        "44vh",
                    }}
                  >
                    <Table size="small">
                      {/* <TableHead>
                        <TableRow>
                          <TableCell  align="right">stt</TableCell>
                          <TableCell  align="right">Số lượng</TableCell>
                          <TableCell  align="right">Đơn giá</TableCell>

                        </TableRow>
                      </TableHead> */}
                      <TableBody>
                      {!cashierCartList ? [] :  cashierCartList.find(item => item.table.uuid === selectedTable.uuid)?.cartItem?.map((row, index) => {
                        return (
                          <CartRow
                            key={`${row.uuid}_index`}
                            row={row}
                            handleDeleteItemCart={handleDeleteItemCart}
                            handleChangeItemQuantity={handleChangeItemQuantity}
                            discountData={[]}
                            //mini={true}
                            imageType={false}
                            index={
                              (cashierCartList.find(item => item.table.uuid === selectedTable.uuid)?.cartItem?.length || 0) - index
                            }
                            typeShow={'list'}
                            showImage={false}
                            handleUpdateBatches={null}
                            mini = {true}
                          />
                        );
                      }) || []}
                      </TableBody>
                    </Table>
                  </TableContainer>}
            </CartSummary>

          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Cashier;
