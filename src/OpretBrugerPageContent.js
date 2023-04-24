import React, { useState, useEffect, } from 'react'
import './OpretBrugerPageContent.css'
import googleLogo from './images/googleLogo.png'
import facebookRoundLogo from './images/facebookRoundLogo.png'
import { useLocation, useNavigate } from 'react-router-dom'

export default function OpretBrugerPageContent() {
    let [ checkboxToggle, setCheckboxToggle ] = useState(false)
    let onCheckboxChange = () => {
        setCheckboxToggle(!checkboxToggle);
    }

    let location = useLocation(); // found out that this is not necessary when using navigate() because navigate() clears the previous input fields compared to res.redirect()
    let [ formData, setFormData ] = useState({ brugernavn: '', email: '', telefonnummer: '', adgangskode: '', confirmAdgangskode: ''})

    useEffect(() => {
        setFormData({ brugernavn: '', email: '', telefonnummer: '', adgangskode: '', confirmAdgangskode: ''});
        setCheckboxToggle(false);
    }, [location])

    let onInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})

        
    }

    useEffect(() => {
        setUsernameChange(formData.brugernavn);
        setEmailChange(formData.email);
        setTelefonnummerChange(formData.telefonnummer);
        setPassword(formData.adgangskode);
        setConfirmPassword(formData.confirmAdgangskode);
    }, [formData])

    // password checker
    let [passwordToggle, setPasswordToggle] = useState(false);

    let togglePassword = () => {
        setPasswordToggle(!passwordToggle);
    }

    let [ password, setPassword ] = useState('');
    let [ confirmPassword, setConfirmPassword ] = useState('');


    let [ passwordError, setPasswordError ] = useState(null);

    useEffect(() => {
        let timeoutId = setTimeout(() => {
            if (password !== confirmPassword) {
                setPasswordError(true);
            } else {
                setPasswordError(false);
            }

            if (confirmPassword === '') {
                setPasswordError(false);
            }
        }, 500)

        return () => clearTimeout(timeoutId);

    }, [confirmPassword, password]);
    
    let passwordNoMatch = (
        <span className="elementIsTaken">Adgangskode matcher ikke!</span>
    )

    //username check in DB
    let [ usernameChange, setUsernameChange ] = useState('');

        useEffect(() => {
            const delayDebounceFn = setTimeout(() => {
                if (usernameChange !== '') {
                    checkUserNameInDB(usernameChange);
                }
              if (usernameChange === '') {
                setUsernameError(false)
              }
            }, 500)
        
            return () => clearTimeout(delayDebounceFn)
          }, [usernameChange])

        let [ usernameError, setUsernameError ] = useState(false)

    let checkUserNameInDB = (username) => {
        const user = { username: username}
        fetch('http://localhost:1000/opretBrugerFormUsername', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }, 
            credentials: 'include'
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.usernameInUse) {
                setUsernameError(true)

            } else if(!data.usernameInUse) {
                setUsernameError(false)
            }

        }).catch((err) => {
            console.log(`An error occured: ${err}`)
        })
    }

    let usernameIsTaken = (
        <span className="elementIsTaken">Brugernavn er allerede taget!</span>
    )


    //email check in DB
    let [ emailChange, setEmailChange ] = useState(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (emailChange !== '') {
                checkEmailInDB(emailChange);
            }
          
            if (emailChange === '') {
                setEmailError(false)
              }
        }, 500)
    
        return () => clearTimeout(delayDebounceFn)
    }, [emailChange])

    let [ emailError, setEmailError ] = useState(false)

    let checkEmailInDB = (email) => {
        let userEmail = { email: email}
        fetch('http://localhost:1000/opretBrugerFormEmail', {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify(userEmail),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            return res.json();
        }).then((data) => {
            if (data.emailInUse) {
                setEmailError(true);
            } else if (!data.emailInUse) {
                setEmailError(false);
            }

        }).catch((err) => {
            console.log(err)
        })
    }


    let emailIsTaken = (
        <span className="elementIsTaken">Email er allerede brugt!</span>
    )

    //phonenumber check in DB
    let [ telefonnummerChange, setTelefonnummerChange ] = useState('');

        useEffect(() => {
            const delayDebounceFn = setTimeout(() => {
                if (telefonnummerChange !== '') {
                    checkTelefonnummerInDB(telefonnummerChange);
                }
                if (telefonnummerChange === '') {
                    setTelefonnummerError(false)
                  }
              
            }, 500)
        
            return () => clearTimeout(delayDebounceFn)
          }, [telefonnummerChange])
    
          let [ telefonnummerError, setTelefonnummerError ] = useState(false)

    let checkTelefonnummerInDB = (telefonnummer) => {
        const userTelefonnummer = { telefonnummer: telefonnummer}
        fetch('http://localhost:1000/opretBrugerFormTelefonnummer', {
            method: 'POST',
            body: JSON.stringify(userTelefonnummer),
            headers: {
                'Content-Type': 'application/json'
            }, 
            credentials: 'include'
        }).then((res) => {
            return res.json();
        }).then((data) => {
            if (data.telefonnummerInUse) {
                setTelefonnummerError(true)

            } else if(!data.telefonnummerInUse) {
                setTelefonnummerError(false)
            }
        }).catch((err) => {
            console.log(`An error occured: ${err}`)
        })
    }

    let telefonnummerIsTaken = (
        <span className="elementIsTaken">Telefonnummer er allerede brugt!</span>
    )

    // onSubmit validator

    let navigate = useNavigate();

    let onSubmitValidator = async (e) => {
        if (usernameError || emailError || telefonnummerError || passwordError) {
            e.preventDefault();
        }

        e.preventDefault();
        const formData = new FormData(e.target);
        console.log(formData.entries());
        const response = await fetch('http://localhost:1000/opretBrugerForm', {
        method: 'POST',
        body: formData, // no header works for some reason
        credentials: 'include'
      }) 
      
      if (response.status === 500) {
        alert('Der skete en fejl ved forbindelse til databasen: Status kode ' + response.status);
      } else if (response.status === 201) {
        navigate('/');
      }

    }

        
    

  return (
    <div>
        <div id="loginPageContentGrid">
            <div className="loginPageContentGridItem" id="loginPageContentGridHeader">Opret bruger</div>
            <div className="loginPageContentGridItem" id="loginPageContentGridContainer">
                <form onSubmit={onSubmitValidator} id="opretBrugerForm">
                    <label htmlFor="brugernavnOpretInput" id="brugernavnOpretLabel">Brugernavn</label>
                    <span id="infoSymbolID1"><span className="infoSymbol" >
            i 
        </span><span className="tooltipContainer" id="tooltipContainerID1"><span className="material-symbols-outlined tooltipArrow">
arrow_left
</span><span className="tooltipText"><span className="tooltipTitle">Krav til brugernavn:</span><br/>•&nbsp;Må ikke være brugt <br/>•&nbsp;Må ikke indeholde specielle tegn<br/>•&nbsp;Skal have en længde mellem 6-30 karakterer</span></span></span>
                    <br/>
                    <input id="brugernavnOpretInput" type="text" required name="brugernavn" pattern='^[A-Za-z0-9]{6,30}$' onChange={onInputChange} value={formData.brugernavn}/>
                    {usernameError ? usernameIsTaken:null}
                    <br/>
                    <label id="emailOpretLabel" htmlFor="emailOpretInput">Email</label><span id="infoSymbolID2"><span className="infoSymbol" >
            i 
        </span><span className="tooltipContainer" id="tooltipContainerID2"><span className="material-symbols-outlined tooltipArrow">
arrow_left
</span><span className="tooltipText"><span className="tooltipTitle">Krav til email:</span><br/> •&nbsp;Format: lokalt navn@domæne<br/>•&nbsp;Eksempel: eksempel@gmail.com<br/>•&nbsp;Må ikke være brugt</span></span></span> 
                    <br/>
                    <input pattern="^[A-Za-z0-9]{2,255}[@][a-zA-Z]{2,40}[.][a-zA-Z]{2,3}$" id="emailOpretInput" name="email" onChange={onInputChange} value={formData.email}/>
                    {emailError ? emailIsTaken:null}
                    <br/>
                    <label htmlFor="telefonnummerOpretInput" value="ukendt">Telefonnummer</label>
                    <span id="telefonnummerSmallLabel">(Valgfrit)</span><span id="infoSymbolID3"><span className="infoSymbol" >
            i 
        </span><span className="tooltipContainer" id="tooltipContainerID3"><span className="material-symbols-outlined tooltipArrow">
arrow_left
</span><span className="tooltipText"><span className="tooltipTitle">Krav til telefonnummer:</span><br/>•&nbsp;Må ikke være brugt <br/>•&nbsp;En længde på 8 karakterer<br/>•&nbsp;Må kun bestå af tal<br/>•&nbsp;Format: xxxxxxxx</span></span></span>
                    <br/>
                    <input id="telefonnummerOpretInput" name="telefonnummer" pattern="^[0-9]{8,8}$" onChange={onInputChange} value={formData.telefonnummer}/>
                    {telefonnummerError ? telefonnummerIsTaken:null}
                    <br/>
                    <label htmlFor="adgangskodeOpretInput">Adgangskode</label><span id="infoSymbolID4"><span className="infoSymbol" >
            i 
        </span><span className="tooltipContainer" id="tooltipContainerID4"><span className="material-symbols-outlined tooltipArrow">
arrow_left
</span><span className="tooltipText"><span className="tooltipTitle">Krav til adgangskode:</span><br/>•&nbsp;Skal indeholde mindst 1 stort og lille bogstav <br/>•&nbsp;Skal indeholde et symbol<br/>•&nbsp;Længde på 12-50 karakterer</span></span></span>
                    <br/>
                    <input id="adgangskodeOpretInput" onChange={onInputChange} type={passwordToggle?'text':'password'} pattern="^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@.`^.,=?/{}%!<_>-]).{12,50}$" value={formData.password} name="adgangskode"/>
                    <br/>
                    <label htmlFor="confirmAdgangskodeOpretInput" name="adgangskode">Bekræft adgangskode</label><span id="infoSymbolID5"><span className="infoSymbol" >
            i 
        </span><span className="tooltipContainer" id="tooltipContainerID5"><span className="material-symbols-outlined tooltipArrow">
arrow_left
</span><span className="tooltipText"><span className="tooltipTitle">Krav til bekræft adgangskode:</span><br/>•&nbsp;Skal være det samme som adgangskoden ovenover</span></span></span>
                    <br/>
                    <input id="confirmAdgangskodeOpretInput" type={passwordToggle?'text':'password'} name="confirmAdgangskode" pattern="^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@.`^.,=?/{}%!<_>-]).{12,30}$" onChange={onInputChange} value={formData.confirmPassword}/>
                    {passwordError?passwordNoMatch:null}
                    <br/>
                    <input type="checkbox" id="visAdgangskode" onClick={togglePassword} onChange={onCheckboxChange} checked={checkboxToggle} /><label id="visAdgangskodeText">Vis adgangskode</label>
                    <button id="submitOpretBrugerForm" type="submit" >Opret konto</button>
                </form>
            </div>
            <div id="oauthOptions"><span id="orDivider">&nbsp;&nbsp;&nbsp;ELLER&nbsp;&nbsp;&nbsp;</span><span id="oauthLogosOpret">
            <div><button href="#d"id="oauthGoogleBtnOpret"><img alt="google logo" src={googleLogo} id="oauthGoogleLogo"/><span id="oauthGoogleText">Fortsæt med Google</span></button></div>
            <div><button href="#d" id="oauthFacebookBtnOpret"><img alt="facebook logo" src={facebookRoundLogo} id="oauthFacebookLogo"/><span id="oauthFacebookText">Fortsæt med Facebook</span></button></div></span>
            </div>
        </div>
    </div>
  )

}
