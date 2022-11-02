import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import customizeSlice from "./slice/customizeSlice";
import infoSlice from "./slice/infoSlice";


const store = configureStore({
    reducer : {
        auth :authSlice.reducer,
        customize: customizeSlice.reducer,
        info: infoSlice.reducer,
    },
})

export default store