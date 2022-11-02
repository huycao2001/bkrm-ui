import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import customizeSlice from "./slice/customizeSlice";


const store = configureStore({
    reducer : {
        auth :authSlice.reducer,
        customize: customizeSlice.reducer
    },
})

export default store