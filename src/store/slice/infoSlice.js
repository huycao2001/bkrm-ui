import { createSlice } from "@reduxjs/toolkit";
const initialUserInfoSlice = {
  user: {
    user_name: "",
    name: "",
    email: "",
    email_verified_at: null,
    phone: "",
    date_of_birth: "",
    status: "",
    gender: null,
    uuid: "",
    created_at: "",
    updated_at: "",
    permissions: [],
  },
  store: {
    uuid: "",
    name: "",
    address: "",
    ward: "",
    province: "",
    phone: "",
    status: "",
    image: "",
    created_at: "",
    updated_at: "",
    district: "",
    general_configuration: null,
    store_configuration: "{\"facebook\":null,\"instagram\":null,\"custom_web\":null,\"img_url\":null}",
  },
  branch: {
    uuid: "",
    name: "",
    id: '',
  },
  role: "",
  products: [],
  searchBarState: "search",
  admin: {
    uuid: "",
    name: "",
    email: "",
    phone: "",
  }
  // branchsOfStore:[]
};
const infoSlice = createSlice({
  name: "info",
  initialState: initialUserInfoSlice,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setStore(state, action) {
      state.store = action.payload;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
    setBranch(state, action) {
      state.branch = action.payload;
    },
    setProducts(state, action) {
      state.products = action.payload;
    },
    setSearchBarState(state, action) {
      state.searchBarState = action.payload;
    },
    setAdmin(state, action) {
      state.admin = action.payload;
    }
    // setBranchsOfStore(state, action) {
    //   state.branchsOfStore = action.payload;
    // },
  },
});
export default infoSlice;
export const infoActions = infoSlice.actions;



