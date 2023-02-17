import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { db } from '../firebase';
import { XMarkIcon } from '@heroicons/react/24/outline'

const Messages = ({ chatId, other }) => {
    const user = useSelector(t => t.auth.user)
    const [messages, setmessages] = useState([]);
    const [img2show, setimg2show] = useState();
    const msgRef = useRef()

    useEffect(() => {

        const getMessages = () => {
            const unsub = onSnapshot(doc(db, "chats", chatId), (doc) => {

                doc.exists() && setmessages(doc.data().messages)
            });
            return () => { unsub() }
        }
        chatId && getMessages()
    }, [chatId]);



    useEffect(() => {
        msgRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);




    return (<div className=' w-full h-full flex flex-col justify-start pb-3 overflow-scroll scroller'>






        {img2show && <div onClick={(e) => e.target.id != 'no' && setimg2show()} className=' fixed right-0 left-0 top-0 bottom-0 bg-black/60 z-50 backdrop-blur-lg flex items-center justify-center overflow-scroll scroller'>
            <XMarkIcon className=' w-12 cursor-pointer h-12 text-white fixed top-2 right-2' />
            <img id='no' src={img2show} className=' sm:max-w-lg max-w-[95%] rounded-md' alt="" />
        </div>}
        {messages.map(msg =>
            <div key={msg.date} className={`flex ${msg.senderId == user.uid ? 'flex-row-reverse' : 'flex-row'} my-5 `}>

                <div className="w-10 h-10 rounded-full overflow-hidden mx-2">
                    <img src={msg.senderId == user.uid ? user.image : other.image} />
                </div>

                <div ref={msgRef} className={`${msg.senderId == user.uid ? 'bg-green-700' : 'bg-slate-500'} max-w-[220px]  py-2 w-fit px-2 rounded-lg flex flex-col items-center justify-between `}>

                    {msg.img && <div className=' max-h-72 max-w-72 overflow-hidden  rounded-md -mx-1 cursor-pointer' onClick={() => setimg2show(msg.img)}>
                        <img src={msg.img} alt="" />
                    </div>}

                    <div className={` w-fit  rounded-lg max-w-[220px] break-words px-2`}>{msg.text}</div>

                </div>

            </div>)}




    </div>)
}

export default Messages