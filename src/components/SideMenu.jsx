import React, { useEffect, useState } from 'react'
import { ArrowSmallLeftIcon, Bars3CenterLeftIcon, MagnifyingGlassIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { useDispatch, useSelector } from 'react-redux'
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db, storage } from '../firebase'
import Chats from './Chats'
import { ChatTransporter } from '../store/slices/ChatSlice';
import { changeuser } from '../store/slices/AuthSlice'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'


const SideMenu = () => {
    const user = useSelector(t => t.auth.user)
    const [searchresult, setsearchresult] = useState([]);
    const dispatch = useDispatch()
    const [sbm, setsbm] = useState(window.innerWidth > 640 ? false : true);
    const [showProfile, setshowProfile] = useState(false);
    const [loading, setloading] = useState(false);
    const [Name, setName] = useState(user.name);
    const [Bio, setBio] = useState(user.bio);


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
    const SaveProfChanges = async (e) => {
        e.target.innerHTML = 'Please wait....'
        await updateDoc(doc(db, "users", user.uid), {
            name:Name,
            bio:Bio
        });
        setloading(false)
        let newusr = Object.assign({}, user)
        newusr.name = Name
        newusr.bio = Bio
        localStorage.setItem('user', JSON.stringify(newusr))
        dispatch(changeuser(newusr))
        e.target.innerHTML = 'Save'

    }


    const uploadImage = (file) => {
        setloading(true)

        const uploadTask = uploadBytesResumable(ref(storage, 'images/' + Date() + file.name), file, { contentType: file.type });

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');

            },
            (error) => console.log(error), () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {

                    await updateDoc(doc(db, "users", user.uid), {
                        image: downloadURL
                    });
                    setloading(false)
                    let newusr = Object.assign({}, user)
                    newusr.image = downloadURL
                    localStorage.setItem('user', JSON.stringify(newusr))
                    dispatch(changeuser(newusr))


                });
            }
        );

    }


    return (
        <div style={sbm ? { 'transform': 'translateX(-100%)' } : { 'transform': 'translateX(0)' }} className='bg-slate-900  z-50 trns sm:w-96 h-screen flex flex-col  transition-all sm:relative absolute'>

            <Bars3CenterLeftIcon className=' w-8 cursor-pointer rounded-sm  sm:hidden  absolute -right-10 top-10' onClick={() => setsbm(!sbm)} />

            <div className='  py-2 mb-2 h-13 bg-slate-800 flex items-center'>
                {!showProfile ? <><img src={user.image} alt="User image" className=' w-10 h-10 rounded-full mx-2  ring-2 ring-indigo-600 active:ring-sky-500' onClick={() => setshowProfile(true)} />
                    <span className=' font-semibold'>{user.name}</span></> : <span onClick={() => setshowProfile(false)} className=' flex items-center cursor-pointer'><ArrowSmallLeftIcon className=' w-6 ml-5' />back</span>}
            </div>

            {!showProfile ? <>




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



                <Chats /></> : <div className=' w-full h-full flex items-center flex-col'>

                <div className=' max-w-32 max-h-32 mt-20 overflow-hidden flex items-center justify-center rounded-full'>
                    <img src={user.image} className='w-32' alt="" />

                    {loading ? <div className=' bg-slate-600/60 backdrop-blur-sm absolute w-32 h-32 cursor-pointer rounded-full flex items-center justify-center opacity-100 transition-all'><svg
                        width="30px"
                        height="30px"
                        viewBox="0 0 24.00 24.00"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#ffffff"
                        strokeWidth="0.00024000000000000003"
                        className="spin absolute"
                    >
                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                        <g id="SVGRepo_iconCarrier">

                            <path
                                opacity="0.2"
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                fill="#000000"
                            />
                            <path
                                d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
                                fill="#eee"
                            />
                        </g>
                    </svg></div> : <label htmlFor="upload-photo" className=' bg-slate-600/60 backdrop-blur-sm absolute w-32 h-32 cursor-pointer rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all'>
                        <div className=''>
                            <PencilSquareIcon className=' w-10 text-white' />
                            <input type="file" className=' hidden' name="photo" onChange={(e) => uploadImage(e.target.files[0])} id="upload-photo" />

                        </div>
                    </label>}

                </div>


                <input onChange={e => setName(e.target.value)} defaultValue={user.name} type="text" className=' border-none outline-none font-semibold text-xl my-10 bg-transparent  text-center ' style={{ 'borderBottom': '2px solid white' }} />

                <textarea onChange={e => setBio(e.target.value)} placeholder='bio' defaultValue={user.bio} type="text" className=' border-[1px] rounded-md outline-none font-semibold  p-3   bg-transparent  text-center ' />

                <button onClick={SaveProfChanges} className=' px-2 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white my-4'>Save</button>

                <button onClick={SaveProfChanges} className=' px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white my-4'>LogOut</button>
            </div>}
        </div>
    )
}

export default SideMenu