import { Menu, Transition } from '@headlessui/react'
import { signOut } from 'firebase/auth'
import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { auth } from '../firebase'


const Navbar = () => {
    const user = useSelector(t => t.auth.user)
    const classNames = (...classes) => classes.filter(Boolean).join(' ')



    const logout = () => {
        signOut(auth).then(() => {
            localStorage.clear()
            window.location.reload()
        }).catch((error) => {
            console.log(error)
        });
    }


    return (
        <div className=' w-96 bg-slate-800 h-14 flex items-center ' >

            <Menu as="div" className=" inline-block text-left w-fit h-fit ">
                <div>
                    <Menu.Button className='flex items-center w-fit h-fit rounded-full ml-3 outline-none'>
                        {/* <div className='  font-semibold inline'>{user.name.slice(0, 8)}</div> */}
                        <img src={user.image} alt="User image"
                            className=' w-10 h-10 rounded-full mx-2  ring-2 ring-indigo-600 active:ring-sky-500' />


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
                    <Menu.Items className="fixed left-0 z-50 mt-5 ml-1 w-44 origin-top-right divide-y divide-gray-100 rounded-md dark:divide-black dark:bg-slate-800 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <Menu.Item>
                                {({ active }) => (

                                    <p
                                        onClick={logout}

                                        className={classNames(
                                            active ? 'bg-gray-100 dark:bg-gray-900 dark:text-slate-100 text-gray-900  cursor-pointer flex items-center flex-row-reverse justify-between' : 'text-gray-700 dark:text-slate-100 cursor-pointer',
                                            ' px-4 py-2 text-sm  cursor-pointer flex items-center flex-row-reverse justify-between'
                                        )}
                                    >
                                        Logout
                                        {/* <ArrowRightOnRectangleIcon className=' w-5' /> */}
                                    </p>

                                )}
                            </Menu.Item>
                        </div>


                    </Menu.Items>
                </Transition>
            </Menu>


        </div>
    )
}

export default Navbar