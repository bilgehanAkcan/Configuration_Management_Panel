import React, { useState } from 'react';
import 'firebase/auth';
import CompanyLogo from '../src/images/CodewayLogo.png';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignInPage = () => {
  const auth = getAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(1);
  const navigate = useNavigate();

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User signed in: " + user.email);
      navigate('/');
    }).catch((error) => {
      setLoginSuccess(0);
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Sign-in error: " + errorMessage);
    })
  }
  

  return (
    <div className="sign-in-container">
      <img src={CompanyLogo} className="logo"/>
      <h1 className='sign-in-h1'>Please sign in</h1>
      {!loginSuccess ? <h6 style={{color:"red"}}>Login Failed!</h6> : null}
      <input type="email" placeholder="E-mail address" value={email} onChange={(e) => {setEmail(e.target.value); setLoginSuccess(1)}} className='form-control sign-in-input'/>
      <input type="password" placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value); setLoginSuccess(1)}} className='form-control sign-in-input'/>
      <button type="button" class="sign-in-button btn btn-primary" onClick={signIn}>Sign In</button>
    </div>
  );
};

export default SignInPage;
