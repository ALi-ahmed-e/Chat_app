import { doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { db } from '../firebase';

const Messages = ({ chatId, other }) => {
    const user = useSelector(t => t.auth.user)
    const [messages, setmessages] = useState([]);



    useEffect(() => {

        const getMessages = () => {
            const unsub = onSnapshot(doc(db, "chats", chatId), (doc) => {

                doc.exists() && setmessages(doc.data().messages)
            });
            return () => { unsub() }
        }
        chatId && getMessages()
    }, [chatId]);








    return (<div className=' w-full h-full flex flex-col justify-start pb-5'>
        {messages.map(msg =>
          <div key={msg.date} className={`flex ${msg.senderId == user.uid ?'flex-row-reverse':'flex-row'} my-5 `}>

           <div className="w-10 h-10 rounded-full overflow-hidden mx-2">
               <img src={msg.senderId == user.uid ?user.image:other.image} />
           </div>

           <div className={`${msg.senderId == user.uid ?'bg-green-700':'bg-slate-500'}  py-2 w-fit px-4 rounded-lg max-w-[220px] break-words `}>{msg.text}</div>
       </div> 
     
        )}




    </div>)
}

export default Messages