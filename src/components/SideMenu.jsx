import React, { useEffect, useState } from 'react'
import { Bars3CenterLeftIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useDispatch, useSelector } from 'react-redux'
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from '../firebase'
import Chats from './Chats'
import { ChatTransporter } from '../store/slices/ChatSlice';
import { changeuser } from '../store/slices/AuthSlice'


const SideMenu = () => {
    const user = useSelector(t => t.auth.user)
    const [searchresult, setsearchresult] = useState([]);
    const dispatch = useDispatch()
    const [sbm, setsbm] = useState(window.innerWidth>640?false:true);
    
    const searchUsers = async (e) => {
        e.preventDefault()

        const citiesRef = collection(db, "users");
        const q = query(citiesRef, where("name", "==", e.target.sv.value));

        try {
            const qsp = await getDocs(q)
            let list = []
            qsp.forEach(doc => {
                list.push(doc.data())

            })
            setsearchresult(list)
            e.target.sv.value = ''
        } catch (error) {
            console.log(error)
        }

    }

    const selected = async (e) => {
        const cid = user.uid > e.uid ? user.uid + e.uid : e.uid + user.uid


        try {
            const res = await getDoc(doc(db, 'chats', cid))
            if (!res.exists()) {
                await setDoc(doc(db, "chats", cid), { messages: [] })


                await updateDoc(doc(db, "users", user.uid), {
                    friends: arrayUnion(e.uid)
                });
                await updateDoc(doc(db, "userChats", user.uid), {
                    [cid + '.userInfo']: {
                        uid: e.uid,
                        name: e.name,
                        image: e.image,
                    },
                    [cid + '.date']: serverTimestamp()
                });
                await updateDoc(doc(db, "userChats", e.uid), {
                    [cid + '.userInfo']: {
                        uid: user.uid,
                        name: user.name,
                        image: user.image,
                    },
                    [cid + '.date']: serverTimestamp()

                })
                setsearchresult([]);
                dispatch(ChatTransporter({
                    user: e,
                    chatId: user.uid > e.uid ? user.uid + e.uid : e.uid + user.uid
                }))
                let newarr = [...user.friends]
                newarr.push(e.uid)
                let newusr = Object.assign({}, user)
                newusr.friends = newarr
                localStorage.setItem('user', JSON.stringify(newusr))
                dispatch(changeuser(newusr))



            }
        } catch (err) {
            console.log(err)
        }


    }

    return (
        <div style={sbm ? { 'transform': 'translateX(-100%)' } : { 'transform': 'translateX(0)' }} className='bg-slate-900  sm:w-96 h-screen flex flex-col  transition-all sm:relative absolute'>

            <Bars3CenterLeftIcon className=' w-8 cursor-pointer rounded-sm  sm:hidden  absolute -right-10 top-10' onClick={() => setsbm(!sbm)} />
            <div className='  py-2 mb-2 h-13 bg-slate-800 flex items-center'>
                <img src={user.image} alt="User image" className=' w-10 h-10 rounded-full mx-2  ring-2 ring-indigo-600 active:ring-sky-500' />
                <span className=' font-semibold'>{user.name}</span>
            </div>


            <form onSubmit={e => searchUsers(e)} className=' h-14 w-full flex items-center justify-center px-2 '>
                <button className=' w-12 flex items-center justify-center bg-slate-600 h-10  hover:bg-slate-700 rounded-l-md'><MagnifyingGlassIcon className=' w-6' /></button>
                <input name='sv' type="text" placeholder='Search friends...' className=' text-black  w-[95%] py-2 px-2 border-none outline-none rounded-r-md' />

            </form>
            <div className=' flex flex-col border-b-2 border-slate-600 my-2'>

                {searchresult.map(e => <div key={e.uid} onClick={() => { !user.friends.includes(e.uid) && selected(e) }} className=' w-full justify-between h-16 flex items-center border-b-[0.5px] border-slate-700 mx-auto hover:bg-slate-800 cursor-pointer'>
                    <div className='flex items-center'>
                        <img src={e.image} className=" w-14 h-14 rounded-full  mx-2" alt="" />
                        <div>
                            <div>{e.name}</div>
                        </div>

                    </div>
                    <button className=' px-2 py-0.5 rounded-md bg-indigo-600 hover:bg-indigo-700 mx-2'>{user.friends.includes(e.uid) ? 'friends' : 'Add'}</button>
                </div>)}

            </div>



            <Chats />
        </div>
    )
}

export default SideMenu