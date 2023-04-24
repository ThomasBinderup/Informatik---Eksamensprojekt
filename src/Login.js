import React, { useState, useEffect } from 'react'
import LoginPageContent from './LoginPageContent'
import NavBar from './NavBar';
import Footer from './Footer';

export default function Login() {
    let [ show, setShow ] = useState(true);

  const toggle = (data) => {
    setShow(data);
  }

  return (
    <div >
      <div>
          <NavBar dataToHome={toggle} />
          </div>
          <div id="pageContent" className={show?null:'pageContentToggle'}>
            <LoginPageContent />
          </div>
          <div id="footerHome">
            <Footer />
          </div>
    </div>
  )
}
