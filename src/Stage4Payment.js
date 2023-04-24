import React, { useState, useEffect } from 'react'
import './Stage4Payment.css';
import mobilepayLogo from './images/mobilepayLogo.svg';
import mobilepay from './images/mobilepay.png';
import googlepayLogo from './images/googlepayLogo.svg';
export default function Stage4Payment() {

    let [showCardOption, setShowCardOption] = useState(false);
    let [showMobilepayOption, setShowMobilepayOption] = useState(false);
    let [showGooglepayOption, setShowGooglepayOption] = useState(false);

    let onChangeRadioStage4 = (e) => {
        setShowCardOption(false);
        setShowMobilepayOption(false);
        setShowGooglepayOption(false);

        if (e.target.value === 'googlepay') {
            setShowGooglepayOption(true);
        } else if (e.target.value === 'mobilepay') {
            setShowMobilepayOption(true);
        } else if (e.target.value === 'card') {
            setShowCardOption(true);
        }
    }

    let [udløbsDatoValue1, setUdløbsDatoValue1 ] = useState('');

    let onChangeUdløbsDato1 = (e) => {
        if (e.target.value.length > 2) {
            setUdløbsDatoValue1(e.target.value.slice(0,2))
        } else {
            setUdløbsDatoValue1(e.target.value);
        }
    }

    let [udløbsDatoValue2, setUdløbsDatoValue2 ] = useState('');

    let onChangeUdløbsDato2 = (e) => {
        if (e.target.value.length > 2) {
            setUdløbsDatoValue2(e.target.value.slice(0,2))
        } else {
            setUdløbsDatoValue2(e.target.value);
        }
    }

    let [cvvValue, setCvvValue ] = useState('');

    let onChangeCVV = (e) => {
        if (e.target.value.length > 3) {
            setCvvValue(e.target.value.slice(0,3))
        } else {
            setCvvValue(e.target.value);
        }
            
    }

    let [cardValue, setCardValue ] = useState('');

    let onChangeCard = (e) => {
        if (e.target.value.length > 12) {
            setCardValue(e.target.value.slice(0,12))
        } else {
            setCardValue(e.target.value);
        }
            
    }


  return (
    <div id="stage4PaymentContainer">
        <div id="stage4OuterContainer">
        <div id="stage4Container1">
            <h1 id="stage4Header">Betaling</h1>
            <hr></hr>
            <h3 id="stage4PriceHeader">200 kr.</h3>
            <hr></hr>
        </div>
        <div id="stage4Container2">
            <h2 className="stage4SmallHeader">Betalingsmetoder</h2>
            <hr></hr>
            <input type="radio" className="radioStage4Input" name="betalingsMetode" onChange={onChangeRadioStage4} value="card"/><label className="labelStage4">Kredit / debit kort <span className="material-symbols-outlined stage4Icons">
credit_card
</span></label>
            { showCardOption ? <form>
                <div>
                <label className="innerLabelStage4">Kort nummer</label>
                <br/>
                <input placeholder="2329 2933 2922" className="inputStage4" onChange={onChangeCard} value={cardValue} />
                </div>
                <br/>
                <div>
                <div className="labelContainerStage4 container1Stage4"><label className="innerLabelStage4">Udløbs dato</label><br/><input className="inputStage4UdløbsDato inputStage4UdløbsDato1" placeholder="MM" onChange={onChangeUdløbsDato1} value={udløbsDatoValue1} /><input placeholder="ÅÅ" className="inputStage4UdløbsDato" onChange={onChangeUdløbsDato2} value={udløbsDatoValue2}/></div>
                <div className="labelContainerStage4 labelContainer2Stage4"><label className="innerLabelStage4">CVC/CVV</label><br/><input className="innerInputStage4" placeholder="3 cifre" onChange={onChangeCVV} value={cvvValue} /></div>
                </div>
                <br/>
                <div className="cardHoldersNameContainer">
                <label className="innerLabelStage4">Kortholders navn</label>
                <br/>
                <input placeholder="J. Doe" className="inputStage4"></input>
                </div>
                <div className="payBtn">Betal nu</div>
            </form> : null }
            <br/>
            <input type="radio" className="radioStage4Input" name="betalingsMetode" onChange={onChangeRadioStage4} value="mobilepay"/><label className="labelStage4">Mobilepay</label><img src={mobilepay} className="mobilepaySmallLogo"></img>
            <br/>
            { showMobilepayOption ? <div className="mobilepayBtn">Betal med <img src={mobilepayLogo} className="mobilepayLogo"></img></div> : null }
            <input type="radio" className="radioStage4Input" name="betalingsMetode" onChange={onChangeRadioStage4} value="googlepay"/><label className="labelStage4">Google Pay</label><img src={googlepayLogo} className="googlepaySmallLogo"></img>
            { showGooglepayOption ? <div className="googlepayBtn">Betal med <img src={googlepayLogo} className="googlepayLogo"></img></div> : null }
            <div className="bottomMarginStage4"></div>
        </div>
        </div>
    </div>
  )
}
