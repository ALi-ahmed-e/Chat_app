import { arrayRemove, doc, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { db } from "../firebase"

const Notificationn = ({ msg }) => {
    const [msgs, setmsgs] = useState([]);
    const user = useSelector(t => t.auth.user)

    useEffect(() => {
        setmsgs(msg)
    }, [msg]);

    const clear = async () => {
        await updateDoc(doc(db, 'notifications', user.uid), {
            messages: []
        })
        
    }
    const dltths = async(e)=>{
        await updateDoc(doc(db, 'notifications', user.uid), {
            messages: arrayRemove(e)
        })
        
    }

    return (
        <div>
            <button onClick={clear} className=" px-2 py-1 rounded-md bg-red-700 hover:bg-red-800 mx-2">Clear</button>

            {msgs.messages?.sort((a, b) => b.date - a.date).map(e => <div key={Math.random()} className=' w-[95%]  py-1 px-2 rounded-md flex flex-col  border-[0.5px] border-slate-600 my-3 mx-auto'>

                <div className="font-bold text-base  ml-5">{e.senderName}</div>

                <span className="mt-1 text-sm   break-words  h-fit">{e.text}dddddddddddddddddddddddddddddddddddddddddd</span>




                <button onClick={()=>dltths(e)} className=" px-2 py-1 rounded-md bg-red-700 hover:bg-red-800 mx-2 block self-end scale-75">Delete</button>



            </div>)}
        </div>
    )
}

export default Notificationn