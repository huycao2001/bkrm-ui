import React, { useRef, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useTheme, makeStyles } from "@material-ui/core/styles";

import { infoActions } from "../../../store/slice/infoSlice";
import { statusAction } from "../../../store/slice/statusSlice";

import useStyles from "../../../components/TableCommon/style/mainViewStyle";

import { CartRow } from "../../SalesView/Cart/CartTableRow/CartTableRow";
import CartSummary from "../../../components/CheckoutComponent/CheckoutSummary/CartSummary/NewCartSummary";

import CashierCartSummary from "../../../components/CheckoutComponent/CheckoutSummary/CartSummary/CashierCartSummary";

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
import { ContactSupportOutlined, LocationSearchingOutlined } from "@material-ui/icons";
import orderApi from "../../../api/orderApi";



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

function isArray(a) {
  return (!!a) && (a.constructor === Array);
};

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
  total_amount: 0,
  paid_amount: 0,
  discount: 0,
  payment_method: "cash",
  delivery: false,
  scores: 0,
  discountDetail: { value: 0, type: "VND" },
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

  //const [reload, setReload] = useState(false);


  const [isLoadingTables, setIsLoadingTables] = useState(false); 


  const [tables, setTables] = useState([]);

  const [selectedTable, setSelectedTable] = useState(null);

  const [isUpdateTotalAmount, setIsUpdateTotalAmount] = React.useState(false);


  
  const[cashierCartList, setCashierCartList] = useState([]);


  const [anchorEl, setAnchorEl] = React.useState(null); // For takeaway cart

  const [selectedTakeAwayCart, setSelectedTakeAwayCart] = React.useState(null);





  const handleNotifyKitchen = async () => { 
    var newCashierCartList = [...cashierCartList]; 
    var currentCart = newCashierCartList.find(item => {
      if(selectedTable.type === "away" && selectedTakeAwayCart){
        return item.table.uuid === selectedTable.uuid && item.uuid === selectedTakeAwayCart;
      }
      return item.table.uuid === selectedTable.uuid;
    });


    if(currentCart){
      try{

        // Create the FBOrder for kitchen
        var items = currentCart.cartItem.map(item => {
          return {
            product_uuid : item.uuid,
            ordered_quantity : item.quantity
          }
        });

        var body = null; 
        var response = null;
        if(selectedTable.type === "away"){
          // Create take away fborder
          body = {
            items : items,
            note : "away order",
            fborder_uuid : currentCart.fb_order_uuid
          }
          response = await orderApi.createFBTakeawayOrder(store_uuid, branch_uuid, body)
        }else{
          // Create normal fborder
          body = {
            items : items,
            note : "normal table order with table " + currentCart.table.name
          }
          response = await orderApi.createFBOrder(store_uuid, branch_uuid, selectedTable.uuid, body)
        }

        if(response.message === "Order created successfully"){
          currentCart.kitchen_notified = true;
          currentCart.fb_order_uuid = response.data.fb_order.uuid; 
          dispatch(statusAction.successfulStatus("Đã thông báo cho bếp !"));
          //Update state to BE
          if(selectedTable.type === "away"){
            var takeAwayCarts = newCashierCartList.filter(item => item.type === "away");
            sendData({
              event: 'bkrm:temporary_fborder_request_update_event',
              token: localStorage.getItem("token"),
              payload: {
                table_uuid: selectedTable.uuid,
                temporary_fborder: JSON.stringify(takeAwayCarts)
              },
            });

          }else{
            sendData({
              event: 'bkrm:temporary_fborder_request_update_event',
              token: localStorage.getItem("token"),
              payload: {
                table_uuid: selectedTable.uuid,
                temporary_fborder: JSON.stringify(currentCart)
              },
            });
          }
        }else{
          dispatch(statusAction.failedStatus(response.message));
        }

        
      }catch(e){
        dispatch(statusAction.failedStatus("Thông báo cho nhà bếp thất bại !"));
        console.log("Error when creating FB order and notify for kitchen : " + e); 
      }
    }
  }

    
  const handleAddNewFBOrderAndPayment = async (items) => { 
    var newCashierCartList = [...cashierCartList]; 
    var currentCart = newCashierCartList.find(item => {
      if(selectedTable.type === "away" && selectedTakeAwayCart){
        return item.table.uuid === selectedTable.uuid && item.uuid === selectedTakeAwayCart;
      }
      return item.table.uuid === selectedTable.uuid;
    });
    
    if(currentCart){
      try{
        var items = currentCart.cartItem.map(item => {
          return {
            product_uuid : item.uuid,
            ordered_quantity : item.quantity
          }
        });

        var body = null;

        // First create the order
        var response = null;
        if(!currentCart.kitchen_notified){
          if(selectedTable.type === "away"){
            dispatch(statusAction.successfulStatus("Chưa thông báo nên gọi api"));
            body = {
              items : items,
              note : "away order",
              fborder_uuid : currentCart.fb_order_uuid
            }
            response = await orderApi.createFBTakeawayOrder(store_uuid, branch_uuid, body)
          }else{
            body = {
              items : items,
              note : "normal table order"
            }
            response = await orderApi.createFBOrder(store_uuid, branch_uuid, selectedTable.uuid, body)
          }
        }
        
        if((response && response.message === "Order created successfully") || currentCart.kitchen_notified ){
          // dispatch(statusAction.successfulStatus("Tạo hóa đơn thành công"));
          const fb_order_id = currentCart.type === "away" ? currentCart.fb_order_uuid :  currentCart.kitchen_notified ? currentCart.fb_order_uuid : response.data.fb_order.uuid;
          console.log("fb order is " + fb_order_id);  
          
          // Prepare the dishes in the order
          var prepareDishes = { 
            items : currentCart.cartItem.map(item => {
              return {
                product_uuid : item.uuid,
                quantity_to_prepare : item.quantity
              }
            })
          }
          const prepareRes = await orderApi.prepareFBOrder(store_uuid, branch_uuid, fb_order_id, prepareDishes); 
          if(prepareRes.message === "success"){
              // Pay the order
            var payload = {
              "customer_uuid": null,
              "paid_date": null,
              "creation_date": null,
              "status": "closed",
              "total_amount": currentCart.total_amount,
              "paid_amount": currentCart.paid_amount,
              "discount": "0",
              "payment_method": "cash",
              "tax": "0",
              "shipping": "0",
              "is_customer_order": false
            }
            const paymentResponse = await orderApi.payFBOrder(store_uuid, branch_uuid, fb_order_id, payload ); 

            if(paymentResponse.message === "Order created successfully"){
              dispatch(statusAction.successfulStatus("Thanh toán thành công"));
              
              // Clear the cart
              if(selectedTable.type === "away"){
                console.log("clear away ? ")
                var newCashierCartList = [...cashierCartList]; 
                // var currentCartIndex = newCashierCartList.findIndex(item => item.uuid === selectedTable.uuid); 
                // newCashierCartList.splice(currentCartIndex,1); 
                // console.log("debug 286")
                // setCashierCartList(newCashierCartList)
                //Todo clear the selected cart take away cart 

                var currentCartIndex = newCashierCartList.findIndex(item => {
                  return item.table.uuid === selectedTable.uuid && item.uuid === selectedTakeAwayCart;
                }); 

                newCashierCartList.splice(currentCartIndex,1); 
                var awayCart = newCashierCartList.find(item => item.type === "away"); 
                if(awayCart){
                  setSelectedTakeAwayCart(awayCart.uuid); 
                }else{
                  setSelectedTakeAwayCart(null); 
                }


                var takeAwayCarts = newCashierCartList.filter(item => item.type === "away");
                sendData({
                  event: 'bkrm:temporary_fborder_request_update_event',
                  token: localStorage.getItem("token"),
                  payload: {
                    table_uuid: selectedTable.uuid,
                    temporary_fborder: JSON.stringify(takeAwayCarts)
                  },
                });

              }else{
                sendData({
                  event: 'bkrm:temporary_fborder_request_update_event',
                  token: localStorage.getItem("token"),
                  payload: {
                    table_uuid: selectedTable.uuid,
                    temporary_fborder: JSON.stringify(null)
                  },
                });
              }


              loadProducts();

            }else{
              dispatch(statusAction.failedStatus("Thanh toán hóa đơn thất bại " + paymentResponse.message));

            }
          }else{
            dispatch(statusAction.failedStatus("Chuẩn bị món ăn thất bại " + prepareRes.message ));

          }



          

        }else{
          dispatch(statusAction.failedStatus("Tạo hóa đơn thất bại"));

        }
      }
      catch(e){
        dispatch(statusAction.failedStatus("Tạo hóa đơn thất bại, vui lòng check lỗi"));
        console.log("Error when creating FB order : " + e); 
      }
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


  const handleAddTakeAwayCart = () => {


    const newCart = {
      uuid : generateUUID(), 
      table : selectedTable, // mang di
      reservation : null,
      customer: null,
      type : "away",
      fb_order_uuid : generateUUID(), 
      kitchen_notified : false,
      cartItem: [],
      total_amount: 0,
      paid_amount: 0 ,
      discount: 0 ,
      payment_method: "cash",
      delivery: false,
      scores: 0,
      discountDetail: { value: 0, type: "VND" },
      selectedPromotion: null,
      otherFee: 0,
    }


    const newCashierCartList = [...cashierCartList, newCart];
    console.log("debug 377")
    setCashierCartList(newCashierCartList); 
    setSelectedTakeAwayCart(newCart.uuid);
  }




  const handleDeleteTakeAwayCart = (cart_uuid) => {
    var newCashierCartList = [...cashierCartList];
    newCashierCartList = newCashierCartList.filter(cart => {
      return cart.uuid !== cart_uuid; 
    });

    // Check if theres any takeaway cart left
    var awayCart = newCashierCartList.find(cart => cart.type === "away"); 

    if(awayCart){
      setSelectedTakeAwayCart(awayCart.uuid); 
    }

    console.log("debug 398")
    setCashierCartList(newCashierCartList); 
  }


  const handleChooseTakeAwayCart = (cart_uuid) => {
    setSelectedTakeAwayCart(cart_uuid);
  }


  const handleDeleteCell = (tableUuid) => { 
    // Delete the table from tables
    var newTables = [...tables];
    newTables = newTables.filter(table => table.uuid != tableUuid); 
    setTables(newTables); 

    // Delete the current order
    var newCashierCartList = [...cashierCartList]; 
    newCashierCartList.filter(cart => cart.table.uuid != tableUuid);

    //setCashierCartList(newCashierCartList);
    setClone(!clone);

    if(selectedTable.uuid === tableUuid){
      setSelectedTable(null);
    }
  }

  


  const [ws, setWs ] = useState(null);

  const [socket, setSocket] = useState(null);

  const sendData = (data) => { 
    if(socket){
      console.log("sending data")
      try{
        socket.send(JSON.stringify(data), []);
      }
      catch(e){
        console.log("Send data failed : " + e);
      }
    }
  }

  useEffect(async () => {
    //console.log(process.env.REACT_APP_PUSHER_APP_KEY);
    console.log("call use effect again");
    if(!selectedTable) {
      console.log("denideeddd");
      return;
    }
    if (!ws) {
      const echo = new Echo({
        broadcaster: 'pusher',
        key: process.env.REACT_APP_WEBSOCKET_APP_KEY,
        wsHost: process.env.REACT_APP_PUSHER_HOST,
        wsPort: process.env.REACT_APP_PUSHER_PORT,
        wssPort: process.env.REACT_APP_PUSHER_PORT,
        forceTLS: false,
        disableStats: true,
        encrypted: false,
        enabledTransports: ['ws', 'wss'],
        cluster: 'ap1',
      });
      if (selectedTable){
        //ws.stores.{$table->store->uuid}.branches.{$table->branch->uuid}.tables.{$table->uuid}
        var channel = `ws.stores.${store_uuid}.branches.${branch_uuid}.tables.${selectedTable.uuid}`
        echo
          .channel(channel)
          .subscribed(() => {
            console.log('You are subscribed to ' + channel);
            const wsUrl = (process.env.REACT_APP_PUSHER_PORT == 443? 'wss' : 'ws') + `://${process.env.REACT_APP_PUSHER_HOST}:${process.env.REACT_APP_PUSHER_PORT}/app/${process.env.REACT_APP_WEBSOCKET_APP_KEY}`;
            let iniSocket = new WebSocket(wsUrl);

          setSocket(iniSocket);

        })
        .listen('.bkrm:temporary_fborder_updated_event', (data) => {
          console.log("WS got: " + JSON.stringify(data));
          console.log("type of data " + typeof data);


          if(data.temporary_fborder !== '[]' || selectedTable.type === "away" ){
            handleUpdateTableCart(data.table_uuid, data.temporary_fborder);
          }else{
            console.log("no ????")
          }
          
        }
        );

        
      setWs(echo);
      }
      
    }
  } , [selectedTable]);


  const handleUpdateTableCart = (tableUuid, cart) => { 

    var newCashierCartList = [...cashierCartList]; 
    let currentCart = newCashierCartList.find(item => {
      // if(selectedTakeAwayCart){
      //   return item.table.uuid === tableUuid && item.uuid === selectedTakeAwayCart; 
      // }
      return item.table.uuid === tableUuid
    });

    // let currentCart = newCashierCartList.find(item => {
    //   if(selectedTakeAwayCart){
    //     return item.table.uuid === selectedTable.uuid && item.uuid === selectedTakeAwayCart
    //   }
    //   return item.table.uuid === selectedTable.uuid
    // });


    if(cart === 'null'){
      newCashierCartList = newCashierCartList.filter(item => item.table.uuid !== tableUuid);
      console.log("debug 519")
      setCashierCartList(newCashierCartList);
      return;

    }


    if(selectedTable.type === "away"){
      var carts = JSON.parse(cart);

      // remove the current take away orders
      newCashierCartList = newCashierCartList.filter(item => item.type !== "away"); 
      newCashierCartList = [...newCashierCartList, ...carts]; 

      console.log("why ? " + JSON.stringify(carts));
      
      setCashierCartList(newCashierCartList);
      return;
    }
    if(currentCart){
      currentCart = JSON.parse(cart);

    }else{
      newCashierCartList = [...newCashierCartList, JSON.parse(cart)];
    }
    console.log("update state back to list")
    console.log(newCashierCartList);

    console.log("debug 547")
    setCashierCartList(newCashierCartList);
  }








  const [clone,setClone] = useState(false); 
  


  // const updateTotalAmount = () => {
  //   if(selectedTable === null) return;
    

  //   var newCashierCartList = [...cashierCartList];

  //   let currentCart = newCashierCartList.find(item => item.table.uuid === selectedTable.uuid);
  //   if(!currentCart) return;
  //   let total = 0;
  //   currentCart.cartItem.forEach((item) => {
  //     total += item.unit_price * item.quantity;
  //   });

  //   currentCart.total_amount = Number(total);
  //   currentCart.paid_amount = Number(total);


  //   setCashierCartList(newCashierCartList);

  // }


  const handleUpdatePaidAmount = (amount) => {
    if (amount < 0 || selectedTable === null) {
      return;
    }

    var newCashierCartList = [...cashierCartList];

    let currentCart = newCashierCartList.find(item => {
      if(selectedTable.type === "away"){
        if(selectedTakeAwayCart){
          return item.table.uuid === selectedTable.uuid && item.uuid === selectedTakeAwayCart
        }
      }
      return item.table.uuid === selectedTable.uuid
    });
    currentCart.paid_amount = Number(amount);
    console.log("debug 592") 
    setCashierCartList(newCashierCartList);
  };


  const handleUpdatePaymentMethod = (method) => {
    var newCashierCartList = [...cashierCartList];
    let currentCart = newCashierCartList.find(item => item.table.uuid === selectedTable.uuid);
    if(currentCart){
      currentCart.payment_method = method;
      console.log("debug 602")
      setCashierCartList(newCashierCartList);
    }else{
      dispatch(statusAction.failedStatus("Cart không tồn tại"))
    }

    

  };


  // const handleSelectTable = (table) => {

  // }

  const handleChangeItemQuantity = (itemUuid, newQuantity) => {

    var newCashierCartList = [...cashierCartList];

    let currentCart = newCashierCartList.find(item => {
      if(selectedTakeAwayCart){
        return item.table.uuid === selectedTable.uuid && item.uuid === selectedTakeAwayCart
      }
      return item.table.uuid === selectedTable.uuid
    });

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

      console.log("new quantity = 0");

      handleDeleteItemCart(itemUuid);
      return;
    }
    if (newQuantity < 0) {
      console.log("quantity < 0");
      return;
    }

    //let newCartList = [...cartList];
    var oldQuantity  = currentCart.cartItem[itemIndex].quantity; 
    currentCart.cartItem[itemIndex].quantity = newQuantity;
    currentCart.total_amount +=  Number(currentCart.cartItem[itemIndex].unit_price * (newQuantity - oldQuantity));
    currentCart.paid_amount =  Number(currentCart.total_amount);

    console.log("update right ?" + JSON.stringify(currentCart));


    if(selectedTable.type === "away"){
      // setCashierCartList(newCashierCartList);
      var takeAwayCarts = newCashierCartList.filter(item => item.type === "away"); 
        console.log("take aways " + JSON.stringify(takeAwayCarts));
        sendData({
          event: 'bkrm:temporary_fborder_request_update_event',
          token: localStorage.getItem("token"),
          payload: {
            table_uuid: selectedTable.uuid,
            temporary_fborder: JSON.stringify(takeAwayCarts)
          },
        });
      console.log("debug 673")
      // setCashierCartList(newCashierCartList);
      return;
    }
    sendData({
      event: 'bkrm:temporary_fborder_request_update_event',
      token: localStorage.getItem("token"),
      payload: {
        table_uuid: selectedTable.uuid,
        temporary_fborder: JSON.stringify(currentCart)
      },
    });
    //setCashierCartList(newCashierCartList);
    //setClone(!clone);
    // setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };



  const handleDeleteItemCart = (itemUuid) => {
    var newCashierCartList = [...cashierCartList];
    let currentCart = newCashierCartList.find(item => {
      if(selectedTakeAwayCart){
        return item.table.uuid === selectedTable.uuid && item.uuid === selectedTakeAwayCart
      }
      return item.table.uuid === selectedTable.uuid
    });

    let itemIndex = currentCart.cartItem.findIndex(
      (item) => item.uuid === itemUuid
    );

    let item = currentCart.cartItem.find(
      (item) => item.uuid === itemUuid
    );


    currentCart.cartItem.splice(itemIndex, 1);
    if(currentCart.cartItem.length === 0){
      // Delete the whole cart
      if(selectedTable.type === "away"){
        if(selectedTakeAwayCart){
          var currentCartIndex = newCashierCartList.findIndex(item => {
            return item.table.uuid === selectedTable.uuid && item.uuid === selectedTakeAwayCart
          });
          newCashierCartList.splice(currentCartIndex, 1);
          var takeAwayCarts = newCashierCartList.filter(item => item.type === "away"); 
          console.log("take aways " + JSON.stringify(takeAwayCarts));
          sendData({
            event: 'bkrm:temporary_fborder_request_update_event',
            token: localStorage.getItem("token"),
            payload: {
              table_uuid: selectedTable.uuid,
              temporary_fborder: JSON.stringify(takeAwayCarts)
            },
          });
          console.log("debug 729")
          // setCashierCartList(newCashierCartList);

          var awayCart = newCashierCartList.find(item => item.type === "away");
          if(awayCart){
            console.log("mlem" + JSON.stringify(awayCart));
            setSelectedTakeAwayCart(awayCart.uuid);
          }
          else{
            setSelectedTakeAwayCart(null)
          }
        }
        
      }
      else{
        sendData({
          event: 'bkrm:temporary_fborder_request_update_event',
          token: localStorage.getItem("token"),
          payload: {
            table_uuid: selectedTable.uuid,
            temporary_fborder: JSON.stringify(null)
          },
        });
      }


      return; 
    }

    //Update total amount again 
    currentCart.total_amount -= Number(item.unit_price * item.quantity);
    currentCart.paid_amount  =  Number(currentCart.total_amount );

    console.log("delete cart" + JSON.stringify(currentCart));

    if(selectedTable.type === "away"){
      // setCashierCartList(newCashierCartList);
      var takeAwayCarts = newCashierCartList.filter(item => item.type === "away"); 
      console.log("take aways " + JSON.stringify(takeAwayCarts));
      sendData({
        event: 'bkrm:temporary_fborder_request_update_event',
        token: localStorage.getItem("token"),
        payload: {
          table_uuid: selectedTable.uuid,
          temporary_fborder: JSON.stringify(takeAwayCarts)
        },
      });
      console.log("debug 776")
      // setCashierCartList(newCashierCartList);
      return;
    }
    sendData({
      event: 'bkrm:temporary_fborder_request_update_event',
      token: localStorage.getItem("token"),
      payload: {
        table_uuid: selectedTable.uuid,
        temporary_fborder: JSON.stringify(currentCart)
      },
    });

  };


  // Handle add product to cart with search bar
  const handleSearchBarSelect = (selectedOption) => {


    //Return if there is no selected table
    if(selectedTable === null){
      return;
    }

    // Find the current cart of which table
    var newCashierCartList = [...cashierCartList];

    // console.log("why" + selectedTakeAwayCart)

    let currentCart = newCashierCartList.find(item => {
      if(selectedTakeAwayCart){
        console.log("801");
        return item.table.uuid === selectedTable.uuid && item.uuid === selectedTakeAwayCart
      }
      return item.table.uuid === selectedTable.uuid
    });


    var cartCreated = false; 

    console.log("current cart " + JSON.stringify(currentCart));

    if(!currentCart){
      // new item for the table -> create a new cart
      currentCart = {
        uuid : generateUUID(), 
        table : selectedTable, // mang di
        reservation : null,
        customer: null,
        type : selectedTable.type === "away" ? "away" : "table", 
        fb_order_uuid : selectedTable.type === "away" ? generateUUID() : null, 
        kitchen_notified : false,
        cartItem: [],
        total_amount: 0,
        paid_amount: 0 ,
        discount: 0 ,
        payment_method: "cash",
        delivery: false,
        scores: 0,
        discountDetail: { value: 0, type: "VND" },
        selectedPromotion: null,
        otherFee: 0,
      }

      cartCreated = true;
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
      // currentCart.total_amount = currentCart.cartItem.reduce(
      //   (accumulator, currentValue) => accumulator + Number(currentValue.unit_price),
      //   0
      // );

      // currentCart.total_amount += Number(newCartItem.unit_price);
      // console.log("please " + JSON.stringify(currentCart.uuid));
      // currentCart.paid_amount += Number(newCartItem.unit_price);
      currentCart.total_amount = currentCart.cartItem.reduce(
        (accumulator, currentValue) => accumulator + Number(currentValue.unit_price),
        0
      );

      currentCart.paid_amount = currentCart.cartItem.reduce(
        (accumulator, currentValue) => accumulator + Number(currentValue.unit_price),
        0
      );;

      console.log( "current cart "+ JSON.stringify(currentCart) + " current paid " + currentCart.paid_amount);

      //setIsUpdateTotalAmount(!isUpdateTotalAmount);

      if(selectedTable.type === "away"){
        // setCashierCartList(newCashierCartList);
        var takeAwayCarts = newCashierCartList.filter(item => item.type === "away"); 
        console.log("take aways " + JSON.stringify(takeAwayCarts));
        sendData({
          event: 'bkrm:temporary_fborder_request_update_event',
          token: localStorage.getItem("token"),
          payload: {
            table_uuid: selectedTable.uuid,
            temporary_fborder: JSON.stringify(takeAwayCarts)
          },
        });
        console.log("debug 909")
        // setCashierCartList(newCashierCartList);
        setSelectedTakeAwayCart(currentCart.uuid);
        return ;
      }
      sendData({
        event: 'bkrm:temporary_fborder_request_update_event',
        token: localStorage.getItem("token"),
        payload: {
          table_uuid: selectedTable.uuid,
          temporary_fborder: JSON.stringify(currentCart)
        },
      });
      //setClone(!clone)
      
      return;
    }



    if (!item.has_batches) {

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

  useEffect(() => {
      var cart = cashierCartList.find(item => item.uuid === selectedTakeAwayCart); 
      if(cart) console.log("con me no uuid " + cart.uuid + " paid amount" + cart.paid_amount + " total " + cart.total_amount )
  }, [selectedTakeAwayCart])

  //Load tables;

  useEffect(() => {
    const loadTables = async () => {
      try {
        setIsLoadingTables(true);
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

              if(table.is_takeaway == 1){
                return {
                  uuid : table.uuid,
                  seats : table.seats, 
                  type : "away",
                  name : table.name,
                  status : table.status,
                  table_group_name : table.table_group_name
                }   
              }
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

          setIsLoadingTables(false); 
        }else{
          // dispatch(statusAction.failedStatus(""))
          setIsLoadingTables(false); 
        }
        //console.log("tables" + JSON.stringify(newTables));
      } catch (error) {
        setIsLoadingTables(false)
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

      <Grid item xs={12} sm={7}>
        
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


              </Toolbar>
            </AppBar>
            <TabPanel value={index} index={0}>
              
              {isLoadingTables === false ? <CashierTableView
                tables = {tables}
                selectedTable = {selectedTable}
                setSelectedTable = {setSelectedTable}
                handleAddCell = {handleAddCell}
                ws = {ws}
                setWs = {setWs}
                socket = {socket}
                setSocket = {setSocket}

              
              /> : 
              
              <Box style={{maxHeight: '64vh', minHeight:'60vh'}}>
                  <LoadingIndicator/>
              </Box>
              }
            </TabPanel>

            <TabPanel value={index} index={1}>
                <CashierMenu
                  products = {products}
                  setProducts = {setProducts}
                  handleSearchBarSelect = {handleSearchBarSelect}
                  selectedCart = {selectedTable ? (cashierCartList.find(item => {
                    if(selectedTakeAwayCart){
                      return item.table.uuid === selectedTable.uuid && item.uuid === selectedTakeAwayCart
                    }

                    return item.table.uuid === selectedTable.uuid;
                  })?.cartItem || []) : [] }
                />
            </TabPanel>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} sm={5} className={classes.root}>
        <Card className={classes.root}>
          <Box style={{ padding: 0, maxHeight: "82vh", overflow : "scroll" }}>
            <CashierCartSummary
              
              
              disable = {false}
              cartData = {selectedTable ? cashierCartList.find(item => {
                
                if(selectedTable.type === "away"){
                  console.log("new" + selectedTakeAwayCart);
                  if(selectedTakeAwayCart){
                    return item.table.uuid === selectedTable.uuid && item.uuid === selectedTakeAwayCart;
                  }else{
                    console.log("no ? " + JSON.stringify(cashierCartList))
                    return item.type === "away";
                  }
                  
                }
                return item.table.uuid === selectedTable.uuid;
              }) :initCart}
              handleSelectCustomer = {(item) =>{
                console.log(item)
              }}
              discountData={[]}
              currentBranch = {branch}
              handleSearchCustomer={null}
              handleUpdatePaidAmount = {handleUpdatePaidAmount}
              handleUpdatePaymentMethod={handleUpdatePaymentMethod}
              handleConfirm = {handleAddNewFBOrderAndPayment}
              handleNotifyKitchen = {handleNotifyKitchen}
              mode = {true}

              customers={[]}
              selectedTable = {selectedTable}
              setSelectedTable = {selectedTable}
              handleDeleteCell = {handleDeleteCell}

              // For takeaway carts
              handleAddTakeAwayCart={handleAddTakeAwayCart}
              handleChooseTakeAwayCart={handleChooseTakeAwayCart}
              handleDeleteTakeAwayCart={handleDeleteTakeAwayCart}
              takeAwayanchorEl={anchorEl}
              setTakeAwayAnchorEl={setAnchorEl}
              selectedTakeAwayCart={selectedTakeAwayCart}
              takeAwayCarts = {cashierCartList.filter(cart => cart.type === "away")}
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
                      {!cashierCartList ? [] :  cashierCartList.find(item => {
                        if(selectedTable.type === "away"){
                          if(selectedTakeAwayCart){
                            return item.table.uuid === selectedTable.uuid && item.uuid === selectedTakeAwayCart;
                          }
                          return item.type == "away";
                          
                        }
                        return item.table.uuid === selectedTable.uuid;
                      })?.cartItem?.map((row, index) => {
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
                              // (cashierCartList.find(item => item.table.uuid === selectedTable.uuid)?.cartItem?.length || 0) - index
                              index + 1
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
            </CashierCartSummary>

          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Cashier;
