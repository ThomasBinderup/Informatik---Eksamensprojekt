import React from 'react'
import './Footer.css'
import facebookLogo from "./images/facebookLogo.png";
import twitterLogo from "./images/twitterLogo.png";
import instagramLogo from "./images/instagramLogo.png";

export default function Footer() {
  return (
    <div id="footerF">
        <div className="footerBoxContainer " id="footerBoxHeader">
            <div id="socialMediaText">Følg os på vores sociale medier:</div>
        <div id="socialMediaIcons"><img src={facebookLogo} alt="facebook logo"/><img src={instagramLogo} alt="instagram logo"/><img src={twitterLogo} alt="twitter logo"/></div></div>


        <div id="footerBoxContainer" className="footerBoxContainer">
            <div className="footerBox" id="footerBoxVirksomhed"><div className="footerBoxText"><p className="titelFooter">Virksomhed</p><p>Forklaring af tidskapsel virksomhed</p></div></div>
            <div className="footerBox" id="footerBoxKontaktOs"><div className="footerBoxText"><p className="titelFooter">Kontakt os</p><p><span className="material-symbols-outlined contactInformationIcons">
call
</span>11-11-11-11<br/>
<br/><span className="material-symbols-outlined contactInformationIcons">
mail
</span>Example@gmail.com<br/><br/><span className="material-symbols-outlined contactInformationIcons">
home
</span>Virksomhedssted</p></div></div>
            <div className="footerBox"><div className="footerBoxText"><p className="titelFooter">Brugbare links</p><p><a href="#d">Link 1</a><br/><br/><a href="#d">Link 2</a><br/><br/><a href="#d">Link 3</a><br/><br/><a href="#d">Link 4</a><br/><br/><a href="#d">Link 5</a></p></div></div>
            <div className="footerBox"><div className="footerBoxText"><p className="titelFooter">Hjælp</p><p><a href="#d">Link 1</a><br/><br/><a href="#d">Link 2</a><br/><br/><a href="#d">Link 3</a><br/><br/><a href="#d">Link 4</a><br/><br/><a href="#d">Link 5</a></p></div></div>
        </div>
    </div>
  )
}
