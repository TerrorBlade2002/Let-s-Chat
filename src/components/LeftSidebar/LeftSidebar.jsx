import React, { useContext, useEffect, useState } from 'react'
import './LeftSidebar.css'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { db, logout } from '../../config/firebase'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'

const LeftSidebar = () => {

  const navigate = useNavigate();
  const { userData, chatData, setChatData, chatUser, setChatUser, setMessagesId, messagesId, chatVisible, setChatVisible } = useContext(AppContext);
  const [user, setUser] = useState(null);
  const [showSearch, setShowSearch] = useState(false);

  const inputHandler = async (e) => {

    try {

      const input = e.target.value;
      if (input) {

        setShowSearch(true);
        const userRef = collection(db, 'users');
        const q = query(userRef, where("username", "==", input.toLowerCase())); //since username in lowercase and if someone searches using Caps
        const querySnap = await getDocs(q);
        if (!querySnap.empty && querySnap.docs[0].data().id != userData.id) {  // so that own profile isn't displayed
          let userExist = false
          chatData.map((user)=>{

            if (user.rId === querySnap.docs[0].data().id) {
              userExist=true
            }

          })
          if (!userExist) {
            setUser(querySnap.docs[0].data());
          }
        }
        else {
          setUser(null);
        }

      }
      else {

        setShowSearch(false);

      }
    } catch (error) {

      toast.error("Error fetching user");

    }

  }

  const addChat = async () => {

    if (!user || chatData.some(chat => chat.rId === user.id)) {   // new addition
      toast.error("This user is already added!");
      return;  // Prevent duplicate adding
    }

    const messagesRef = collection(db, "messages");
    const chatsRef = collection(db, "chats");  //Prolly we should name it something else as chats already exists
    try {

      const newMessageRef = doc(messagesRef);
      await setDoc(newMessageRef, {
        createAt:serverTimestamp(),
        messages:[]
      });

      const newChat = {
        messageId: newMessageRef.id,
        lastMessage: "",
        rId: userData.id,
        updatedAt: Date.now(),
        messageSeen: true,
        userData: user // add user data here to show it in the sidebar
      };

      await updateDoc(doc(chatsRef, user.id), {   //changes have been made here
        chatsData : arrayUnion(newChat)
        });

      await updateDoc(doc(chatsRef, userData.id), {
        chatsData : arrayUnion({
          ...newChat,
          rId : user.id,
          userData : userData
        })
      });

      setChatData(prevChats => [...prevChats, newChat]);

      // Clear search after adding chat
      setUser(null);
      setShowSearch(false);

    } catch (error) {

      toast.error(error.message);
      console.error(error)

    }

  }

  const setChat = async (item) => {

    try {

      setMessagesId(item.messageId);
      setChatUser(item)  
      const userChatsRef = doc(db, 'chats', userData.id);
      const userChatsSnapshot = await getDoc(userChatsRef);
      const userChatsData = userChatsSnapshot.data();
      const chatIndex = userChatsData.chatsData.findIndex((c)=>c.messageId === item.messageId);
      userChatsData.chatsData[chatIndex].messageSeen = true;
      await updateDoc(userChatsRef, {    // an object
        chatsData : userChatsData.chatsData    // not chatData!
      })
      setChatVisible(true);

    } catch (error) {

      toast.error(error.message)

    }

  }

  const handleLogout = async () => {

    try {

      await logout(); // Call logout function
      navigate('/');  // Navigate to the home page (sign-up page)

    } catch (error) {

      toast.error("Error logging out");

    }

  };

  return (
    <div className={`ls ${chatVisible ? "hidden" : ""}`}>

      <div className="ls-top">

        <div className="ls-nav">

          <img src={assets.lets_chat_logo} width='125' height='72' className='logo' alt="" />
          <div className="menu">

            <img src={assets.menu_icon} alt="" />
            <div className="sub-menu">

              <p onClick={() => navigate('/profile')}>Edit Profile</p>
              <hr />
              <p onClick={handleLogout}>Log out</p>  {/* Logout button calls the handleLogout function */}
            </div>

          </div>

        </div>

        <div className="ls-search">

          <img src={assets.search_icon} alt="" />
          <input onChange={inputHandler} type="text" placeholder='Search here..' />


        </div>

      </div>

      <div className="ls-list">
        {

          showSearch && user
            ? <div onClick={addChat} className='friends add-user'>
                <img src={user.avatar} alt="" />
                <p>{user.name}</p>

              </div>
            : chatData.map((item, index) => (

              <div onClick={()=>setChat(item)} key={index} className={`friends ${item.messageSeen || item.messageId === messagesId ? "" : "border"}`}>
                

                <img src={item.userData.avatar} alt="" />
                <div>

                  <p>{item.userData.name}</p>
                  <span>{item.lastMessage}</span>
                </div>
              </div>
            ))

        }

      </div>

    </div>
  )
}

export default LeftSidebar

