import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import HomePageContent from './HomePageContent';
import Footer from './Footer';

export default function Home() {

  let [ show, setShow ] = useState(true);

  const toggle = (data) => {
    setShow(data);
  }

  let [ isAuthorized, setIsAuthorized ] = useState(false);

  useEffect(() => {
     fetch('http://localhost:1000/navBarAuthorization', {
            method: 'GET',
            credentials: 'include'
          }).then((res) => {
            return res.json()
          }).then((data) => {
            setIsAuthorized(data.authorized)
          }).catch((err) => {
            console.log(err);
          }) 
  }, [])

  useEffect(() => {
    localStorage.setItem('stage', '1');
  }, [])
  
  return (
    <div >
      <div>
          <NavBar dataToHome={toggle} isAuthorized={isAuthorized}/>
          </div>
          <div id="pageContent" className={isAuthorized ? show?null:'pageContentToggleAuthorized' : show ? null : 'pageContentToggle' }>
          <HomePageContent/>
          </div>
          <div id="footerHome">
            <Footer />
          </div>
    </div>
  )
}
