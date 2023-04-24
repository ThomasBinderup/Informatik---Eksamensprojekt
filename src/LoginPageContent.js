import React, { useState } from 'react';
import './LoginPageContent.css';
import googleLogo from './images/googleLogo.png';
import facebookRoundLogo from './images/facebookRoundLogo.png';
import { useNavigate } from 'react-router-dom'

export default function LoginPageContent() {

  let [ brugernavn, setBrugernavn ] = useState('');
  let [ adgangskode, setAdgangskode] = useState('');

  let onChangeBrugernavn = (e) => {
    setBrugernavn(e.target.value);
    console.log(e.target.value);
  }

  let onChangeAdgangskode = (e) => {
    setAdgangskode(e.target.value);
    console.log(e.target.value);
    setInputError(false);
  }

  let [ inputError, setInputError ] = useState(false)

  let navigate = useNavigate();

    let handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      console.log(formData.entries());
      const response = await fetch('http://localhost:1000/login', {
        method: 'POST',
        body: formData, // no header works for some reason
        credentials: 'include'
      })

      if (response.status === 401) {
        setInputError(true);
      } else if(response.status === 500) {
        alert('Der skete en fejl ved forbindelse til databasen: Status kode ' + response.status);
      } else if (response.status === 201) {
        navigate('/');
      }
    }


  return (
    <div id="loginPageContentLPC">
        <div className="loginPageGridItem"><h1 id="loginPageHeader">Login</h1></div>
        <div className="loginPageGridItem"><div id="loginPageContainer">
          <form id="loginForm" onSubmit={handleSubmit}>
            <label>Brugernavn eller email</label>
            <br/>
            <input pattern="^[A-Za-z0-9]{2,255}[@][a-zA-Z]{2,40}[.][a-zA-Z]{2,3}$|^[A-Za-z0-9]{6,30}$" name="brugernavnEmail" value={brugernavn} onChange={onChangeBrugernavn} />
            <br/>
            <label>Adgangskode</label>
            <br/>
            <input type="password" pattern="^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@.`^.,=?/{}%!<_>-]).{12,30}$" name="adgangskode" value={adgangskode} onChange={onChangeAdgangskode}/>
            {inputError?<span id="inputErrorLogin">Brugernavn, email eller adgangskode er forkert!</span>:null}
            <br/>
            <input type="checkbox" id="huskAdgangskodeInput"/><label id="huskAdgangskodeLabel">Husk adgangskode</label>
            <br/>
            <button id="submitLoginForm">Login</button>
            </form></div></div>
          <div id="oauthOptionsLogin" ><span id="orDividerLogin">&nbsp;&nbsp;&nbsp;ELLER&nbsp;&nbsp;&nbsp;</span><span>
            <div><button href="#d" id="oauthGoogleBtnLogin"><img alt="google logo" src={googleLogo} id="oauthGoogleLogoLogin"/><span id="oauthGoogleTextLogin">Fortsæt med Google</span></button></div>
            <div><button href="#d" id="oauthFacebookBtnLogin"><img alt="facebook logo" src={facebookRoundLogo} id="oauthFacebookLogoLogin"/><span id="oauthFacebookTextLogin">Fortsæt med Facebook</span></button></div></span>
            </div>
    </div>
  )
}
