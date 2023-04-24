import React, { useState, useEffect } from 'react';
import './profilePageContent.css';
import ProfileSubpageGuide from './ProfileSubpageGuide.js';
import ProfileSubpagePayments from './ProfileSubpagePayments.js'
import ProfileSubpageProfile from './ProfileSubpageProfile.js';
import ProfileSubpageSettings from './ProfileSubpageSettings.js';
import ProfileSubpageOrderHelp from './ProfileSubpageOrderHelp.js';

export default function ProfilePageContent() {
  const [ currentProfilePage, setCurrentProfilePage ] = useState(null);

  let onClickProfileBtn = () => {
    setCurrentProfilePage(<ProfileSubpageProfile/>);

  }

  let onClickGuideBtn = () => {
    setCurrentProfilePage(<ProfileSubpageGuide/>);
  }

  let onClickPaymentsBtn = () => {
    setCurrentProfilePage(<ProfileSubpagePayments/>);
    
  }

  let onClickOrderHelpBtn = () => {
    setCurrentProfilePage(<ProfileSubpageOrderHelp/>);
    
  }

  let onClickSettingsBtn = () => {
    setCurrentProfilePage(<ProfileSubpageSettings/>);
  }

  return (
    <div className="profileContainer">
    <div id="timecapsulesContainer">
        <h1 className="timecapsuleProfile" id="timecapsuleOneProfile">Dine tidskapsler</h1>
        <div className="timecapsuleProfile">Item2</div>
        <div className="timecapsuleProfile">Item3</div>
    </div>
    <div id="settingsContainer">
    <div id="settingsContainerButtons">
        <div className="buttonProfile" onClick={onClickProfileBtn}><div id="button1Profile">Profil</div></div>
        <div className="buttonProfile" onClick={onClickGuideBtn}><div>Guide</div></div>
        <div className="buttonProfile" onClick={onClickPaymentsBtn}><div>Betalinger</div></div>
        <div className="buttonProfile" onClick={onClickOrderHelpBtn}><div>Bestil tekniker</div></div>
        <div className="buttonProfile" onClick={onClickSettingsBtn}><div id="button5Profile">Indstillinger</div></div>
    </div>
      {currentProfilePage}
    
    </div>
    </div>
  )
}

