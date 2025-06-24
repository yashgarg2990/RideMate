import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import UserLogout from './pages/UserLogout'
import Captainlogin from './pages/Captainlogin'
 import CaptainSignup from './pages/CaptainSignup'
 import CaptainHome from './pages/CaptainHome'
 import UserProtectWrapper from './pages/UserProtectWrapper'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import Start from './pages/Start'
import 'remixicon/fonts/remixicon.css'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path='/riding' element={<Riding/>}/>
        <Route path='/captain-riding' element = {<CaptainRiding/>} />

        
        <Route path="/captain-login" element={<Captainlogin />} />
         <Route path="/captain-signup" element={<CaptainSignup />} /> 
          <Route path='/home'
          element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          } />
        <Route path='/user/logout'
          element={<UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
          } />

            <Route path='/captain-home' element={
          <CaptainProtectWrapper>
            <CaptainHome />
          </CaptainProtectWrapper>

        } />
      </Routes>
    </div>
  )
}

export default App
