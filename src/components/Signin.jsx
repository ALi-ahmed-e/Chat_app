import React from 'react'
import { signIn, loading } from '../store/slices/AuthSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
const Signin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const submit = (e, prv) => {
    e.preventDefault()
    dispatch(loading(true))
    if (prv) {
      dispatch(signIn({
        serviceProvider: prv
      }))

    } else {
      dispatch(signIn({
        email: e.target.email.value,
        password: e.target.Password.value,
        serviceProvider: 'emailandpassword'
      }))
    }

  }

  return (
    <div className=' mx-auto my-44 w-96  dark:text-white bg-slate-300 text-center rounded-xl p-5'>
      <form onSubmit={e => submit(e)}>
        <div className='  text-3xl'>LogIn</div>
        <div className='flex flex-col mx-auto w-[90%]'>
          <label htmlFor="email" className='self-start mb-1'>E-mail</label>
          <input type="email" name='email' required className=' self-center outline-none border-none px-5 py-2 rounded-md w-full ' />
        </div>
        <div className='flex flex-col mx-auto w-[90%]'>
          <label htmlFor="Password" className='self-start mb-1'>Password</label>
          <input type="Password" name='Password' required className=' self-center outline-none border-none px-5 py-2 rounded-md w-full ' />
        </div>
        <button className=' mx-6 bg-indigo-600 hover:bg-indigo-800 transition-all w-[85%] py-2 rounded-2xl my-5 text-white'>Sign In</button>
        <div>Don't have an account? <span onClick={() => navigate('/register')} className=" underline text-blue-500 cursor-pointer hover:text-blue-700">register</span></div>


        <div className=' text-center flex items-center justify-center w-[90%] mx-auto my-3'>
          <div className=' w-full h-[.5px]  bg-slate-600'></div>
          <span className='bg-slate-300 px-[2px] absolute'>Or</span>
        </div>

      </form>
      <button onClick={(e) => submit(e, 'google')} className=' mx-auto mt-5 w-[75%] flex bg-blue-600 hover:bg-blue-700 text-white p-1 rounded-xl'>
        <div className=' bg-gradient-to-r from-white to-transparent pr-6 w-fit p-1 rounded-l-lg '><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" /></svg></div>
        <span className=' text-lg ml-4'>Sign in with Google</span>
      </button>
    </div >

  )
}

export default Signin