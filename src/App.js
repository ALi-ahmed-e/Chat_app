import React, { useState, useEffect } from "react";
import './App.css';
import Register from "./components/Register";
import Signin from './components/Signin'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from "./components/Home";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import SideMenu from "./components/SideMenu";



function App() {
  const user = useSelector(t => t.auth.user)
  const isLoading = useSelector(t => t.auth.isLoading)


  // const [Theme, setTheme] = useState();
  // const [localTheme, setlocalTheme] = useState(localStorage.getItem('theme'));

  // const detecttheme = () => {

  //   if (localTheme == 'dark') {

  //     document.body.style.background = 'rgb(15 23 42)'
  //     //`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' viewBox='0 0 700 700' width='700' height='700' opacity='1'%3E%3Cdefs%3E%3CradialGradient id='ffflux-gradient'%3E%3Cstop offset='0%25' stop-color='hsl(0  0%25  0%25)'%3E%3C/stop%3E%3Cstop offset='100%25' stop-color='hsl(0  0%25  0%25)'%3E%3C/stop%3E%3C/radialGradient%3E%3Cfilter id='ffflux-filter' x='-20%25' y='-20%25' width='140%25' height='140%25' filterUnits='objectBoundingBox' primitiveUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.002 0.002' numOctaves='1' seed='2' stitchTiles='stitch' x='0%25' y='0%25' width='100%25' height='100%25' result='turbulence'%3E%3C/feTurbulence%3E%3CfeGaussianBlur stdDeviation='0 0' x='0%25' y='0%25' width='100%25' height='100%25' in='turbulence' edgeMode='duplicate' result='blur'%3E%3C/feGaussianBlur%3E%3CfeBlend mode='soft-light' x='0%25' y='0%25' width='100%25' height='100%25' in='SourceGraphic' in2='blur' result='blend'%3E%3C/feBlend%3E%3C/filter%3E%3C/defs%3E%3Crect width='700' height='700' fill='url(%23ffflux-gradient)' filter='url(%23ffflux-filter)'%3E%3C/rect%3E%3C/svg%3E")`

  //     setTheme('dark')
  //   }else if(localTheme == 'light'){

  //   }
  //   // if (window.matchMedia('(prefers-color-scheme:dark)').matches) {
  //   //   document.body.style.background = 'rgb(15 23 42)'
  //   //   // setAppTheme('dark')

  //   // }
  // }



  // useEffect(() => {
  //   detecttheme()
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
      {isLoading && <div className=" fixed z-50 top-0 bottom-0 left-0 right-0 flex items-center justify-center flex-col bg-black/90 backdrop-blur-xl"><span className="loader"></span><div className="text-white mt-8 animate-pulse">Loading...</div></div>}
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
