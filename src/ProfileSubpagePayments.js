import React from 'react';
import './ProfileSubpagePayments.css';

export default function ProfileSubpagePayments() {
  return (
    <div id="gridContainerPayments">
        <div className="gridItemPayments" id="paymentsTitle">
            <h1>Dine betalinger</h1>
        </div>
        <div className="gridItemPayments" id="paymentsNeeded">
            <div className="paymentsGrayBox">
                <h3>Afventende betalinger</h3>
            </div>
            <p>0</p>
            
        
        </div>
        <div className="gridItemPayments" id="paymentsAmountPaid">
            <div className="paymentsGrayBox">
                <h3>Samlede beløb betalt </h3>
            </div>
            <p>0kr</p>

        </div>
        <div className="gridItemPayments" id="paymentsRight">
            <div className="paymentsGrayBox">
                <h3>Mislykkedes betalinger </h3>
            </div>
            <p>0</p>
        </div>
        <div className="gridItemPayments" id="transactionHistory"></div>
        <div className="gridItemPayments" id="billingDetails"></div>


    </div>
  )
}
