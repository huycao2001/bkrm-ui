import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
//import style
import useStyles from "../../../components/TableCommon/style/mainViewStyle";
import { grey } from "@material-ui/core/colors";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { ReceiptPrinter } from "../../../components/ReceiptPrinter/ReceiptPrinter";
import { CartBottom } from "../../../components/Button/CartButton";
import AddInventory from "../../InventoryView/Inventory/AddInventory/AddInventory";
import AddIcon from "@material-ui/icons/Add";

//import library
import {
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
  Button
} from "@material-ui/core";
import SearchBarCode from "../../../components/SearchBar/SearchBarCode";
import useMediaQuery from "@material-ui/core/useMediaQuery";

//import constant
import * as HeadCells from "../../../assets/constant/tableHead";

//import project
//rieng
import CartSummary from "../../../components/CheckoutComponent/CheckoutSummary/CartSummary/NewCartSummary";
import { CartRow, CartRowMini } from "./CartTableRow/CartTableRow";
//chung
import MenuProduct from "../../../components/MenuProduct/MenuProduct";
import ChangeCartBtn from "../../../components/CheckoutComponent/ChangeCartBtn/ChangeCartBtn";
import SearchProduct from "../../../components/SearchBar/SearchProduct";
import TableHeader from "../../../components/TableCommon/TableHeader/TableHeader";
import TableWrapper from "../../../components/TableCommon/TableWrapper/TableWrapper";
import {
  getComparator,
  stableSort,
} from "../../../components/TableCommon/util/sortUtil";

import orderApi from "../../../api/orderApi";
// update state
import update from "immutability-helper";
import { useDispatch, useSelector } from "react-redux";
import SnackBarGeneral from "../../../components/SnackBar/SnackBarGeneral";
import customerApi from "../../../api/customerApi";
// FILE này xử lý state -> connect search bar, table, với summary lại + quản lý chọn cart
import { calculateTotalQuantity } from "../../../components/TableCommon/util/sortUtil";
import { CartMiniTableRow, VarianceProductMiniTableRow } from "../../../components/MiniTableRow/MiniTableRow";
import branchApi from "../../../api/branchApi";
import setting from "../../../assets/constant/setting";
import { infoActions } from "../../../store/slice/infoSlice";
import productApi from "../../../api/productApi";
import { statusAction } from "../../../store/slice/statusSlice";
import promotionCouponApi from '../../../api/promotionCouponApi';
import { loadingActions } from "../../../store/slice/loadingSlice";
import ModalWrapperWithClose from "../../../components/Modal/ModalWrapperWithClose";
import { enableMapSet } from "@reduxjs/toolkit/node_modules/immer";

