import React, { useContext, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'
import ProfileUpdate from './pages/ProfileUpdate/ProfileUpdate'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase'
import { AppContext } from './context/AppContext'

/* <> </> is a fragment tag in DOM. Use it instead of <div> to prevent unnecessary clutter in DOM */
const App = () => {

  const navigate = useNavigate();
  const {loadUserData} = useContext(AppContext)

  useEffect(()=>{

    onAuthStateChanged(auth, async (user)=> {

      if (user){

        navigate('/chat')
        await loadUserData(user.uid)

      }
      else {

        navigate('/')

      }

    })  //executed whenever we login or logout

  },[])

  return (
    <>
    <ToastContainer/>  
      <Routes> 

          <Route path='/' element={<Login/>}/> 
          <Route path='/chat' element={<Chat/>}/> 
          <Route path='/profile' element={<ProfileUpdate/>}/> 

      </Routes>
    </>
  ) /* Every <Route/> tag used is self-closing */ 
}

export default App
