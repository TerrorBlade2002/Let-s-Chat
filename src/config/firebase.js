// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import { toast } from "react-toastify";

//Name: Let's Chat ; written as let-s-chat 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBiOdjjD37qOZ5XMWUXigLw8DMci6TTMuw",
  authDomain: "let-s-chat-9d2b2.firebaseapp.com",
  projectId: "let-s-chat-9d2b2",
  storageBucket: "let-s-chat-9d2b2.appspot.com",
  messagingSenderId: "312659781163",
  appId: "1:312659781163:web:af5dab0366e689ba51ec6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {

    try{

        const res = await createUserWithEmailAndPassword(auth, email, password); // What is await?
        const user = res.user
        await setDoc(doc(db, "users", user.uid),{

            id:user.uid,
            username:username.toLowerCase(), 
            email, 
            name:"",
            avatar:"",  // Initially empty, later updated with profile pic url
            bio: "Hey there, I'm currently online!",  // Default bio if empty or undefined
            lastSeen:Date.now() //Time stamp for the last time he was seen on app

        })

        await setDoc(doc(db, "chats", user.uid),{

            chatsData:[]

        })
    } catch (error) {

        console.error(error) //For any error
        toast.error(error.code.split('/')[1].split('-').join(" "))

    }
}

const login = async (email, password) => {

    try{

        await signInWithEmailAndPassword(auth, email, password);

    } catch(error) {

        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(" ")) // For the error notification

    }
}

const logout = async () => {

    try{

        await signOut(auth)

    } catch(error) {

        console.error(error)
        toast.error(error.code.split('/')[1].split('-').join(" "))

    }

}

const resetPass = async (email) => {

    if (!email) {
        toast.error("You have to enter a valid email address!");
        return null;     // To stop execyting this function after this
    }

    try {
        
        const userRef = collection(db, 'users');
        const q = query(userRef, where("email", "==", email));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
            await sendPasswordResetEmail(auth, email);
            toast.success("Email for password reset has been sent successfully!")
        }
        else {
            toast.error("This email address does not exist!")
        }
    } catch (error) {

        console.error(error);
        toast.error(error.message)
        
    }

}

export {signup, login, logout, auth, db, resetPass}