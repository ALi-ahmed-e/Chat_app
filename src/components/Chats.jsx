import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { db } from '../firebase';
import { ChatTransporter } from '../store/slices/ChatSlice';

const Chats = () => {
    const [Chats, setChats] = useState([]);
    const user = useSelector(t => t.auth.user)
    const currentChat = useSelector(e => e.chat.user)
    const [err, seterr] = useState();
    const dispatch = useDispatch()

    useEffect(() => {
        const getChats = () => {

            const unsub = onSnapshot(doc(db, "userChats", user.uid), (doc) => {
                Object.entries(doc.data()) == '' ? seterr(<span className=' mx-auto my-5 opacity-75'>You dont have friends.</span>) : seterr()
                setChats(doc.data())
            });

            return () => { unsub() }
        }
        user.uid && getChats()


    }, [user.uid]);


    const select = (e) => {
        dispatch(ChatTransporter({
            user: e,
            chatId: user.uid > e.uid ? user.uid + e.uid : e.uid + user.uid
        }))
    }

    return (
        <div className=' flex flex-col  overflow-scroll scroller'>



            {Object.entries(Chats)?.sort((a, b) => b[1].date - a[1].date).map(e =>
             
             <div key={Math.random()} onClick={() => select(e[1].userInfo)} className={` w-full h-16 flex items-center border-b-[0.5px] ${currentChat?.uid == e[1].userInfo.uid ? 'bg-slate-800' : ''} transition-all border-slate-700 mx-auto hover:bg-slate-800 cursor-pointer`}>
                    <img src={e[1].userInfo.image} className=" w-14 h-14 rounded-full  mx-2" alt="" />
                    <div>
                        <div>{e[1].userInfo.name}</div>
                        <div className=' text-xs text-slate-200'>{
                            e[1].lastMessage && e[1].lastMessage.text.length < 14 ? e[1].lastMessage.text : e[1].lastMessage && e[1].lastMessage.text.slice(0, 14) + '...'
                        }</div>
                    </div>
                </div>
            )}


            {err}

            {Chats == '' && Array(6).fill('').map(e => <div key={Math.random()} className=' w-full h-16 flex items-center border-b-[0.5px] border-slate-700 mx-auto hover:bg-slate-800 cursor-pointer mt-2 pb-2'>
                <div className=" w-14 h-14 rounded-full  mx-2 bg-slate-700 animate-pulse"></div>
                <div><div className=' w-14 h-3 rounded-md animate-pulse bg-slate-700'></div>
                </div>
            </div>)}


        </div>
    )
}

export default Chats