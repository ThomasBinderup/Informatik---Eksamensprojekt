import React, { useState } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import OpretBrugerPageContent from './OpretBrugerPageContent';

export default function OpretBruger() {
  let [ show, setShow ] = useState(true);

const toggle = (data) => {
  setShow(data);
  console.log(data);
}
  return (
  <div >
    <div>
        <NavBar dataToHome={toggle} />
        </div>
        <div id="pageContent" className={show?null:'pageContentToggle'}>
        <OpretBrugerPageContent />
        </div>
        <div id="footerHome">
          <Footer />
        </div>
  </div>

  )
}
