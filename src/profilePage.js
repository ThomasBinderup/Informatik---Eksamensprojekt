import React, { useState, useEffect } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import ProfilePageContent from './profilePageContent'

export default function ProfilePage() {
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
      
      return (
        <div >
          <div>
              <NavBar dataToHome={toggle} isAuthorized={isAuthorized}/>
              </div>
              <div id="pageContent" className={isAuthorized ? show?null:'pageContentToggleAuthorized' : show ? null : 'pageContentToggle' }>
              <ProfilePageContent/>
              </div>
              <div id="footerHome">
              <Footer />
              </div>
        </div>
      )
}