const Cart = () => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [selectedBranch, setSelectedBranch] = useState({});
  const [disable, setDisable] = useState(false)


  // redux
  const info = useSelector((state) => state.info);
  const searchBarState = info.searchBarState;
  const store_uuid = info.store.uuid;
  const branch = info.branch;
  const branch_uuid = info.branch.uuid;
  const store_setting = info.store.general_configuration
    ? JSON.parse(info.store.general_configuration)
    : setting;

  const defaultPaymentAmount = store_setting?.defaultPaymentAmount.status && store_setting?.defaultPaymentAmount.cart 
  // console.log("store_setting",store_setting)
  // console.log("defaultPaymentAmount",defaultPaymentAmount)

    const canEnterDiscountWhenSell = store_setting?.canEnterDiscountWhenSell?.status

  const [discountData, setDiscountData] = useState([]);

  const user_uuid = useSelector((state) => state.info.user.uuid);
  const dispatch = useDispatch();
  const [reloadProduct, setReloadProduct] = useState(false);

  const loadCartLocalStorage = () => {
    if (window.localStorage.getItem("cartListData")) {
      const data = JSON.parse(window.localStorage.getItem("cartListData"));
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
        discountDetail:{value:'0', type:'VND' },
        selectedPromotion:null,
        otherFee:0
      },
    ];
  };



  const [cartList, setCartList] = React.useState(loadCartLocalStorage());
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    window.localStorage.setItem(
      "cartListData",
      JSON.stringify({ user_uuid: user_uuid, cartList: cartList })
    );
  }, [cartList]);




  useEffect(() => {
    if (products.length) {
      window.localStorage.setItem(
        "products",
        JSON.stringify({ 
          store_uuid: store_uuid, 
          branch_uuid: branch_uuid, 
          data: products })
      );
    }
  }, [products]);

  useEffect(() => {
    if (customers.length) {
      window.localStorage.setItem(
        "customers",
        JSON.stringify({ 
          store_uuid: store_uuid, 
          data: customers })
      );
    }
  }, [customers]);

  useEffect(() => {
    if (window.localStorage.getItem("products")) {
      const products = JSON.parse(window.localStorage.getItem("products"));
      if (products.store_uuid === store_uuid && products.branch_uuid === branch_uuid ) {
        // console.log(products.data)
        setProducts(products.data);
      }
    }
    if (window.localStorage.getItem("mode")) {
      const cartMode = JSON.parse(window.localStorage.getItem("mode"));
      if (cartMode.store_uuid === store_uuid ) {
        setTypeShow(cartMode.typeShow)
        setMode(cartMode.mode);
        setShowImage(cartMode.showImage);
        
      }
    }
    if (window.localStorage.getItem("customers")) {
      const customers = JSON.parse(window.localStorage.getItem("customers"));
      if (customers.store_uuid === store_uuid ) {
        setCustomers(customers.data);
      }
    }
  }, [store_uuid, branch_uuid])


  //// ----------II. FUNCTION
  const otherfee = store_setting?.vat

  let otherFeeMoney = otherfee?.listCost?.reduce((sum,fee)=>fee.type!=="%"? sum + Number(fee.value):sum , 0);


  // 1.Cart
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [addProduct, setAddProduct] = useState(false);

  const [isUpdateTotalAmount, setIsUpdateTotalAmount] = React.useState(false);

  const [openSnack, setOpenSnack] = React.useState(false);
  const [snackStatus, setSnackStatus] = React.useState({
    style: "error",
    message: "Tạo hóa đơn thất bại",
  });

  const xsScreen = useMediaQuery(theme.breakpoints.down("xs"));

  useEffect(() => {
    updateTotalAmount();
  }, [isUpdateTotalAmount]);


  const handleSearchCustomer = async (searchKey) => {
    try {
      const response = await customerApi.getCustomers(store_uuid, {
        search_key: searchKey,
      });
      setCustomers(response.data);
    } catch (err) {
      // console.log(err);
    }
  };

  const updateCustomerVouchers = async (customerUuid, vouchers) => {
    try {
      const response = await customerApi.updateCustomerVouchers(
        customerUuid,
        vouchers
      );
      dispatch(
        statusAction.successfulStatus("Cập nhật voucher của khách thành công")
      );
    } catch (err) {
      // console.log(err);
      dispatch(statusAction.failedStatus("Cập nhật vouchers thất bại"));
    }
  };

  const loadProducts = async () => {
    try {
      const response = await productApi.searchBranchProduct(
        store_uuid,
        branch_uuid,
        ""
      );
      setProducts(response.data)

    } catch (err) {
      // console.log(err)
    }
    // dispatch(infoActions.setProducts(response.data));
  };

  useEffect(() => {
    // console.log("reload heer")
    loadProducts();
  }, [reloadProduct])

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await customerApi.getCustomers(store_uuid);
        const customers = response.data.map((cust) => ({
          ...cust,
          vouchers: JSON.parse(cust.vouchers ? cust.vouchers : "[]"),
        }));
        setCustomers(customers);
      } catch (err) {
        // console.log(err);
      }
    };
    const loadPromotionCoupons = async () => {
      const response = await promotionCouponApi.getActivePromotionVoucher(store_uuid)
      // console.log("eeeeee",response)
      setDiscountData(response.promotions);
    } 
    if (store_uuid) {
      loadCustomers();
      loadPromotionCoupons()
    }
    if (store_uuid && branch_uuid) {
      loadProducts();
    }

    //  loadingActions.finishLoad();

    const intervalID = setInterval(() => {
      if (store_uuid && branch_uuid) {
        loadProducts();
      }
    }, 60000 * 5);

    return () => {
      clearInterval(intervalID)
    }
  }, [store_uuid, branch_uuid]);
  const [reloadCustomers, setReloadCustomers] = useState(false);
  useEffect(() => {
    const loadingCustomer = async () => {
      try {
        const response = await customerApi.getCustomers(store_uuid);
        setCustomers(response.data);
      } catch (err) {
        // console.log(err);
      }
    };
    if (store_uuid) {
      loadingCustomer();
    }
  }, [reloadCustomers]);



  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSnackBar = (event, reason) => {
    setOpenSnack(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleChoose = (index) => {
    setSelectedIndex(index);
    handleClose();
  };
  const handleAdd = () => {
    // ADD CART
    setCartList([
      ...cartList,
      {
        customer: null,
        cartItem: [],
        total_amount: "0",
        paid_amount: "0",
        payment_method: "cash",
        discount: "0",
        delivery: false,
        scores: "0",
        discountDetail:{value:'0', type:'VND' },
        selectedPromotion:null,
        otherFee:0

      },
    ]);
    setSelectedIndex(cartList.length);
    handleClose();
  };

  const handleDeleteAllItem = (index) => {
    const newCartList = [...cartList];

    // newCartList[index].cartItem = [];
    newCartList[index] ={
      customer: null,
      cartItem: [],
      total_amount: "0",
      paid_amount: "0",
      payment_method: "cash",
      discount: "0",
      delivery: false,
      scores: "0",
      discountDetail:{value:'0', type:'VND' },
      selectedPromotion:null,
      otherFee:0

    };

    setCartList(newCartList)

    handleClose();
  }

  const handleDelete = (index) => {
    // DELETE CART
    cartList.splice(index, 1);
    if (cartList.length === 0) {
      setCartList([
        {
          customer: null,
          cartItem: [],
          total_amount: "0",
          paid_amount: "0",
          discount: "0",
          payment_method: "cash",
          delivery: false,
          scores: "0",
          discountDetail:{value:'0', type:'VND' },
          selectedPromotion:null,
          otherFee:0
        },
      ]);
    } else {
      setCartList(cartList);
    }
    if (selectedIndex === index) {
      setSelectedIndex(0);
    } else if (selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1);
    }
    
    handleClose();
  };
  const updateCustomer = (value) => {
    let newArr = [...cartList]; // copying the old datas array
    newArr[selectedIndex].customer = value;
    setCartList(newArr);
  };

  //2. Table sort
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState(null);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  //mode
  const [mode, setMode] = React.useState(false);
  const [showImage, setShowImage] = React.useState(true);
  const [typeShow, setTypeShow] = useState('list')
  const handleChangeMode = (event) => {
    setMode(event.target.checked);
  };
  useEffect(() => {
    window.localStorage.setItem(
      "mode",
      JSON.stringify({store_uuid: store_uuid,  mode: mode, typeShow: typeShow , showImage:showImage})
    );
  }, [mode,typeShow,showImage]);

  // handle search select item add to cart
  const handleSearchBarSelect = (selectedOption) => {
    let itemIndex = cartList[selectedIndex].cartItem.findIndex(
      (item) => item.uuid === selectedOption.uuid
    );
    let item = cartList[selectedIndex].cartItem.find(
      (item) => item.uuid === selectedOption.uuid
    );
    if (!item) {
      let newCartItem = {
        id: cartList[selectedIndex].cartItem.length,
        uuid: selectedOption.uuid,
        quantity: selectedOption.has_batches ? 0 : 1,
        product_code: selectedOption.product_code,
        bar_code: selectedOption.bar_code,
        unit_price: selectedOption.list_price,
        img_urls: selectedOption.img_urls,
        name: selectedOption.name,
        branch_quantity: Number(selectedOption.branch_quantity),
        has_batches: selectedOption.has_batches,
        batches: selectedOption.batches,
        branch_inventories: selectedOption.branch_inventories,
      };

      let newCartList = update(cartList, {
        [selectedIndex]: { cartItem: { $push: [newCartItem] } },
      });
      setCartList(newCartList);
      setIsUpdateTotalAmount(!isUpdateTotalAmount);
      return;
    }

    if (!item.has_batches) {
      handleChangeItemQuantity(
        selectedOption.uuid,
        cartList[selectedIndex].cartItem[itemIndex].quantity + 1
      );
    } else {
      if (
        cartList[selectedIndex].cartItem[itemIndex].selectedBatches?.length ===
        1
      ) {
        handleChangeItemQuantity(
          selectedOption.uuid,
          cartList[selectedIndex].cartItem[itemIndex].quantity + 1
        );
        const newCartList = [...cartList];
        newCartList[selectedIndex].cartItem[
          itemIndex
        ].selectedBatches[0].additional_quantity += 1;
        setCartList(newCartList);
      }
    }
  };

  const handleDeleteItemCart = (itemUuid) => {
    let itemIndex = cartList[selectedIndex].cartItem.findIndex(
      (item) => item.uuid === itemUuid
    );
    let newCartList = update(cartList, {
      [selectedIndex]: { cartItem: { $splice: [[itemIndex, 1]] } },
    });
    setCartList(newCartList);
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };

  const handleChangeItemQuantity = (itemUuid, newQuantity) => {
    let itemIndex = cartList[selectedIndex].cartItem.findIndex(
      (item) => item.uuid === itemUuid
    );
    let item = cartList[selectedIndex].cartItem.find(
      (item) => item.uuid === itemUuid
    );
    if(isNaN(newQuantity)){newQuantity = ''}
    if (newQuantity === 0 && !item.has_batches) {
      handleDeleteItemCart(itemUuid);
      return;
    }
    if (newQuantity < 0){return } 
  
    let newCartList = [...cartList];
    newCartList[selectedIndex].cartItem[itemIndex].quantity = newQuantity;
    setCartList(newCartList);
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };

  const handleUpdateBatches = (itemUuid, selectedBatches) => {
    let itemIndex = cartList[selectedIndex].cartItem.findIndex(
      (item) => item.uuid === itemUuid
    );

    if (itemIndex === -1) return;
    const newCartList = [...cartList];
    newCartList[selectedIndex].cartItem[itemIndex].selectedBatches =
      selectedBatches;

    setCartList(newCartList);
  };

  const handleChangeItemPrice = (itemUuid, newPrice) => {
    if (newPrice < 0){return } 

    let itemIndex = cartList[selectedIndex].cartItem.findIndex(
      (item) => item.uuid === itemUuid
    );
    let newCartList = update(cartList, {
      [selectedIndex]: {
        cartItem: { [itemIndex]: { unit_price: { $set: newPrice } } },
      },
    });
    setCartList(newCartList);
    setIsUpdateTotalAmount(!isUpdateTotalAmount);
  };

  const handleSelectCustomer = (selectedCustomer) => {
    let newCartList = update(cartList, {
      [selectedIndex]: { customer: { $set: selectedCustomer } },
    });
    setCartList(newCartList);
  };

  const handleUpdatePaidAmount = (amount) => {
    if (amount < 0){return } 
    let newCartList = update(cartList, {
      [selectedIndex]: { paid_amount: { $set: amount } },
    });
    setCartList(newCartList);
  };
  const handleUpdateSelectedPromotion = (selectedPromotion) => {
    let newCartList = update(cartList, {
      [selectedIndex]: { selectedPromotion: { $set: selectedPromotion } },
    });
    setCartList(newCartList);
  };

  const handleUpdatePaymentMethod = (method) => {
    let newCartList = update(cartList, {
      [selectedIndex]: { payment_method: { $set: method } },
    });
    setCartList(newCartList);
  };
  const handleUpdateDiscountDetail = (obj) => {
  
    
    // newCartList = update(newCartList, {
    //   [selectedIndex]: {
    //     otherFee: { $set:totalOtherFee },
    //   },
    // });

    let discountUpdate =  obj.type === '%'?( (Number(obj.value) * Number(cartList[selectedIndex].total_amount)/100/100).toFixed() * 100).toString() : obj.value 


    let percentFee = otherfee?.listCost?.reduce((sum,fee)=>fee.type==="%"? sum + Number(fee.value):sum , 0);
    let totalOtherFee = percentFee * (Number(cartList[selectedIndex].total_amount) - Number(discountUpdate))/100 +  otherFeeMoney


    let newCartList = update(cartList, {
      // [selectedIndex]: { discountDetail: { $set: obj } , discount:{ $set: discountUpdate }, paid_amount:{ $set: (Number(cartList[selectedIndex].total_amount) -Number(discountUpdate)).toString() }},
      [selectedIndex]: defaultPaymentAmount? { discountDetail: { $set: obj } , discount:{ $set: discountUpdate },  otherFee: { $set:totalOtherFee },paid_amount:{ $set: (Number(cartList[selectedIndex].total_amount) -Number(discountUpdate)+ Number(totalOtherFee)).toString() }}:
        { discountDetail: { $set: obj } , discount:{ $set: discountUpdate }, otherFee: { $set:totalOtherFee }} ,

    });
  
    setCartList(newCartList);
  };

  const handleUpdateDiscount = (amount) => {
    // if (amount > cartList[selectedIndex].total_amount) {
    //   return;
    // }
    let newCartList = update(cartList, {

      [selectedIndex]:defaultPaymentAmount? { discount: { $set: amount },paid_amount: { $set: (Number(cartList[selectedIndex].total_amount) -Number(amount)).toString() }  }:
      // [selectedIndex]:defaultPaymentAmount? { discount: { $set: amount }}:

      { discount: { $set: amount } },

    });


 


    if( defaultPaymentAmount){
      newCartList = update(newCartList, {
        [selectedIndex]: {
          // paid_amount: { $set: (Number(cartList[selectedIndex].total_amount) - Number(amount) + Number(totalOtherFee)).toString() },
        },
      }) };

    //

    if (store_setting?.customerScore.status) {
      newCartList = update(newCartList, {
        [selectedIndex]: {
          scores: {
            $set: parseInt(
              (cartList[selectedIndex].total_amount - amount) /
                store_setting?.customerScore.value
            ),
          },
        },
      });
    }


    setCartList(newCartList);
  };

  const handleCheckDelivery = (delivery) => {
    let newCartList = update(cartList, {
      [selectedIndex]: { delivery: { $set: delivery } },
    });

    setCartList(newCartList);
  };

  const updateTotalAmount = () => {
    let total = 0;
    cartList[selectedIndex].cartItem.forEach((item) => {
      total += item.unit_price * item.quantity;
    });

    let newCartList = update(cartList, {
      [selectedIndex]: { total_amount: { $set: total } },
    });

    // newCartList = update(newCartList, {
    //   [selectedIndex]: {
    //     paid_amount: { $set: total - cartList[selectedIndex].discount },
    //   },
    // }) ;
    // 

    //
   
    let percentFee = otherfee?.listCost?.reduce((sum,fee)=>fee.type==="%"? sum + Number(fee.value):sum , 0);
    let totalOtherFee = percentFee * (Number(total) - Number(cartList[selectedIndex].discount))/100 +  otherFeeMoney
    // console.log("percentFee",percentFee)
    newCartList = update(newCartList, {
      [selectedIndex]: {
        otherFee: { $set:totalOtherFee },
      },
    });


    if( defaultPaymentAmount){
    newCartList = update(newCartList, {
      [selectedIndex]: {
        paid_amount: { $set: total - cartList[selectedIndex].discount + totalOtherFee },
      },
    }) };
    // 
    if (store_setting?.customerScore.status) {
      newCartList = update(newCartList, {
        [selectedIndex]: {
          scores: {
            $set: parseInt(
              (total - cartList[selectedIndex].discount + totalOtherFee) /
                store_setting?.customerScore.value
            ),
          },
        },
      });
    }

    // 
    
    setCartList(newCartList);
  };

  const[code,setCode] =React.useState("")
  const [openPopUpWarning, setOpenPopUpWarning] = useState(false);
  const handleCloseWarning = () =>{
    setOpenPopUpWarning(false)
  }

  // console.log("otherFeeeee",cartList[selectedIndex]?.otherFee)
  

  const handleConfirm = async () => {
    let cart = cartList[selectedIndex];

    var emptyCart = cart.cartItem.length === 0;
    const printReceiptWhenSell = store_setting?.printReceiptWhenSell;
    const canSellWhenNegativeQuantity = store_setting?.canSellWhenNegativeQuantity;
    const alowDebt =  store_setting?.alowDebt;
    // var correctQuantity = cart.cartItem.every(function (element, index) {
    //   if (element.quantity > element.branch_quantity) return false;
    //   else return true;
    // });

    var correctQuantity = store_setting?.inventory.status && !canSellWhenNegativeQuantity.status
      ? cart.cartItem.every(function (element, index) {
          if (element.quantity > element.branch_quantity) return false;
          else return true;
        })
      : true;

    var notExistNullQuantity =  cart.cartItem.every(function (element, index) {
      if (element.quantity === '' || Number(element.quantity)===0) return false;
      else return true;
    })
    var notExistZeroPrice =  cart.cartItem.every(function (element, index) {
      if (Number(element.unit_price)  === 0) return false;
      else return true;
    })

    if (emptyCart || !correctQuantity || !notExistNullQuantity|| (!alowDebt.status && Number(cart.paid_amount) < Number(cart.total_amount) - Number(cart.discount) )) {
      setOpenSnack(true);
      if (emptyCart) {
        setSnackStatus({
          style: "error",
          message: "Giỏ hàng trống",
        });
      } else if ( !correctQuantity ) {
        setSnackStatus({
          style: "error",
          message: "Giỏ hàng bị vượt tồn kho",
        });
      }else if(!notExistNullQuantity){
        setSnackStatus({
          style: "error",
          message: "Có sản phẩm chưa nhập số lượng",
        });
      }else{
        setSnackStatus({
          style: "error",
          message: "Không cho phép khách hàng nợ",
        });
      }
    } 

    else if(!notExistZeroPrice || ( cart.paid_amount < cart.total_amount - cart.discount && !cart.customer)){
        setOpenPopUpWarning(true)
        return 
    }
    else {
      handleConfirmCallApi()


      // let d = moment.now() / 1000;

      // let orderTime = moment
      //   .unix(d)
      //   .format("YYYY-MM-DD HH:mm:ss", { trim: false });

      // let details = cart.cartItem.map((item) => ({ ...item, discount: "0" }));
      // // console.log(cart.paid_amount, cart.total_amount, cart.discount);
      // let body = {
      //   customer_uuid: cart.customer ? cart.customer.uuid : "",
      //   total_amount: cart.total_amount.toString(),
      //   payment_method: cart.payment_method,
      //   paid_amount: Math.min(cart.paid_amount, Number(cart.total_amount) - Number(cart.discount)),
      //   discount: cart.discount,
      //   status:
      //     cart.paid_amount < cart.total_amount - cart.discount
      //       ? "debt"
      //       : "closed",
      //   details: details,
      //   creation_date: orderTime,
      //   paid_date: orderTime,
      //   tax: "0",
      //   shipping: "0",
      //   delivery: cart.delivery,
      //   is_customer_order: false,
      //   points: cart.scores,
      // };

      // try {
      //   let res = await orderApi.addOrder(store_uuid, branch.uuid, body);
        
      //   setSnackStatus({
      //     style: "success",
      //     message: "Tạo hóa đơn thành công: " + res.data.order.order_code,
      //   });
      //   setOpenSnack(true);
      //   if (printReceiptWhenSell.status && printReceiptWhenSell.cart) {
      //     setCode(res.data.order.order_code)
      //     handlePrint();
      //   }
      //   handleDelete(selectedIndex);
      // } catch (err) {
      //   setSnackStatus({
      //     style: "error",
      //     message: "Tạo hóa đơn thất bại!",
      //   });
      //   setOpenSnack(true);
      //   // console.log(err);
      // }
      // loadProducts()
    }
  };
  const handleConfirmCallApi  = async () => {
    const printReceiptWhenSell = store_setting?.printReceiptWhenSell;
    let cart = cartList[selectedIndex];
    
    let d = moment.now() / 1000;

    let orderTime = moment
      .unix(d)
      .format("YYYY-MM-DD HH:mm:ss", { trim: false });

    let details = cart.cartItem.map((item) => ({ ...item, discount: "0" }));
    // console.log(cart.paid_amount, cart.total_amount, cart.discount);
    let body = {
      customer_uuid: cart.customer ? cart.customer.uuid : "",
      total_amount: cart.total_amount.toString(),
      payment_method: cart.payment_method,
      paid_amount: Math.min(cart.paid_amount, Number(cart.total_amount) - Number(cart.discount)),
      discount: cart.discount,
      status:
        cart.paid_amount < cart.total_amount - cart.discount
          ? "debt"
          : "closed",
      details: details,
      creation_date: orderTime,
      paid_date: orderTime,
      tax: "0",
      shipping: "0",
      delivery: cart.delivery,
      is_customer_order: false,
      points: cart.scores,
      //
      otherFee:cart.otherFee
    };

    try {
      setDisable(true);
      let res = await orderApi.addOrder(store_uuid, branch.uuid, body);
      
      setSnackStatus({
        style: "success",
        message: "Tạo hóa đơn thành công: " + res.data.order.order_code,
      });
      setOpenSnack(true);
      if (printReceiptWhenSell.status && printReceiptWhenSell.cart) {
        setCode(res.data.order.order_code)
        handlePrint();
      }
      handleDeleteAllItem(selectedIndex);
    } catch (err) {
      setSnackStatus({
        style: "error",
        message: "Tạo hóa đơn thất bại!",
      });
      setOpenSnack(true);
      // console.log(err);
    }
    setDisable(false)
    loadProducts()
  }




  //print

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  //   }
  // };
  const [barcodeChecked, setBarcodeChecked] = useState(true);

  // console.log("typeShow==='image''",typeShow)
  // console.log("store_setting?.printReceiptWhenSell",store_setting?.printReceiptWhenSell)
  return (
    <>
    <Grid  container   direction="row" justifyContent="space-between"  alignItems="center"  spacing={2}>
      {addProduct &&
       <AddInventory
        open={addProduct}
        handleClose={() => {
          setAddProduct(false)
        }}
        setReload={() => {
          setReloadProduct(!reloadProduct)
        }}
      />}{" "}
    
    <SnackBarGeneral handleClose={handleCloseSnackBar} open={openSnack} status={snackStatus}  />
     
     
     {/* 1. TABLE CARD (left) */}
      <Grid item xs={12} sm={typeShow==='list' && mode?7:8}>
        <Card className={classes.root}>
          <Box style={{ padding: xsScreen ? 0 : 30,  minHeight: "79vh", paddingBottom: 0,}}  >
            <Box style={{ height: xsScreen ? null : "69vh" }}>
              {/* 1.1 TITLE + BTN CHANGE CART +  SEARCH */}
              <Grid container direction="row"  justifyContent="space-between" alignItems="center" style={{ marginTop: -10, marginBottom: 30 }}   >
                <Grid>
                  <ListItem>
                    {/* 1.1.1 Title */}
                    <Typography variant="h3"> Bán hàng </Typography>
                    <Typography variant="h3"  style={{  marginLeft: 10,  color: theme.customization.primaryColor[500], }} >
                      {" "}   # {selectedIndex + 1}
                    </Typography>
                    {/* 1.1.2. Btn Channge Cart */}
                    <ChangeCartBtn
                      selectedIndex={selectedIndex}
                      anchorEl={anchorEl}
                      cartList={cartList}
                      handleClick={handleClick}
                      handleClose={handleClose}
                      handleChoose={handleChoose}
                      handleDelete={handleDelete}
                      handleAdd={handleAdd}
                      isCart={true}
                    />
                  </ListItem>
                </Grid>
                <Grid>
                <Grid container alignItems="center">
                  {!mode? 
                  <>
                    <Grid item>
                      <FormControlLabel   control={ <Switch  size="small"  checked={searchBarState === 'barcode'}  onChange={(e, checked) => { dispatch(infoActions.setSearchBarState(checked ? 'barcode' : 'search'))  }} color="primary"  />  } label={"Dùng mã vạch"}  />
                    </Grid>
                    <Grid item>
                      {searchBarState === 'barcode' ? (
                        <SearchBarCode  products={products} 
                          handleSearchBarSelect={handleSearchBarSelect}
                        />
                      ) : (
                        <SearchProduct
                          products={products} 
                          handleSearchBarSelect={handleSearchBarSelect}
                          isCart={true}
                        />
                      )}
                    </Grid>
                  </>:
                 <SearchProduct products={products} setProducts={setProducts} isFilter={true} />
                  }
                    {info.role === 'owner'?
                    <Grid item>
                      <ButtonBase
                        sx={{ borderRadius: "1px" }}
                        onClick={() => {
                          setAddProduct(true);
                        }}
                        style={{ marginLeft: 10 }}
                      >
                        <Avatar
                          variant="rounded"
                          className={classes.headerAvatar}
                        >
                          <Tooltip title="Thêm sản phẩm">
                            <AddIcon stroke={1.5} size="1.3rem" />
                          </Tooltip>
                        </Avatar>
                      </ButtonBase>
                    </Grid>:null}
                  </Grid>
                </Grid>
              </Grid>

              {/* 1.2 TABLE */}
              {!mode ? (
                  <TableWrapper isCart={true} >
                    <TableHeader
                      classes={classes}
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      headerData={HeadCells.CartHeadCells}
                      isCart={true}
                    />
                    <TableBody>
                      { stableSort( cartList[selectedIndex].cartItem, getComparator(order, orderBy) )
                      .map((row, index) => {
                        return (
                          <CartRow
                            key={`${row.uuid}_index`}
                            row={row}
                            handleUpdateBatches={handleUpdateBatches}
                            handleDeleteItemCart={handleDeleteItemCart}
                            handleChangeItemPrice={handleChangeItemPrice}
                            handleChangeItemQuantity={handleChangeItemQuantity}
                            discountData={discountData.filter(
                              (discount) => discount.discountKey === "product"
                            )}
                            index={cartList[selectedIndex].cartItem.length - index}
                            showImage={showImage}
                          />
                        );
                      })}
                    </TableBody>
                  </TableWrapper>   
 
              ) : (
                //  Mode nha hang
                <MenuProduct 
                  products={products} 
                  handleSearchBarSelect={handleSearchBarSelect}
                  isCart={true}
                  selectedItem={cartList[selectedIndex]?.cartItem}
                  typeShow={typeShow}
                  setTypeShow={setTypeShow}
                  setProducts={setProducts}
                  showImage={showImage}
                  setShowImage={setShowImage}
                />
              )}
            </Box>
            {/* 1.3 CHANGE MODE  */}
            
            {/* <FormControlLabel control={<Switch  size="small"  checked={mode} onChange={handleChangeMode} />}style={{ display: "flex",  justifyContent: "flex-end",   margin: -20,  marginTop: 45, }} /> */}


          </Box>
          <FormControlLabel control={<Switch  size="small"  checked={mode} onChange={handleChangeMode} />}style={{ display: "flex",  justifyContent: "flex-end",  }} />

        </Card>
      </Grid>
      
      {/* 2.SUMMARY CARD (right) */}
      <Grid item xs={12} sm={typeShow==='list' && mode?5:4} className={classes.root}>
        <Card className={classes.root}>
          <Box style={{ padding: 0, minHeight: "82vh" }}>
            {/* {!mode ? ( */}
              <CartSummary
                disable={disable}
                setSelectedBranch={setSelectedBranch}
                selectedBranch={selectedBranch}
                cartData={cartList[selectedIndex]}
                handleSelectCustomer={handleSelectCustomer}
                handleSearchCustomer={handleSearchCustomer}
                handleUpdateDiscount={handleUpdateDiscount}
                handleUpdatePaidAmount={handleUpdatePaidAmount}
                handleUpdatePaymentMethod={handleUpdatePaymentMethod}
                handleCheckDelivery={handleCheckDelivery}
                handleConfirm={handleConfirm}
                currentCustomer={cartList[selectedIndex].customer}
                currentBranch={branch}
                mode={mode}
                customers={customers}
                reloadCustomers={() => setReloadCustomers(!reloadCustomers)}
                //discount
                discountData={discountData.filter(
                  (discount) => discount.discountKey === "invoice"
                )}
                isScore={store_setting?.customerScore.status}
                handleUpdateDiscountDetail={handleUpdateDiscountDetail}
                handleUpdateSelectedPromotion={handleUpdateSelectedPromotion}
              >
                {!mode ? null:
                  <TableContainer  style={{ maxHeight: !canEnterDiscountWhenSell && mode ?"44vh":"37vh", height:!canEnterDiscountWhenSell && mode ?"44vh": "37vh",}} >
                   <Table  size="small">

                    <TableBody>
                      {stableSort( cartList[selectedIndex].cartItem, getComparator(order, orderBy) )
                        .map((row, index) => {
                        return (
                          <CartRow
                            key={`${row.uuid}_index`}
                            row={row}
                            handleUpdateBatches={handleUpdateBatches}
                            handleDeleteItemCart={handleDeleteItemCart}
                            handleChangeItemPrice={handleChangeItemPrice}
                            handleChangeItemQuantity={handleChangeItemQuantity}
                            discountData={discountData.filter(
                              (discount) => discount.discountKey === "product"
                            )}
                            mini={true}
                            imageType={typeShow==='image' && mode}
                            index={cartList[selectedIndex].cartItem.length - index}
                            typeShow={typeShow}
                            showImage={showImage}

                          />
                        );
                      })}
                    </TableBody>
                    </Table>
                  </TableContainer>     
              }
              </CartSummary>
          </Box>
        </Card>
      </Grid>
      <PopUpWarningZeroPrice  open={openPopUpWarning} handleClose={handleCloseWarning} handleConfirmCallApi={handleConfirmCallApi} isDebtWarning={ cartList[selectedIndex].paid_amount < cartList[selectedIndex].total_amount - cartList[selectedIndex].discount && !cartList[selectedIndex].customer} 
      existZeroPrice={!cartList[selectedIndex].cartItem.every(function (element, index) { if (Number(element.unit_price)  === 0) return false; else return true;})} />
      {/* 3. Receipt */}
      <div style={{ display: "none" }}>
        <div ref={componentRef}>
          <ReceiptPrinter cart={cartList[selectedIndex]} code={code} type={store_setting?.printReceiptWhenSell.cartModal}/>
        </div>
      </div>
    </Grid>
              {/* <ReceiptPrinter cart={cartList[selectedIndex]} code={code} /> */}
</>
  );
};

