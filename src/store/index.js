import { configureStore } from "@reduxjs/toolkit";
import auth from'./slices/AuthSlice'
import chat from'./slices/ChatSlice'


export default configureStore({
    reducer:{auth,chat}
})