import React, { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';
import { AppContext } from '../../context/AppContext';

const ProfileUpdate = () => {

  const navigate = useNavigate();
  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState("");
  const [prevImage, setPrevImage] = useState("");
  const {setUserData} = useContext(AppContext)

  const profileUpdate = async (event) => {

    event.preventDefault();  // so that won't reload webpg after we submit the form
    try {

      if (!prevImage && !image) {
        toast.error("You need to upload a profile pic")
        return;
      }

      const docRef = doc(db, 'users', uid);
      if (image) {

        const imgUrl = await upload(image);
        setPrevImage(imgUrl);
        await updateDoc(docRef, {

          avatar: imgUrl,
          bio: bio,
          name: name

        })
      }
      else {

        await updateDoc(docRef, {

          bio: bio,
          name: name

        })
      }

      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate('/chat');

    } catch (error) {

      console.error(error);
      toast.error(error.message);

    }

  }

  useEffect(() => {

    onAuthStateChanged(auth, async (user) => {
      if (user) {

        setUid(user.uid)
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.data().name) {

          setName(docSnap.data().name);

        }
        if (docSnap.data().bio) {

          setBio(docSnap.data().bio);

        }
        if (docSnap.data().avatar) {

          setPrevImage(docSnap.data().avatar)

        }
      }
      else {

        navigate('/')

      }
    })

  }, [])   //Dependency array added


  return (
    <div className='profile'>

      <div className="profile-container">

        <form onSubmit={profileUpdate}>

          <h3>Profile Preview</h3>
          <label htmlFor="avatar">

            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
            <img src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
            Set your profile image

          </label>

          <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Name' required />
          <textarea onChange={(e) => name === "" ? setBio("Hey there, I'm currently online") : setBio(e.target.value)} value={bio} placeholder='Profile Bio' required></textarea>
          <button type='submit'>Save</button>

        </form>

        <img className='profile-pic' src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.lets_chat_logo} width="300" height="150" alt="" />

      </div>



    </div>
  )
}

export default ProfileUpdate