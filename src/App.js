import './App.css';
import Register from "./components/Register";
import Signin from './components/Signin'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from "./components/Home";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, messaging } from './firebase';
import { changeuser } from './store/slices/AuthSlice';
import { getToken } from 'firebase/messaging';



function App() {
  const user = useSelector(t => t.auth.user)
  const isLoading = useSelector(t => t.auth.isLoading)
  const dispatch = useDispatch()



  useEffect(() => {
    
    const updateUser = async () => {
      const res = await getDoc(doc(db, 'users', user.uid))
      localStorage.setItem('user', JSON.stringify(res.data()))
      dispatch(changeuser(res.data()))
    }
    user&&updateUser()
  }, []);

  // useEffect(() => {
  //   const requestPermission = () => {


  //     console.log('Requesting permission...');

  //     Notification.requestPermission().then(async (permission) => {
  //       if (permission === 'granted') {
  //         console.log('Notification permission granted.');
  //         const token = await getToken(messaging, { vapidKey: "BDOG0pN0WoYOtSncygRucucNwxXmwtKo8nUduV4GEIBqjA0_5Ca6eXGjUVXmM8Mfx82OA5PNn64q4JX3z_dwlLA" })
  //         console.log(token)
  //       } else {
  //         console.log('Notification permission disgranted.');
  //       }

  //     })



  //   }

  //   requestPermission()



  // }, []);


  const CheckAuth = ({ children }) => {
    if (user) {
      return (children)
    } else {
      return <Navigate to='/SignIn' />
    }
  }
  const ChecknotAuth = ({ children }) => {
    if (user) {
      return <Navigate to='/' />
    } else {
      return (children)

    }
  }


  return (
    <>
      {isLoading && <div className=" fixed z-50 top-0 bottom-0 left-0 right-0 flex items-center justify-center flex-col bg-black/90 backdrop-blur-xl"><span className="loader " id="scale-2" /><div className="text-white mt-8 animate-pulse">Loading...</div></div>}
      <BrowserRouter>
        {/* {user && <Navbar />} */}
        <Routes>


          <Route path='/' element={<CheckAuth><Home /></CheckAuth>} />
          <Route path='/signIn' element={<ChecknotAuth><Signin /></ChecknotAuth>} />
          <Route path='/register' element={<ChecknotAuth><Register /></ChecknotAuth>} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
