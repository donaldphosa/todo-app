import React, { useEffect, useState } from 'react';
import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword} from 'firebase/auth'
import {auth} from './firebase'
import {useNavigate} from 'react-router-dom'

function Login() {
    const [currentTab, setCurrentTub]=useState('login');
    //auth part
    const [loginEmail, setLoginEmail] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')
    const [confrimPassword, setConfrimPassword] = useState('')
    const [id, setId]=useState('')
    const [user, setUser]=useState()


    const navigate = useNavigate();

 useEffect(()=>{
    onAuthStateChanged(auth, (currentUser)=>{
        setUser(currentUser)
    })
    if(user){
        navigate('/home')
    }
   
    localStorage.setItem("id",JSON.stringify(id))
 },[user, navigate])

    const register = async() =>{
        if(registerPassword===confrimPassword){
        try{
         await createUserWithEmailAndPassword(auth,registerEmail,registerPassword);
        }catch(error){
            console.log(error.message)
        }
     }
    }
    const loguser = async() =>{
        try{
            const user = await signInWithEmailAndPassword(auth,loginEmail,loginPassword)
            setId(user.user.uid)
            
            }catch(error){
                console.log(error.message)
            }
    }
    

  const  styles = {
      background: 'black',
      color: '#fff'
    }

  return (
    <div className='login'>
       
       <div className='tabs-btns'>
            <button
            style={currentTab==='login'?styles:{}}
            onClick={()=>{
                setCurrentTub('login')
            }}
            >
                Login
            </button>
            <button
            style={currentTab==='signup'?styles:{}}
            onClick={()=>{
                setCurrentTub('signup')
            }}
            >
                Sign up
            </button>
        </div>

        {currentTab==='login'&&<LoginComponent 
            setLoginPassword={setLoginPassword} 
            setLoginEmail={setLoginEmail}
            loguser={loguser}
           
            
        />}

        {currentTab==='signup'&&<Signup 
            register={register} 
            setRegisterPassword = {setRegisterPassword} 
            setRegisterEmail={setRegisterEmail} 
            setConfrimPassword={setConfrimPassword}
        />}
    </div>
  )
}

const LoginComponent = ({setLoginEmail, setLoginPassword,loguser})=>{
    return(
        <div className='loginComp'>
            <input placeholder='Email'  onChange={(e)=>{setLoginEmail(e.target.value)}}/>
            <input placeholder='Password' onChange={(e)=>{setLoginPassword(e.target.value)}}/>
            <button onClick={()=>{
                loguser()
                
                }}>Log in</button>
        </div>
    )
}

const Signup = ({setRegisterPassword,setRegisterEmail, register, setConfrimPassword})=>{
    return(
        <div className='loginComp'>
            
            <input placeholder='Email' onChange={(e)=>{setRegisterEmail(e.target.value)}}/>
            <input placeholder='Password' onChange={(e)=>{setRegisterPassword(e.target.value)}}/>
            <input placeholder='Confirm Password' onChange={(e)=>{setConfrimPassword(e.target.value)}}/>
        <button onClick={register}>Create Account</button>
       
    </div>
    )
}

export default Login