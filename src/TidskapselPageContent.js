import React, { useState, useEffect, useMemo } from 'react';
import './TidskapselPageContent.css';
import OpretTidskapselStages from './OpretTidskapselStages';
import passport from './images/passport.svg';
import { useNavigate } from 'react-router-dom';
import facebookLogo from './images/facebookLogo.png';
import mitIDLogo from './images/MitID logo.png';
import Stage4Payment from './Stage4Payment';

export default function TidskapselPageContent() { // Definere en function component
    let [stage, setStage] = useState('1'); 
    /* useState er en react hook som bruges til at holde styr på en komponents tilstand. Den returnere en
    array med det i index 0 er tilstanden og det i index 1 er den måde hvor på man kan ændre en tilstand, altså 
    hvad index 0's tilstand er. Vi bruger derfor object destructering til at få index 0 til at hedde stage i dette tilfælde
    og index 1 til at hedde setStage, som bestemmer stage's tilstand. Det der skrives inden i useState()
    er hvad index 0's værdi er til at begynde med når den først bliver mounted som et komponent */

    let [ doesContainImg, setDoesContainImg] = useState(false);

    let [ allowed, setAllowed ] = useState(false);

    let [ pasImage, setPasImage ] = useState(passport);

    let [ pasError, setPasError ] = useState(false);

    useEffect(() => {
    }, [allowed])

    useEffect(() => { /* Vi bruger en anden react hook, som hedder useEffect() som bliver executed hver gang
    et komponent render. Hvilket er defineret med en dependency array [] som er tom. Med andre ord hver gang 
    hjemmesiden bliver refreshet.  */
        let stage = localStorage.getItem('stage'); // finder stage i localStorage altså en opbevaringsmekanisme i hjemmeside
        if (stage !== null) {
            setStage(stage); // hvis den ikke er null så sætter vi tilstanden (stage) for at personen er på den rigtige side
        }

        if (stage === '3') { /* lav request til database for at vise kontakter personen har added under indstillinger.
        så de ikke skal til at skrive dem igen hvis siden refresher 
        */
        fetch('http://localhost:1000/getAddedContacts', { // sender HTTP get request til server, som får data fra databasen
        method: 'GET',  // GET request
        headers: {
            'Content-Type': 'application/json' // type af data som bliver sendt
        },
        credentials: 'include' // cookies inkluderet
    }).then(async (res) => { // .then chain for at håndtere et asynkront svar (kunne have brugt await syntax)
        if (res.status === 201) {
            let parsedData = await res.json();
            let parsedDataLength = parsedData.length;
            setPersonNumber(parsedDataLength + 1);
            let storeContactsFromDB = [];
            parsedData.map((parsedData, index) => { // iterater over response dataet
                
                let data = { // sætter de op i god format
                    navnInputVOK: parsedData.navn,
                    efternavnInputVOK: parsedData.efternavn,
                    telefonnummerInputVOK: parsedData.telefonnummer,
                    emailInputVOK: parsedData.email,
                    addressInputVOK: parsedData.adresse
                }
                storeContactsFromDB.push(data);
                if (parsedDataLength - 1 === index) {
                    let newState = [...storeListOfContacts];
                    newState.push(...storeContactsFromDB);
                    setStoreListOfContacts(newState);  // sætter den state der hedder storeListOfContacts med det data vi har fået
                }
            })
        } else {
            console.log('err');
        }
    })
}
    }, [])

    let [ showImageStage2, setShowImageStage2 ] = useState(false); // state for image

    let onChangeImage = (e) => {
        if (e.target.files.length > 0) {
            setShowImageStage2(true);
            const reader = new FileReader(); // laver en klasse, så vi kan bruge dets metoder
            reader.readAsDataURL(e.target.files[0]); // læser fil bruger har uploaded
            reader.onload = () => { // assigns a function as its value rather because onload is a property and not a method of the object
            setTimecapsuleImage(reader.result); // viser deres uploaded billede til brugeren ved at bruge state
        }    
        } else {
            setShowImageStage2(false);
            setTimecapsuleImage('');
        }
        if (timecapsuleImage !== '') {
            setUploadImageStage2Error(false);
        }
    }

    let [ uploadImageStage2Error, setUploadImageStage2Error ] = useState(false);

    let handleSubmitStage2 = async (e) => {
        e.preventDefault(); // forhindre default mekanismen ved en form submit
        if (timecapsuleImage === '') { // vis error hvis der intet billede er
            return setUploadImageStage2Error(true);
        }

        const formData = new FormData(e.target); // laver et nyt formData objekt ud fra et form element, som vi accesser ved e.target
        let response = await fetch('http://localhost:1000/stage2Tidskapsel', { // sender fetch request med form dataet til serveren, som opbevarer i databasen 
            method: 'POST',
            credentials: 'include',
            body: formData // form dataet som bliver sendt
        })

        if (response.status === 500) { // håndterer respons
            alert('Der skete en fejl ved forbindelse til databasen: Status kode ' + response.status)
        } else if (response.status === 201) {
            setStage('3');
            localStorage.setItem("stage", "3");
        }

    }

    let [ navnInput, setNavnInput ] = useState(''); // her holder vi styr på det der bliver indtastet i navn inputten i stage 2 for at det bliver et kontrolleret komponent

    let onChangeNavnInput = (e) => { // bruges til at sætte tilstanden, som react bruger til at være det samme som det indtastede
        setNavnInput(e.target.value);
    }

    let [ efternavnInput, setEfternavnInput ] = useState('');

    let onChangeEfternavnInput = (e) => {
        setEfternavnInput(e.target.value);
    }

    let [ descriptionInput, setDescriptionInput ] = useState('');

    let onChangeDescriptionInput = (e) => {
        setDescriptionInput(e.target.value);
    }

    let [ overskriftInput, setOverskriftInput ] = useState('');

    let onChangeOverskriftInput = (e) => {
        setOverskriftInput(e.target.value);
    }

    let [ timecapsuleImage, setTimecapsuleImage ] = useState('');

    // stage 3

    let [ offentligRadio, setOffentligRadio ] = useState(false); // holder styr på om radio knappen, som hedder offentlig om den er tjekket af eller ej

    let onChangeOffentligRadio = (e) => { // hver gang noget ændrer sig i radio feltet tjekker vi om den er tjekket af
        setOffentligRadio(e.target.checked);
        setPrivatRadio(false);
        if (e.target.checked) { 
            setFormDataStage3({...formDataStage3, [e.target.name]: e.target.value}); // holder styr på hvad personen har gjort i form elementet
        }
    }

    let [ privatRadio, setPrivatRadio ] = useState(false);

    let onChangePrivatRadio = (e) => {
        setOffentligRadio(false);
        setPrivatRadio(e.target.checked);
        if (e.target.checked) {
            setFormDataStage3({...formDataStage3, [e.target.name]: e.target.value});
            
        }
    }

    let [ visKontaktMuligheder, setVisKontaktMuligheder ] = useState(false);

    let handleSkalBliveInformeret = (e) => {
        if (e.target.value === 'ja') {
            setVisKontaktMuligheder(true);
            if (e.target.checked) {
                setFormDataStage3({...formDataStage3, skalBliveInformeret: 'ja'});
            } 
        } else {
            if (e.target.checked) {
                setFormDataStage3({...formDataStage3, skalBliveInformeret: 'nej'});
            } 
            setVisKontaktMuligheder(false);
            setShowVOKOption(false);
            setShowEmailOption(false);
            setShowTelefonnummerOption(false);
        }
        setFormDataStage3({...formDataStage3, [e.target.name]: e.target.value});
    }

    let [ kontaktValgmulighed, setKontaktValgmulighed ] = useState(null);

    let [ emailChange, setEmailChange ] = useState('');
    let handleTextAreaEmailChange = (e) => {
        setEmailChange(e.target.value);
        if (e.target.checked) {
            setFormDataStage3({...formDataStage3, kontaktMulighed: true});
        } 
    }

    let [ telefonnummerChange, setTelefonnummerChange ] = useState('');
    let handleTextAreaTelefonnummerChange = (e) => {
        setTelefonnummerChange(e.target.value);
        if (e.target.checked) {
            setFormDataStage3({...formDataStage3, kontaktMulighed: true});
        } 
    }

    // let storeAddedEmails = useMemo(() => ['dsdsd'], []);

    let [ storeAddedEmails, setStoreAddedEmails ] = useState([]);

    let [ showConfirmBtnEmail, setShowConfirmBtnEmail ] = useState(false);
    useEffect(() => {
        if (storeAddedEmails.length === 0) {
            setShowConfirmBtnEmail(false);
        } else {
            setShowConfirmBtnEmail(true);
        }
    }, [storeAddedEmails])

    let [ storeAddedTelefonnummer, setStoreAddedTelefonnummer ] = useState([])

    let [ showConfirmBtnTelefonnummer, setShowConfirmBtnTelefonnummer ] = useState(false);
    useEffect(() => {
        if (storeAddedTelefonnummer.length === 0) {
            setShowConfirmBtnTelefonnummer(false);
        } else {
            setShowConfirmBtnTelefonnummer(true);
        }
    }, [storeAddedTelefonnummer]);

    let [ emailListError, setEmailListError ] = useState(false);

    let [ emailListError2, setEmailListError2 ] = useState(false);

    let [ telefonnummerListError, setTelefonnummerListError ] = useState(false);

    let [ telefonnummerListError2, setTelefonnummerListError2 ] = useState(false);


    let handleKeyDownEmail = (e) => { // håndterer hvad der sker når en tast bliver indtastet
        if (e.key == 'Enter'  || e.type == 'click') { // hvis enter tasten er klikket eller et klik event sker vil den løbe if statementet
            setEmailListError2(false);
            setEmailListError(false); // ingen email fejl
            e.preventDefault();
            let emailRegexp = new RegExp('^[A-Za-z0-9æøåÆØÅ]{2,255}[@][a-zA-ZæøåÆØÅ]{2,40}[.][a-zA-ZæøåÆØÅ]{2,3}$'); // reqular expression for email
            if (!emailRegexp.test(emailChange)) { // tester email om den overholder format
                return setEmailListError(true);  // hvis ikke overholder format så sker der en error
            }

            if (storeAddedEmails.includes(emailChange)) {
                setEmailListError2(true); // error hvis email allerede er added
            }

            if (emailRegexp.test(emailChange) && !storeAddedEmails.includes(emailChange)) {
                let newArray = storeAddedEmails.slice(0); // fjerner added email fra list hvis email allerede er tilføjet
                newArray.push(emailChange);
                setStoreAddedEmails(newArray); 
            }
        }
    }

    let handleKeyDownTelefonnummer = (e) => {
        if (e.key == 'Enter' || e.type == 'click') {
            setTelefonnummerListError2(false);
            setTelefonnummerListError(false);
            e.preventDefault();
            let telefonnummerRegexp = new RegExp(`^[0-9]{8,8}$`);
            if (!telefonnummerRegexp.test(telefonnummerChange)) {
                return setTelefonnummerListError(true);
            }

            if (storeAddedTelefonnummer.includes(telefonnummerChange)) {
                setTelefonnummerListError2(true);
            }

            if (telefonnummerRegexp.test(telefonnummerChange) && !storeAddedTelefonnummer.includes(telefonnummerChange)) {
                let newArray = storeAddedTelefonnummer.slice(0);
                newArray.push(telefonnummerChange);
                setStoreAddedTelefonnummer(newArray); 
            }
        }
    }

    let handleClickRemoveEmail = (e, index) => {
        let newArray = storeAddedEmails.slice(0); // laver ny array med alt indhold
        let removedEmail = newArray.splice(index, 1); // fjerne indexet, som er klikket på fra arrayet som opbevarer emails
        if (removedEmail == emailChange) {
            setEmailListError2(false);
        }
        setStoreAddedEmails(newArray);
    }

    let handleClickRemoveTelefonnummer = (e, index) => {
        let newArray = storeAddedTelefonnummer.slice(0); // samme som ovenover bare telefonnummer
        let removedTelefonnummer = newArray.splice(index, 1);
        if (removedTelefonnummer == telefonnummerChange) {
            setTelefonnummerListError2(false);
        }
        setStoreAddedTelefonnummer(newArray);
    }

    let [ formDataStage3, setFormDataStage3 ] = useState({ synlighed: null, skalBliveInformeret: null, kontaktMulighed: null})

    useEffect(() => {
        if (formDataStage3.skalBliveInformeret == 'ja') {
            setVisKontaktMuligheder(true);
        }
    }, [formDataStage3]); // viser kontakt muligheder vis ja radio button er trykket ind

    let [showEmailOption, setShowEmailOption ] = useState(false); 

    let [showVOKOption, setShowVOKOption ] = useState(false);  // håndterer hvad der skal vises og ikke vises

    let [showTelefonnummerOption, setShowTelefonnummerOption ] = useState(false); 

    let onChangeKontaktMulighed = (e) => {
        setFormDataStage3({...formDataStage3, [e.target.name]: e.target.value});
        setShowTelefonnummerOption(false);
        setShowEmailOption(false);
        setShowVOKOption(false);
        if (e.target.value === 'email') {
            setShowEmailOption(true);
        } else if (e.target.value === 'voresOrganisationKontakter') {
            setShowVOKOption(true);
        } else if (e.target.value === 'telefonnummer') {
            setShowTelefonnummerOption(true);
        }
        if (e.target.checked) {
            setFormDataStage3({...formDataStage3, kontaktMulighed: true}); // gemmer data i formdata for stage 3 siden
        } 
    }

    let onClickMitIDBtn = (e) => { // når vi klikker på mitId knappen, så kører koden
        localStorage.setItem('stage', '2'); // gemmer stage 2 i localStorage 
        let stage = localStorage.getItem('stage'); // hiver det frem igen
        setStage(stage); // sætter stage til at være det samme som localStorage for at komme til næste side
        fetch('http://localhost:1000/createTimecapsule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then((res) => {
        
    })
    }

    let [ selectedValue, setSelectedValue ] = useState('efterOprettelsen'); 
    let onChangeSelectUdgivning = (e) => {
        setSelectedValue(e.target.value); // sætter værdien, som er valgt på stage 2 siden i dropdown input feltet på spørgsmål 2 til at være den valgte
    } 
    let [ showDate, setShowDate ] = useState(false);
    useEffect(() => {
        if (selectedValue === 'vælgEnDato') {
            setShowDate(true); // viser dato hvis de vælger at skulle vælge en dato
        } else {
            setShowDate(false);
        }
    }, [selectedValue]) // hver gang selectedValue ændrer sig kører den koden

    let [ addressSearch, setAdressSearch ] = useState(''); 

    let onChangeSearchAddressInput = (e) => {
        setAdressSearch(e.target.value); // sætter adresse inputtet
        setFormDataVOK({...formDataVOK, 'addressInputVOK': e.target.value}); // sætter adresse input feltet til formData i vores organisation kontakter
    }

    let [ foundAddresses, setFoundAddresses ] = useState(null); // de fundne adresse fra api'en
    let [ showAddressContainer, setAddressContainer ] = useState(false); // om adresse containeren skal vises

    let storeAddresses = [];
    useEffect(() => {
        if (clickedOnAddress) { // hvis de klikker på en adresse skal adresse containeren forsvinde
            setClickedOnAddress(false);
            storeAddresses = [];
            setFoundAddresses(storeAddresses);
            setAddressContainer(false);
            return
        }
        if (addressSearch === '') { // ikke gør noget hvis de intet har skrevet
            return
        }
        let timeoutIDFindAddress = setTimeout( async() => { // hver 20 milisekund sender vi en request for at tjekke om der er en dansk adresse der hedder cirka det de har indtastet
            let responseData = await fetch(`https://api.dataforsyningen.dk/adresser?q=${addressSearch}&side=1&token=573e40ea16dace1957ac8033293f258b&per_side=25`);
            let parsedData = await responseData.json(); // får lavet det til javascript object fra JSON data
            storeAddresses = [];
            for (let i = 0; parsedData.length > i; i++) {
                storeAddresses.push(parsedData[i].adressebetegnelse); // gemmer data i array
            }
            setFoundAddresses(storeAddresses) // viser hvilke addresser der er blevet ufndt
            setAddressContainer(true);
        }, 20)
        return () => clearTimeout(timeoutIDFindAddress); // clear up function
    }, [addressSearch]); // kører kun koden hvis addressSearch tilstand ændrer sig

    let [clickedOnAddress, setClickedOnAddress] = useState(false)
    let onClickIndividualAddress = (e) => { /*når de klikker på en adresse skal den stå oppe i input feltet */
        setClickedOnAddress(true);
        setAdressSearch(e.target.innerHTML);
        setFormDataVOK({...formDataVOK, 'addressInputVOK': e.target.innerHTML});
    }

    let [formDataVOK, setFormDataVOK] = useState({
        navnInputVOK: '',
        efternavnInputVOK: '',
        telefonnummerInputVOK: '',
        emailInputVOK: '',
        addressInputVOK: ''
    });

    let onChangeNavnInputVOK = (e) => {
        setFormDataVOK({...formDataVOK, 'navnInputVOK': e.target.value})
    }

    let onChangeEfternavnInputVOK = (e) => {
        setFormDataVOK({...formDataVOK, 'efternavnInputVOK': e.target.value})
    }

    let onChangeTelefonnummerInputVOK = (e) => {
        setFormDataVOK({...formDataVOK, 'telefonnummerInputVOK': e.target.value})
    }

    let onChangeEmailInputVOK = (e) => {
        setFormDataVOK({...formDataVOK, 'emailInputVOK': e.target.value})
    }

    let [ navnRegexpError, setNavnRegexpError ] = useState(false);
    let [ efternavnRegexpError, setEfternavnRegexpError ] = useState(false);
    let [ telefonnummerRegexpError, setTelefonnummerRegexpError ] = useState(false);
    let [ emailRegexpError, setEmailRegexpError ] = useState(false);
    let [ addressRegexpError, setAddressRegexpError ] = useState(false);

    let [personNumber, setPersonNumber] = useState(1);

    let onClickAddPersonBtn = () => {
        setNavnRegexpError(false);
        setEfternavnRegexpError(false);
        setEmailRegexpError(false);
        setTelefonnummerRegexpError(false);
        setAddressRegexpError(false);

        let navnRegexp = new RegExp(`^[A-Za-z0-9æøåÆØÅ ]{2,30}$`); // regular expressions for vores organisation kontakter form elementet
        let efternavnRegexp = new RegExp(`^[A-Za-z0-9æøåÆØÅ ]{2,30}$`);
        let emailRegexp = new RegExp(`^[A-Za-z0-9æøåÆØÅ]{2,255}[@][a-zA-Z]{2,40}[.][a-zA-ZæøåÆØÅ]{2,3}$`);
        let telefonnummerRegexp = new RegExp(`^[0-9]{8,8}$`);
        let addressRegexp = new RegExp(`^[A-Za-z0-9,æøåÆØÅ ]{5,100}`);
        
        if (!navnRegexp.test(formDataVOK.navnInputVOK)) {  /* tester de forskellige regular expressions og hvis der sker en fejl
        i hvad brugeren har indtastet viser vi til dem at der er en fejl i formattet */
            setNavnRegexpError(true);
            return    
        } 

        if (!efternavnRegexp.test(formDataVOK.efternavnInputVOK)) {
            setEfternavnRegexpError(true);
            return
        }

        if (!telefonnummerRegexp.test(formDataVOK.telefonnummerInputVOK)) {
            setTelefonnummerRegexpError(true);
            return
        }

        if (!emailRegexp.test(formDataVOK.emailInputVOK)) {
            setEmailRegexpError(true);
            return
        }

        if (formDataVOK.addressInputVOK !== '' && !addressRegexp.test(formDataVOK.addressInputVOK)) {
            setAddressRegexpError(true);
            return 
        }

        fetch('http://localhost:1000/addPersonVOK', { /* vi laver en fetch request til serveren med det data 
        som brugeren har indtastet i input element i form elementet som sender det videre til databasen.
        */
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formDataVOK) // omdanner til JSON data før vi sender til serveren
    }).then((res) => {
        if (res.status === 201) { // håndterer positiv status kode
            updateListOfContacts();
            setPersonNumber(personNumber + 1);
            console.log(storeListOfContacts)
            storeListOfContacts.map((person, index) => {
                console.log(person);
            })
            setFormDataVOK({ // fjerner det brugeren har indtastet
            navnInputVOK: '',
            efternavnInputVOK: '',
            telefonnummerInputVOK: '',
            emailInputVOK: '',
            addressInputVOK: ''
            })
            setAdressSearch('')
            setAddressContainer(false);
        }
    })
    }

    let [storeListOfContacts, setStoreListOfContacts] = useState([]);

    let updateListOfContacts = () => {
        let newState = [...storeListOfContacts];
        newState.push(formDataVOK);
        setStoreListOfContacts(newState);
    }

    let [ hoverIndex, setHoverIndex ] = useState('');

    let addedPersonStyle = { // css styling
        border: '1px solid black',
        display: 'flex',
        width: '80px',
        height: '80px',
        boxSizing: 'border-box',
        margin: '0px 5px 10px 5px',
        borderRadius: '50%',
        fontSize: '15px',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
    }

    let addedPersonHoverStyle = {
        border: '1px solid black',
        display: 'flex',
        width: '80px',
        height: '80px',
        boxSizing: 'border-box',
        margin: '0px 5px 10px 5px',
        borderRadius: '50%',
        fontSize: '15px',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: 'rgb(238, 238, 238)',
        cursor: 'pointer'
    }

    let onMouseEnterAddPerson = (index) => { 
        setHoverIndex(index);
      }

      let onMouseLeaveRemovePerson = () => {
        setHoverIndex('');
      }
    

    useEffect(() => { /*
    Vi bruger en timeout, hver gang noget af formDataet i formDataVOK (vores organisation kontakter form dataet) ændrer sig
    så vil vi sætte en timeout på 400 millisekunder. Hvis de indtaster noget før der er gået 400 millisekunder, vil clean up funktionen
    tager over så der ikke kommer en fejl når de taster. */
        let timeoutID = setTimeout(() => {
            setNavnRegexpError(false); /*Ingen fejl til at starte med for at skabe en effekt af at vise at hjemmesiden
            tjekker om det er korrekt */
            setEfternavnRegexpError(false);
            setEmailRegexpError(false);
            setTelefonnummerRegexpError(false);
            setAddressRegexpError(false);
           
        let navnRegexp = new RegExp(`^[A-Za-z0-9 æøåÆØÅ]{2,30}$`); /*vi definerer regular expressions  */
        let efternavnRegexp = new RegExp(`^[A-Za-z0-9 æøåÆØÅ]{2,30}$`);
        let emailRegexp = new RegExp(`^[A-Za-z0-9æøåÆØÅ]{2,255}[@][a-zA-ZæøåÆØÅ]{2,40}[.][a-zA-ZæøåÆØÅ]{2,3}$`);
        let telefonnummerRegexp = new RegExp(`^[0-9]{8,8}$`);
        let addressRegexp = new RegExp(`^[A-Za-z0-9, æøåÆØÅ]{5,100}`);
        
        if (!navnRegexp.test(formDataVOK.navnInputVOK) && formDataVOK.navnInputVOK !== '') {  /* vi tester
        alle regular expressions */
            setNavnRegexpError(true);
            return    
        } 

        if (!efternavnRegexp.test(formDataVOK.efternavnInputVOK) && formDataVOK.efternavnInputVOK !== '') {
            setEfternavnRegexpError(true);
            return
        }

        if (!telefonnummerRegexp.test(formDataVOK.telefonnummerInputVOK) && formDataVOK.telefonnummerInputVOK !== '') {
            setTelefonnummerRegexpError(true);
            return
        }

        if (!emailRegexp.test(formDataVOK.emailInputVOK) && formDataVOK.emailInputVOK !== '') {
            setEmailRegexpError(true);
            return
        }

        if (formDataVOK.addressInputVOK !== '' && !addressRegexp.test(formDataVOK.addressInputVOK)) {
            setAddressRegexpError(true);
            return 
        }
        }, 400)

        return () => clearTimeout(timeoutID);
    }, [formDataVOK]) // hver gang formDataVOK tilstand ændrer sig kører koden

    let [ styleAddedPersonContainer, setStyleAddedPersonContainer ] = useState({
        backgroundColor: 'rgb(234, 234, 234)',
        width: '430px',
        minHeight: '100px',
        position: 'absolute',
        top: '130px',
        left: '0px',
        zIndex: '10',
        overflow: 'visible',
        boxShadow: '0 0 1px 0.5px rgb(0, 0, 0)'
    });
    useEffect(() => { /* vi positionere, hvor person containeren skal være hvis der er over 4 personer i 
    liste af kontakter fordi så vil person containeren blive nødt til at blive placeret længere nede */
        if (storeListOfContacts.length > 4) {
            setStyleAddedPersonContainer({...styleAddedPersonContainer, top: '248px'});
        } else {
            setStyleAddedPersonContainer({...styleAddedPersonContainer, top: '125px'});
        }

    }, [storeListOfContacts])

    let onClickConfirmListTelefonnummer = () => {

        fetch('http://localhost:1000/addTelefonnummer', { // sender telefonnummer til serveren og opbevarer i database
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({storeAddedTelefonnummer}),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((res) =>{
            if (res.status === 201) {
                setStoreAddedTelefonnummer([]);
                setTelefonnummerChange('');
            }
        })
    }
    
    let onClickConfirmEmailList = () => {
        fetch('http://localhost:1000/addEmail', { // sender email til serveren og opbevarer i database
            method: 'POST', //post request
            credentials: 'include', // cookies inkluderet
            body: JSON.stringify({storeAddedEmails}), // dataet vi sender
            headers: {
                'Content-Type': 'application/json' // type af data
            },
        }).then((res) =>{
            if (res.status === 201) {
                setStoreAddedEmails([]);
                setEmailChange('');
            }
        })
    }

    let dateObject = new Date(); // laver dato objekt
    let year = dateObject.getFullYear(); // får de fulde år
    let month = dateObject.getMonth(); // fulde måned
    month = month + 1;
    if (month < 10) {
        month = `0${month}` // vi putter det basically op i dette format YYYY-MM-DD for at vi kan sætte mindste værdi på input felt
    }
    let day = dateObject.getDate(); // vi får dagen
    if (day < 10) {
        day = `0${day}`
    }
    
    let [date, setDate] = useState(`${year}-${month}-${day}`); // sætter mindst dato
    let [ maxDate, setMaxDate ] = useState(`${year + 100}-${month}-${day}`); // sætter max dato

    let handleSubmitStage3 = (e) => { // hvad der sker når vi trykker på videre knappen på stage 3 siden
        e.preventDefault();
        let formData = new FormData(e.target); // laver formData objekt
        localStorage.setItem('stage', '4'); // opbevarer stage i databasen, så vi er på samme side efter refresh 
        let stage = localStorage.getItem('stage');
        
        setStage(stage); // sætter stage til den sidste så vi kommer til betaling siden

        fetch('http://localhost:1000/submitStage3', { // sender formData ind til serveren som sender til databasen
            method: 'POST',
            credentials: 'include',
            body: formData
        }).then((res) => {
            if (res.status === 500) {
                localStorage.setItem('stage', '3');
                let stage = localStorage.getItem('stage');
                setStage(stage);
            }
        })
    }

    let [ continueToStage4, setContinueToStage4 ] = useState(false);

    useEffect(() => {
        // if statementsne tjekker om alt formdataet er rigtigt ellers bliver brugeren ikke sendt videre til næste side
        if (formDataStage3.synlighed === 'offentlig' && formDataStage3.skalBliveInformeret === 'ja' && formDataStage3.kontaktMulighed === true || formDataStage3.synlighed === 'privat' && formDataStage3.skalBliveInformeret === 'ja' && formDataStage3.kontaktMulighed === true) {
            setContinueToStage4(true);
        } else if (formDataStage3.synlighed === 'offentlig' && formDataStage3.skalBliveInformeret === 'nej' || formDataStage3.synlighed === 'privat' && formDataStage3.skalBliveInformeret === 'nej' ) {
            setContinueToStage4(true);
        } else {
            setContinueToStage4(false);
        }
    }, [formDataStage3])

    
    if (stage === '1') { // vi retunerer JSX elementer for stage 1 (bekræft identitet siden af opret tidskapsel)
  return (  
    <div><div id="breadcrumbNavigationTPC"><span className="material-symbols-outlined backwardsTPC">
    undo
    </span><span id="innerBreadTPC"><a href="/profile">Profil</a><span id="navigationAnchorTPC">&nbsp;&gt;&nbsp;</span><span>Lav en tidskapsel</span></span></div>
        <div id="contentContainerTPC">
            <div className="contentGridItemTPC" id="contentGridItem1TPC"><OpretTidskapselStages stage={stage}/></div>
            <div className="contentGridItemTPC" id="contentGridItem2TPC">
                <div id="mitIDContainerStage1">
                    <div id="mitIDItemStage1">
                    <h1 id="stage1HeaderBekræftIdentitet">Bekræft identitet med MitID</h1>
                    <p id="stage1SmallHeaderBekræftIdentitet">Vi har brug for at du logger ind med MitID for at vi kan bekræfte din identitet. Hvis du har flere spørgsmål til dette så <a href="#d">klik her</a> eller kontakt os på email: <span id="contactEmail">Tidskapslen@gmail.com</span></p>
                    </div>
                    <div>
                    <img src={mitIDLogo} id="mitIDLogo"/>
                    <div id="loginMitIDBtn" onClick={onClickMitIDBtn}>Log på med MitID</div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
  )
    } else if (stage === '2') { // vi retunerer JSX elementer for stage 2 (tidskapsel siden af opret tidskapsel)
        

        return (
            <div><div id="breadcrumbNavigationTPC"><span className="material-symbols-outlined backwardsTPC">
            undo
            </span><span id="innerBreadTPC"><a href="/profile">Profil</a><span id="navigationAnchorTPC">&nbsp;&gt;&nbsp;</span><span>Lav en tidskapsel</span></span></div>
                <div id="contentContainerTPC">
                    <div className="contentGridItemTPC" id="contentGridItem1TPC"><OpretTidskapselStages stage={stage}/></div>
                    <div className="contentGridItemTPC" id="contentGridItem2TPC">
                        <div id="formStage2Container">
                        <h1 id="headerTPC">Opret en tidskapsel</h1><div id="smallHeaderStage2"><h4 id="smallActualHeaderStage2">Her kommer du til at oprette, hvordan tidskapslens forside kommer til at se ud. Efter de sidste stadier er gennemgået kan du lægge noget op inde i selve tidskapslen.</h4></div>
                            <div id="overskriftContainerStage2">
                                <label htmlFor="overskriftStage2Input" className="labelStage2">Overskrift</label>
                                <br/>
                                <input name="overskrift" form="formStage2" id="overskriftStage2Input" onChange={onChangeOverskriftInput} value={overskriftInput} pattern="^[a-zA-Z 0-9]{2,43}$" required/>
                            </div>
                        <form id="formStage2" onSubmit={handleSubmitStage2}>  
                            <label id="imageStage2Label" htmlFor="imageStage2Input"><img alt="of yourself" src={timecapsuleImage} id="imageStage2" className="imageStage2" style={showImageStage2 ? { display: 'initial'} : {display: 'none'}} /><div className="textAndBtnImageStage2" style={showImageStage2 ? { display: 'none'} : {display: 'initial'}}>Vælg billede af tidskapslen (anbefales at være af dig selv)</div>
                            <div><button id="uploadImageBtnStage2" className="textAndBtnImageStage2" style={showImageStage2 ? { display: 'none'} : {display: 'initial'}}>Upload billede</button></div>{ uploadImageStage2Error ? <span id="uploadImageStage2Error">Du skal uploade et billede!</span> : null}
                            </label>
                            <input type="file" id="imageStage2Input" onChange={onChangeImage} name="file" />
                            <div>
                            <label htmlFor="navnStage2Input" className="labelStage2">Navn</label>
                            <label id="efternavnLabelStage2" htmlFor="efternavnInputStage2" className="labelStage2" >Efternavn</label>
                            <br/>
                            <input id="navnStage2Input" onChange={onChangeNavnInput} value={navnInput} pattern="^[a-zA-Z]{2,50}$" required name="navn"/>
                            
                            <input id="efternavnInputStage2" onChange={onChangeEfternavnInput} value={efternavnInput} pattern="^[a-zA-Z -]{2,80}$" required name="efternavn"/>
                            <div id="descriptionContainerStage2">
                            <label id="descriptionLabelStage2" htmlFor="descriptionInputStage2" className="labelStage2">Giv din tidskapsel en beskrivelse</label>
                            <br/>
                            <textarea id="descriptionInputStage2" onChange={onChangeDescriptionInput} value={descriptionInput} pattern="^[a-zA-Z0-9 -]{20,540}$" required name="beskrivelse"/>
                            </div>
                            </div>
                        </form>
                        <div id="btnContainerStage2">
                        <input type="submit" form="formStage2" id="submitBtnStage2" value="Næste" className={showImageStage2?'nextBtnStage2IsAllowed':'nextBtnStage2NotAllowed'}/>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
          )
    } else if (stage === '3') { // vi retunerer JSX elementer for stage 3 (indstillinger siden af opret tidskapsel)
        return (
            <div><div id="breadcrumbNavigationTPC"><span className="material-symbols-outlined backwardsTPC">
            undo
            </span><span id="innerBreadTPC"><a href="/profile">Profil</a><span id="navigationAnchorTPC">&nbsp;&gt;&nbsp;</span><span>Lav en tidskapsel</span></span></div>
                <div id="contentContainerTPC">
                    <div className="contentGridItemTPC" id="contentGridItem1TPC"><OpretTidskapselStages stage={stage}/></div>
                    <div className="contentGridItemTPC" id="contentGridItem2TPC">
                        <div id="gridStage3Container">
                        <div className="gridStage3Item"></div>
                        <div className="gridStage3Item">
                            <div id="stage3FormContainer">
                            <form id="stage3Form" onSubmit={handleSubmitStage3}>
                            <div id="stage3Option1Container">
                            <h2 id="stage3SmallHeader">Indstillinger for synlighed</h2>
                            <p id="stage3Pquestion1" className="stage3Question">1. Skal din tidskapsel være offentlig eller privat?</p>
                            <input type="radio" name="synlighed" value="offentlig" onChange={onChangeOffentligRadio} checked={offentligRadio} required/><label className="labelTextStage3"><span className="material-symbols-outlined iconStage3">
public
</span>Offentlig</label><br/><div id="optionOffentligStage3Text">- Alle der bruger hjemmesiden har adgang til at se, hvad der er lagt op i din tidskapsel.</div>
                            <br/>
                            <input type="radio" name="synlighed" value="privat" onChange={onChangePrivatRadio} checked={privatRadio} required/><label className="labelTextStage3" ><span className="material-symbols-outlined iconStage3">
lock
</span>Privat</label><br/><div id="optionPrivatStage3Text">- Du vælger, hvem der har adgang til denne tidskapsel ved brug af en kode.</div>
                            <br/>
                            <div id="stage3question2Container" className="marginBottom">
                            <label id="stage3Pquestion2" className="stage3Question">2. Hvornår skal tidskapslen udgives?</label>
                                <br/>
                                <select id="stage3SelectOptions" onChange={onChangeSelectUdgivning} name="udgivelsesTidspunkt">
                                    <option value="efterOprettelsen">Efter oprettelsen</option>
                                    <option id="chooseDateStage3" value="vælgEnDato">Vælg en dato</option>
                                    <option value="bestemSenere">Bestem senere</option>
                                </select>  
                                <br/>
                                { showDate ? <input type="date" id="stage3Date" name="date" min={date} max={maxDate} required/> : null }
                            </div> 
                            <label id="skalBliveInformeretLabel" className="marginBottom stage3Question">3. Er der nogle der skal blive informeret, når tidskapslen bliver udgivet?</label>
                            <br/>
                            <input type="radio" name="skalBliveInformeret" value="ja" onChange={handleSkalBliveInformeret} required/><label>Ja</label>
                            <br/>
                            {visKontaktMuligheder ? <div id="skalBliveInformeretContainer">
                                
                                <label id="kontaktMulighedLabel">&#8226; Hvordan skal personerne informeres?</label>
                                <br/>
                                <input type="radio" name="kontaktMulighed" value="email" onChange={onChangeKontaktMulighed} required/><label className="personInformeresLabel"><span className="material-symbols-outlined iconStage3">
mail
</span>Email</label>
                                <br/>
                                <div className="kontaktMulighedText">- Vi sender personen/personerne en email</div>
                                { showEmailOption ? 
                                <div id="emailMulighedStage3">
                                    <label id="tilføjEmailTPC" className="stage3Question">Indtast en email for at tilføje emailen til listen</label>
                                    <br/>
                                    <input id="textareaEmail" onKeyDown={handleKeyDownEmail} onChange={handleTextAreaEmailChange} value={emailChange} pattern="^[A-Za-z0-9]{2,255}[@][a-zA-Z]{2,40}[.][a-zA-Z]{2,3}$"></input><div className="addToListBtn" onClick={handleKeyDownEmail}>Tilføj til list</div>   { emailListError ? <div id="emailListError">Find et match til det anmodede format!</div> : null}{ emailListError2 ? <div id="emailListError2">Denne email er allerede tilføjet!</div> : null}<div id="emailContainerAddedTPC">{storeAddedEmails.map((email, index) => {
                                        return (<div key={index} ><li className="emailItemStage3" key={index}>{email}<span className="material-symbols-outlined closeSymbolStage3" key={index} onClick={(e) => handleClickRemoveEmail(e, index)}>
                                        close
                                        </span></li></div>)
                                    })}</div>
                                   { showConfirmBtnEmail ? <div id="confirmListEmail" onClick={onClickConfirmEmailList}>Bekræft list</div> : null }
                                </div> : <br/> }
                                <input type="radio" name="kontaktMulighed" value="voresOrganisationKontakter" onChange={onChangeKontaktMulighed} required/><label className="personInformeresLabel"><span className="material-symbols-outlined iconStage3">
groups_2
</span>Vores organisation kontakter personen</label>
                                <br/>
                                <div className="kontaktMulighedText">- Vi gør alt, hvad vi kan for at kontakte personen/personerne gennem de oplysninger vi får tildelt af dig. <i >Bemærk dette felt kan ikke vælges, hvis en dato ikke er valgt.</i></div>
                                
                                { showVOKOption ?
                                <div id="addPersonFlexContainer">
                                <div id="addPersonInnerContainer">
                                <div>
                                <p id="personHeaderVOK">Tilføj person <span id="addPersonNumber">{personNumber}</span>:</p>
                                <label id="navnLabelVOK">Personens navn</label><label id="efternavnLabelVOK">Personens efternavn</label>
                                <br/>
                                <input id="navnInputVOK" onChange={onChangeNavnInputVOK} value={formDataVOK.navnInputVOK} className="inputVOK"/><input id="efternavnInputVOK" className="inputVOK" onChange={onChangeEfternavnInputVOK} value={formDataVOK.efternavnInputVOK} />
                                <br/>
                                { navnRegexpError ? <span><span className="displayErrorVOK">Navn skal overholde formattet</span><br/></span> : null } { efternavnRegexpError ? <span><span className="displayErrorVOK" id="efternavnErrorVOK">Efternavn skal overholde formattet</span><br/></span> : null }
                                <label id="telefonnummerLabelVOK">Personens telefonnummer</label>
                                <br/>
                                <input id="telefonnummerInputVOK" onChange={onChangeTelefonnummerInputVOK} value={formDataVOK.telefonnummerInputVOK} className="inputVOK"/>
                                <br/>
                                { telefonnummerRegexpError ? <span><span className="displayErrorVOK">Telefonnummer skal overholde formattet</span><br/></span> : null }
                                <label id="emailLabelVOK">Personens email</label>
                                <br/>
                                <input id="emailInputVOK" onChange={onChangeEmailInputVOK} value={formDataVOK.emailInputVOK} className="inputVOK"/>
                                <br/>
                                 { emailRegexpError ? <span><span className="displayErrorVOK">Email skal overholde formattet</span><br/></span> : null }
                                <label>Personens adresse <span>(valg frit)</span></label>
                                <br/>
                                <input onChange={onChangeSearchAddressInput} id="searchAdressInput" placeholder='Begynd at søge efter personens adresse' value={addressSearch} className="inputVOK"/>
                                { showAddressContainer ? <div id="showAddressesContainer" >
                                    
                                    { 
                                        foundAddresses.map((address) => {
                                        return <span className="displayIndividualAddress" key={address} onClick={onClickIndividualAddress}>{address}</span>
                                    })
                                    
                                    }
                                     
                                </div> : null }
                                { addressRegexpError ? <span className="displayErrorVOK">Address skal overholde formattet</span> : null }


                                <div id="addPersonBtn" onClick={onClickAddPersonBtn}>Tilføj person</div>
                                </div>
                                </div>
                                <div id="flexItem1PersonList">
                                <h3 id="personListHeader">Your list of added contacts</h3>
                                <div id="outerFlexItem1">
                                    <div id="flexItem1ScrollContainer">
                                    { storeListOfContacts.map((person, index) => {
                                        return (<div className="addedPersonContainer" key={index}>
                                        <div className="addedPersonNumber" >{index + 1}</div>
                                        <div className="addedPerson" style={ hoverIndex === index ? addedPersonHoverStyle : addedPersonStyle } onMouseEnter={()=> onMouseEnterAddPerson(index)} onMouseLeave={() => onMouseLeaveRemovePerson()}>{person.navnInputVOK}</div>
                                        { hoverIndex === index && (
                                        <div key={index + 'info'} style={styleAddedPersonContainer}>
                                        <div className="personInformation"><span className="smallHeaderPersonInformation">Navn</span><div>{`${person.navnInputVOK} ${person.efternavnInputVOK}`}</div></div>
                                        <div className="personInformation"><span className="smallHeaderPersonInformation">Telefonnummer</span><div>{person.telefonnummerInputVOK}</div></div>
                                        <div className="personInformation"><span className="smallHeaderPersonInformation">Email</span><div>{person.emailInputVOK}</div></div>
                                        <div className="personInformation"><span className="smallHeaderPersonInformation">Adresse</span><div>{person.addressInputVOK === '' ? 'Ingen adresse angivet' : person.addressInputVOK}</div></div>
                                        </div>
                                    )}
                                        </div>
                                        );
                                    }) 
                                     
                                    }
                                    

                                    </div>
                                    </div>
                                </div>

                                </div> : null}





                                <br/>
                                <input type="radio" name="kontaktMulighed" value="telefonnummer" onChange={onChangeKontaktMulighed} required/><label className="personInformeresLabel"><span className="material-symbols-outlined iconStage3">
call
</span>Telefonnummer</label>
                                <br/>
                                <div className="kontaktMulighedText">- Vi sender en SMS til personen/personerne ved brug af telefonnummer</div>
                                { showTelefonnummerOption ? 
                                <div id="telefonnummerMulighedStage3">
                                    <label id="tilføjTelefonnummerTPC" className="stage3Question">Indtast et telefonnummer for at tilføje telefonnummeret til listen</label>
                                    <br/>
                                    <input id="textareaTelefonnummer" onKeyDown={handleKeyDownTelefonnummer} onChange={handleTextAreaTelefonnummerChange} value={telefonnummerChange} pattern="^[A-Za-z0-9]{2,255}[@][a-zA-Z]{2,40}[.][a-zA-Z]{2,3}$"></input><div className="addToListBtn" onClick={handleKeyDownTelefonnummer}>Tilføj til list</div> { telefonnummerListError ? <div id="telefonnummerListError">Find et match til det anmodede format!</div> : null}{ telefonnummerListError2 ? <div id="telefonnummerListError2">Denne email er allerede tilføjet!</div> : null}<div id="telefonnummerContainerAddedTPC">{storeAddedTelefonnummer.map((telefonnummer, index) => {
                                        return (<div key={index} className="telefonnummerItemStage3Container"><li className="telefonnummerItemStage3" key={index}>{telefonnummer}<span className="material-symbols-outlined closeSymbolStage3" key={index} onClick={(e) => handleClickRemoveTelefonnummer(e, index)}>
                                        close
                                        </span></li></div>)
                                    })}</div>
                                   { showConfirmBtnTelefonnummer ? <div id="confirmListTelefonnummer" onClick={onClickConfirmListTelefonnummer}>Bekræft list</div> : null }
                                </div> : <br/> }
                            </div> : null }
                                
                            <input type="radio" name="skalBliveInformeret" value="nej" onChange={handleSkalBliveInformeret} required/><label>Nej</label><span id="skalBliveInformeretTextStage3">&nbsp;(du kan altid ombestemme dig)</span>
                            <br/>
                            <input type="radio" name="skalBliveInformeret" value="vælgSenere" onChange={handleSkalBliveInformeret} required/><label>Vælg senere</label>
                            </div>
                            <button id="nextBtnStage3" className={ continueToStage4 ? 'nextBtnStage3IsAllowed' : 'nextBtnStage3NotAllowed'}  type="submit" >Næste</button>
                            </form>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
          )
    } else if (stage === '4') { // vi retunerer JSX elementer for stage 4 (betaling siden af opret tidskapsel)
    return (
        <div><div id="breadcrumbNavigationTPC"><span className="material-symbols-outlined backwardsTPC">
    undo
    </span><span id="innerBreadTPC"><a href="/profile">Profil</a><span id="navigationAnchorTPC">&nbsp;&gt;&nbsp;</span><span>Lav en tidskapsel</span></span></div>
        <div id="contentContainerTPC">
            <div className="contentGridItemTPC" id="contentGridItem1TPC"><OpretTidskapselStages stage={stage}/></div>
            <div className="contentGridItemTPC" id="contentGridItem2TPC">
                <Stage4Payment></Stage4Payment> 
            </div>
        </div>
    </div>
    )
    }

}
