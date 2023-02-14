import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";





const ChatSlice = createSlice({
    name: 'Chat',
    initialState: {
        user:{},
        chatId:null,
        notifications:[]
    },
    reducers: {
        ChatTransporter(state, action) {
            state.user = action.payload.user
            state.chatId = action.payload.chatId

        },
        Resetin(state, action) {
            state.user = {}
            state.chatId = null

        },
        notifications(state, action) {
            state.notifications = JSON.parse(action.payload)

        }
    },
   



})
export default ChatSlice.reducer
export const {ChatTransporter,Resetin,notifications} = ChatSlice.actions