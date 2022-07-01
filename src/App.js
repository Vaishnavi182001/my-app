import './App.css';
import React,{useState,useRef} from "react";
 
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
 
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
//Initalize the firebase in our code...
 
firebase.initializeApp({
 
  //This is where I will be pasting it 
 
  //Connecting with the firebase ka database 
 
  //I need to add my configurations
  apiKey: "AIzaSyDHj6slkBwr9XU4Bvu-8ygjii_Z2qejcB0",
  authDomain: "my-chat-app-8d992.firebaseapp.com",
  projectId: "my-chat-app-8d992",
  databaseURL:"https:/my-chat-app-8d992.firebaseio.com",
  storageBucket: "my-chat-app-8d992.appspot.com",
  messagingSenderId: "484069761892",
  appId: "1:484069761892:web:fac8450b857f82b7ae1071",
  measurementId: "G-445J4Z59F4"
})
 
const auth = firebase.auth();
const firestore = firebase.firestore();
 
function App() {
  
  const[user] = useAuthState(auth);
  return (
    <div className = "App">
 
      <header>
        <h1> CHAT SERVER </h1>
        <SignOut />
      </header>
 
      <section>
        {user ? <ChatRoom /> : <SignIn />} 
      </section>
 
    </div>
 
  );
 
}
 
function SignIn(){
 
    const signInWithGoogle = () =>{
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    }
 
    return (
    <>
    <button className = "sign-in" onClick = {signInWithGoogle}>Sign In with Google </button>
    <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
    )
}
 
function SignOut() {
 
    return auth.currentUser && (
      <button className = "sign-out" onClick = {() => auth.signOut()}>Sign Out</button>
    )
}
 
function ChatRoom(){
 
    //Display the messages
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(2500);
    const [messages] = useCollectionData(query,{idField: 'id'});
 
    const [formValue, setFormValue] = useState('');
 
    const {uid,photoURL} = auth.currentUser;
 
    const sendMessage = async(e) => {
 
        e.preventDefault();
 
        await messagesRef.add({
 
          text : formValue,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          uid,
          photoURL
        })
        setFormValue('');
 
    }
    return (
 
      <>
        <main>
 
            {messages && messages.map(msg => <ChatMessage key = {msg.id} message = {msg}/>)}
        
        </main>
 
        <form onSubmit = {sendMessage} >
 
          <input value = {formValue} onChange={(e) => setFormValue(e.target.value)} >
          </input>
          <button type = "submit" disabled = {!formValue} > Send Message</button>
        </form>
      </>
 
    )
 
}
 
function ChatMessage(props){
 
    const {text,uid,photoURL} = props.message;
 
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
 
    return (
 
      <>  
        <div className = {`message ${messageClass}`}>
        <img src = {photoURL || 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50'} />
        </div>
        <p>{text}</p>
      </>
 
    )
 
}
 
export default App;