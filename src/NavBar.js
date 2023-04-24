import React, { useState, useEffect } from 'react';
import './NavBar.css';
import logo from './images/logo.png';

export default function NavBar(props) {
  const [show, setShow ] = useState(false);

  let handleClick = () => {
    setShow(!show);
    props.dataToHome(show);
  }

  

  if (!props.isAuthorized) {
  return (
    <div id="navBarContainer" > 
    <div id="leftBtns" > 
      <img src={logo} id="logo" alt="logo" ></img>
      <a id="btnL1" href="/">Tidskapslen</a>
      <span className="material-symbols-outlined" id="menu" onClick={handleClick}>
{show?'close':'menu'}
</span>
    </div> 
    <div className={show ? 'showRightBtns' : 'hideRightBtns'}>
    <div id="rightBtns" >
      <a href="#d" id="btnR1" >Priser</a>
      <a href="#d" id="btnR2" >Om&nbsp;os</a>
      <div id="btnR3Div">
      <a href="/opretBruger" id="btnR3" >Opret&nbsp;bruger</a>
      </div>
      <div id="btnR4Div">
      <a href="/login" id="btnR4" >Log&nbsp;ind</a>
      </div>
      </div>
      </div>
    </div>
  )
  } else if (props.isAuthorized) {
    return (
      <div id="navBarContainer" > 
      <div id="leftBtns" > 
        <img src={logo} id="logo" alt="logo" ></img>
        <a id="btnL1" href="/">Tidskapslen</a>
        <span className="material-symbols-outlined" id="menu" onClick={handleClick}>
  {show?'close':'menu'}
  </span>
      </div> 
      <div className={show ? 'showRightBtns' : 'hideRightBtns'}>
      <div id="rightBtnsAuthorized" >
        <a href="#d" id="btnR1Authorized" className="btnRAuthorized">Priser</a>
        <a href="#d" id="btnR2Authorized" className="btnRAuthorized">Om&nbsp;os</a>
        <a href="#d" id="btnR3Authorized" className="btnRAuthorized">Guide</a>
        <a href="/opretTidskapsel" id="btnR4Authorized" className="btnRAuthorized">Lav&nbsp;en&nbsp;tidskapsel</a>
        <a href="/profilePage" id="btnR5Authorized" className="btnRAuthorized">Profil</a>
        </div>
        </div>
      </div>
    )
  }



}
