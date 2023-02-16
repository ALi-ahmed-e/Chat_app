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
    const dltths = async (e) => {
        await updateDoc(doc(db, 'notifications', user.uid), {
            messages: arrayRemove(e)
        })

    }


    return (
        <div>


            {msgs.messages != '' ? <>

                <div className=" w-full text-center">
                    <button onClick={clear} className=" px-2 py-1 mx-auto rounded-md bg-red-700 hover:bg-red-800 ">Clear  {msgs.messages?.length} </button>
                </div>

                <div className=" h-[1px] w-[95%] bg-slate-500 mx-auto my-4" /></> : <div className=" w-full text-center">No notifications</div>}



            {msgs.messages?.sort((a, b) => b.date - a.date).map(e =>

                <div key={Math.random()} className="flex flex-col p-2 bg-gray-900 hover:opacity-90 m-2 shadow-md hover:shodow-lg rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">

                            <img src={e.senderImage} className=' w-16 h-16 rounded-2xl p-3 border border-gray-800 text-blue-400 ' alt="sender image" />
                            <div className="flex flex-col ml-3">
                                <div className="font-medium leading-none text-gray-100">
                                    {e.senderName}
                                </div>
                                <p className="text-sm text-gray-500 leading-none mt-1  ">
                                    {e.text.length > 6 ? `${e.text.slice(0, 8)}...` : e.text}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => dltths(e)} className="flex-no-shrink bg-red-500  px-1 hover:bg-red-600 ml-4 py-1 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider text-white rounded-md">
                            Delete
                        </button>
                    </div>
                </div>

            )}
        </div>
    )
}

export default Notificationn