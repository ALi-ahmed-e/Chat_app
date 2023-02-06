import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";





const ChatSlice = createSlice({
    name: 'Chat',
    initialState: {
        user:{},
        chatId:null
    },
    reducers: {
        ChatTransporter(state, action) {
            state.user = action.payload.user
            state.chatId = action.payload.chatId

        }
    },
   



})
export default ChatSlice.reducer
export const {ChatTransporter} = ChatSlice.actions