export default Cart;


const PopUpWarningZeroPrice = ({open,handleClose,handleConfirmCallApi, isDebtWarning,existZeroPrice}) =>{
  const theme = useTheme();

  return (
    <ModalWrapperWithClose title={isDebtWarning?"Hoá đơn nợ chưa có thông tin khách hàng":"Có sản phẩm đang có giá bán bằng 0"} open={open} handleClose={handleClose}>
      <Typography style={{ marginTop: 10, marginBottom: 10 }}>
      {isDebtWarning?"Bạn chưa nhập thông tin khách hàng. Hệ thống không theo dõi công nợ với khách lẻ." :"Giỏ hàng đang có sản phẩm có giá bán bằng 0."}
      </Typography>
    {existZeroPrice && isDebtWarning?
    <>
      <Typography variant="h3" style={{ marginTop: 10, marginBottom: 10 }}>
        Có sản phẩm đang có giá bán bằng 0
      </Typography>
      <Typography style={{ marginTop: 10, marginBottom: 30 }}>
         Giỏ hàng đang có sản phẩm có giá bán bằng 0
      </Typography>
      </>:null}


      <Typography style={{ fontWeight: 600, color:theme.customization.primaryColor[500] }}>
        Bạn có chắc chắn muốn tiếp tục thanh toán?
      </Typography>

      <Grid item xs={12}style={{  display: "flex",  flexDirection: "row", justifyContent: "flex-end", paddingTop: 20, }} >
        <Button onClick={handleClose} variant="contained" size="small" style={{ marginRight: 20 }}color="secondary" >
          {" "} Huỷ{" "}
        </Button>
        <Button onClick={() => {handleConfirmCallApi(); handleClose()}} variant="contained" size="small" color="primary" >
          Xác nhận{" "}
        </Button>
      </Grid>
    </ModalWrapperWithClose>
  )
}




 // Dien thoai
//  cartList[selectedIndex].cartItem.map((row, index) => {
//   return (
//     <CartMiniTableRow
//       row={row}
//       handleDeleteItemCart={handleDeleteItemCart}
//       handleChangeItemPrice={handleChangeItemPrice}
//       handleChangeItemQuantity={handleChangeItemQuantity}
//       discountData={discountData.filter(
//         (discount) => discount.discountKey === "product"
//       )}
//       isCart={true}
//     />
//   );
// })

// {xsScreen ? (
//   <CartBottom
//     numberItem={
//       calculateTotalQuantity(cartList[selectedIndex].cartItem)
//         ? calculateTotalQuantity(cartList[selectedIndex].cartItem)
//         : "0"
//     }
//   />
// ) : null}

/* <TableBody>
  {cartList[selectedIndex].cartItem.map((row, index) => {
    return <CartRowMini row={row} />;
  })}
</TableBody> */