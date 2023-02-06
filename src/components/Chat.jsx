import { Menu, Transition } from '@headlessui/react'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { deleteDoc, deleteField, doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { db } from '../firebase'
import Input from './Input'
import Messages from './Messages'
import { ChatTransporter } from '../store/slices/ChatSlice';
import { changeuser, loading } from '../store/slices/AuthSlice'

const Chat = () => {
    const { user, chatId } = useSelector(e => e.chat)
    const Currentuser = useSelector(t => t.auth.user)
    const dispatch = useDispatch()
    const classNames = (...classes) => classes.filter(Boolean).join(' ')





    const unfriend = async () => {
       dispatch(loading())

        try {
            const res = await getDoc(doc(db, 'chats', chatId))

            if (res.exists()){
                await deleteDoc(doc(db, "chats", chatId));

                await updateDoc(doc(db, "userChats", Currentuser.uid), {
                    [chatId]: deleteField()
                });
                await updateDoc(doc(db, "userChats", user.uid), {
                    [chatId]: deleteField()
                });

                 const filteredArr = user.friends.filter(element => element !== user.uid)
                let newusr = Object.assign({}, Currentuser)
                newusr.friends = filteredArr
                localStorage.setItem('user',JSON.stringify(newusr))
                dispatch(changeuser(newusr))

                dispatch(ChatTransporter({
                    user: {},
                    chatId: null
                }))
                
            }
            dispatch(loading())
        } catch (err) {
            dispatch(loading())
            console.log(err)
        }



    }



    return (
        <div className=' bg-slate-700 w-full h-screen flex  justify-start flex-col'>
            {user.uid ? <><div className=' h-14 py-2 bg-slate-800 border-l-[1px] border-slate-600 flex items-center justify-between'>
                <div className=' flex items-center h-full'>
                    <img src={user.image} className=" w-12 h-12 rounded-full mx-2" alt="user image" />
                    <span>{user.name}</span>
                </div>

                <Menu as="div" className=" dark inline-block text-left w-fit h-fit ">
                    <div>
                        <Menu.Button className='flex items-center w-fit h-fit rounded-full ml-3 outline-none'>
                            <EllipsisHorizontalIcon className=' w-9 bg-slate-700 rounded-md px-1 mx-3 hover:bg-slate-900 cursor-pointer transition-all' />
                        </Menu.Button>
                    </div>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="fixed right-0 z-50 mt-5 mr-1  flex items-center flex-col justify-around origin-top-right divide-y divide-gray-100 rounded-md dark:divide-black dark:bg-slate-800 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                                <Menu.Item>
                                    {({ active }) => (

                                        <p


                                            className={classNames(
                                                active ? 'bg-gray-100 dark:bg-gray-900 dark:text-slate-100 text-gray-900  cursor-pointer flex items-center flex-row-reverse justify-between' : 'text-gray-700 dark:text-slate-100 cursor-pointer',
                                                ' px-4 py-2 text-sm  cursor-pointer flex items-center flex-row-reverse justify-between'
                                            )}
                                        >
                                            contact Info
                                            {/* <ArrowRightOnRectangleIcon className=' w-5' /> */}
                                        </p>

                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (

                                        <p

                                            onClick={unfriend}
                                            className={classNames(
                                                active ? 'bg-gray-100 dark:bg-gray-900 dark:text-slate-100 text-gray-900  cursor-pointer ' : 'text-gray-700 dark:text-slate-100 cursor-pointer',
                                                ' px-4 py-2 text-sm  cursor-pointer '
                                            )}
                                        >
                                            Unfriend
                                            {/* <ArrowRightOnRectangleIcon className=' w-5' /> */}
                                        </p>

                                    )}
                                </Menu.Item>
                            </div>


                        </Menu.Items>
                    </Transition>
                </Menu>

            </div>
                <div className=' h-full bg-slate-300 w-full max-h-full overflow-scroll scroller'>
                    <Messages chatId={chatId} other={user} />

                </div>


                <Input chatId={chatId} other={user} /></> :
                <div className=' text-3xl w-full h-full flex items-center justify-center text-slate-200 underline  '>
                    No chat selected!
                </div>}

        </div>
    )
}

export default Chat