const sampleData = {
  "user": {
      "id": 56,
      "name": "Huy Cao Bá",
      "email": "",
      "email_verified_at": null,
      "phone": "0769631631",
      "date_of_birth": "1991-01-01",
      "status": "active",
      "gender": null,
      "uuid": "eebd7680-67d1-4bb0-81f6-8e61b9d8d0e0",
      "created_at": "2023-02-01T10:10:52.000000Z",
      "updated_at": "2023-02-01T10:33:16.000000Z",
      "user_name": "huycaofb",
      "img_url": null,
      "customization": "{   fontFamily: `'Roboto', sans-serif`,   borderRadius: 12,   mode: \"Light\",   menu:\"1\",   themeBackground: colors.paper,   themeText: colors.grey900,   themeGreyText: colors.grey700,   primaryColor: blue,   secondaryColor: pink,   colorLevel: 50,   isSidebarOpen: null,   itemMenuOpen: -1,   showMenu:['salesModule','inventoryModule','hrModule','reportModule']  }",
      "approved_by_admin": 1,
      "permissions": [
          {
              "id": 1,
              "name": "inventory",
              "description": "Kho hàng"
          },
          {
              "id": 2,
              "name": "employee",
              "description": "Nhân sự"
          },
          {
              "id": 3,
              "name": "sales",
              "description": "Bán hàng"
          },
          {
              "id": 4,
              "name": "product",
              "description": "Sản phẩm"
          },
          {
              "id": 5,
              "name": "report",
              "description": "Báo cáo"
          }
      ]
  },
  "store": {
      "id": 56,
      "uuid": "c8da68b7-7f3f-451e-a683-bd6e0b0a2c21",
      "name": "huycaofbstore",
      "user_id": 56,
      "address": "188/6 Trần Bình Trọng",
      "ward": "Phường 03",
      "province": "Thành phố Hồ Chí Minh",
      "phone": null,
      "status": "active",
      "image": "http://103.163.118.100/bkrm-api/storage/app/public/store-images/store-default.png",
      "created_at": "2023-02-01T10:10:52.000000Z",
      "updated_at": "2023-02-01T10:10:52.000000Z",
      "district": "Quận 5",
      "web_page": null,
      "email_configuration": null,
      "web_configuration": null,
      "general_configuration": "{\"averageCost\":{\"status\":true},\"inventory\":{\"status\":true},\"recommendedProduct\":{\"status\":true},\"variation\":{\"status\":true},\"expiryDate\":{\"status\":true},\"customerScore\":{\"status\":true,\"value\":10000,\"exceptDiscountProduct\":false,\"exceptDiscountInvoice\":false,\"exceptVoucher\":false},\"email\":{\"status\":true,\"emailAddress\":\"bkrm.store@gmail.com\",\"password\":\"haikhangle\"},\"notifyDebt\":{\"status\":true,\"checkDebtAmount\":true,\"debtAmount\":10,\"checkNumberOfDay\":false,\"numberOfDay\":30,\"typeDebtDay\":null,\"canNotContinueBuy\":false,\"canNotContinueDebt\":false},\"returnLimit\":{\"status\":false,\"day\":7},\"canFixPriceSell\":{\"status\":true,\"cart\":true,\"import\":true,\"returnCart\":true,\"returnImport\":true},\"printReceiptWhenSell\":{\"status\":true,\"cart\":true,\"import\":false,\"returnCart\":false,\"returnImport\":false,\"order\":false,\"checkInventroy\":false,\"cartModal\":\"large\",\"titleNote\":\"\",\"contentNote\":\"\"},\"alowDebt\":{\"status\":true},\"canSellWhenNegativeQuantity\":{\"status\":true},\"canEnterDiscountWhenSell\":{\"status\":true},\"defaultPaymentAmount\":{\"status\":true,\"cart\":true,\"import\":true},\"discount\":{\"status\":true,\"applyMultiple\":false,\"applyOnline\":true},\"voucher\":{\"status\":true},\"delivery\":{\"status\":true},\"vat\":{\"status\":false,\"listCost\":[{\"key\":\"1\",\"costName\":\"\",\"value\":0,\"type\":\"%\"}]},\"orderLowStock\":{\"status\":true,\"choiceRec\":\"Auto\",\"dayAuto\":7,\"choiceQuantity\":\"select\",\"selectQuantity\":\"latest\",\"inputQuantity\":10,\"noHistoryQuantity\":10,\"selectSuplier\":\"latest\"},\"autoApplyDiscount\":{\"status\":true}}",
      "store_configuration": "{\"facebook\":\"null\",\"instagram\":\"null\",\"custom_web\":\"https:\\/\\/www.facebook.com\\/GiaLePhuongg\\/\",\"img_url\":\"https:\\/\\/www.cuahangcuatoi.net\\/bkrm-api\\/storage\\/app\\/public\\/store-images\\/kgmhOfDbKIx5tbJgAikwDzaWqm6lsilvFOaZY7Ua.png\"}",
      "banners": "[]",
      "store_type": "fb",
      "branches": [
          {
              "id": 136,
              "uuid": "b1147610-4037-49d6-be31-53b29fd1f75e",
              "name": "huycaofbstore",
              "address": "188/6 Trần Bình Trọng",
              "ward": "Phường 03",
              "province": "Thành phố Hồ Chí Minh",
              "phone": null,
              "status": "active",
              "created_at": "2023-02-01T10:10:52.000000Z",
              "updated_at": "2023-02-01T10:10:52.000000Z",
              "district": "Quận 5",
              "lat": null,
              "lng": null,
              "img_url": "",
              "allowed_reservation_overdue": "30 minutes",
              "timezone": "Asia/Ho_Chi_Minh"
          }
      ],
      "key": "AIzaSyDNzJMybCvn16gHHlj_A-8xgrA5gKvads0"
  },
  "branch": {
      "uuid": "b1147610-4037-49d6-be31-53b29fd1f75e",
      "name": "huycaofbstore",
      "id": 136
  },
  "role": "owner",
  "products": [],
  "searchBarState": "search",
  "admin": {
      "id": 4,
      "name": "Apollo 13",
      "email": "khoa.dosurefire@hcmut.edu.vn",
      "user_name": "apollo13",
      "phone": "0343191836",
      "uuid": "e820fd73-c428-44af-a9a8-10df93d027b7",
      "created_at": "2022-11-16T08:28:42.000000Z",
      "updated_at": "2022-11-16T08:28:42.000000Z"
  }
}