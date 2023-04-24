let express = require('express');
let app = express();
let cors = require('cors');
let bodyParser = require('body-parser');
let pool = require('./src/Database.js')
let bcrypt = require('bcrypt');
let session = require('express-session');
let multer = require('multer');
const mysqlStore = require('express-mysql-session')(session);

const upload = multer()

const options = {
    connectionLimit: 10,
    password: process.env.MYSQL_PASSWORD,
    user: 'root',
    database: 'tidskapslen_sessionStorage',
    host: 'localhost',
    port: '3306',
    createDatabaseTable: true
    /* debug: true */
}

const sessionStore = new mysqlStore(options);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

sessionStore.on('connect', () => {
    console.log('Connected to the session store!');
  });
  
  sessionStore.on('error', (err) => {
    console.log('Error connecting to the session store:', err);
  });


app.use(session({
    name: 'session',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret:'da2si1KASmda92kSk1s',
    cookie: {
        maxAge: 10000 * 60 * 60 * 2, // 2 hours
        secure: false,
        httpOnly: true
    }
}))

app.post('/opretBrugerForm', upload.none(), async (req, res) => {
    console.log(req.session);
    let { brugernavn, email, telefonnummer, confirmAdgangskode} = req.body;
    brugernavn = brugernavn.toLowerCase();
    email = email.toLowerCase();

    let validatorSQL = `SELECT * FROM opret_bruger_information WHERE brugernavn = ? OR email = ? OR telefonnummer = ?`
    
    pool.query(validatorSQL, [brugernavn, email, telefonnummer], async (err, results) => {
        if (err) {
            return res.status(500).redirect('http://localhost:3000/');
        }

        if (results[0]) {
            return res.status(500).redirect('http://localhost:3000/');
        } else if (!results[0]) {
            let salt = await bcrypt.genSalt(10);
            let hashedAdgangskode = await bcrypt.hash(confirmAdgangskode, salt);

            let insertUserSQL = `INSERT INTO opret_bruger_information (brugernavn, email, telefonnummer, adgangskode) \
            VALUES (?, ?, ?, ?)`
            pool.query(insertUserSQL, [brugernavn, email, telefonnummer, hashedAdgangskode], async (err, results) => {
        // adgangskode: testtestTEST1@
        if (err) {
            return res.status(500).send();
        }

        
        return res.status(201).send();

    })
        }
    })
})

app.post('/opretBrugerFormUsername', (req,res) => {
    let usernameSQL = `SELECT brugernavn FROM opret_bruger_information WHERE brugernavn = ?`;
    pool.query(usernameSQL, [req.body.username], async (err, results) => {
        let usernameInUse = { usernameInUse: null}
        if (err) {
            usernameInUse = { usernameInUse: true}
            return res.status(500).send(JSON.stringify(usernameInUse))
        }
        
        if (results.length === 0) {
            usernameInUse = { usernameInUse: false}
            return res.status(201).send(JSON.stringify(usernameInUse))
        } else {
            usernameInUse = { usernameInUse: true}
            return res.status(400).send(JSON.stringify(usernameInUse))
        }
    })
})

app.post('/opretBrugerFormEmail', (req, res) => {
    let emailSQL = `SELECT email FROM opret_bruger_information WHERE email = ?`;
    pool.query(emailSQL, [req.body.email], async (err, results) => {
        let emailInUse = { emailInUse: null}
        if (err) {
            emailInUse = { emailInUse: true}
            return res.status(500).send(JSON.stringify(emailInUse))
        }

        if (results.length === 0) {
            emailInUse = { emailInUse: false}
            console.log('cake')
            return res.status(201).send(JSON.stringify(emailInUse))
        } else {
            emailInUse = { emailInUse: true}
            return res.status(400).send(JSON.stringify(emailInUse))
        }
    })
})

app.post('/opretBrugerFormTelefonnummer', (req, res) => {
    let telefonnummerSQL = `SELECT telefonnummer FROM opret_bruger_information WHERE telefonnummer = ?`;
    pool.query(telefonnummerSQL, [req.body.telefonnummer], async (err, results) => {
        let telefonnummerInUse = { telefonnummerInUse: null}
        if (err) {
            telefonnummerInUse = { telefonnummerInUse: true}
            return res.status(500).send(JSON.stringify(telefonnummerInUse))
        }

        if (results.length === 0) {
            telefonnummerInUse = { telefonnummerInUse: false}
            console.log('results = 0')
            return res.status(201).send(JSON.stringify(telefonnummerInUse))
        } else {
            telefonnummerInUse = { telefonnummerInUse: true}
            return res.status(400).send(JSON.stringify(telefonnummerInUse))
        }
    })
})

app.post('/login', upload.none(), (req, res) => {
    let { brugernavnEmail, adgangskode } = req.body;

    brugernavnEmail = brugernavnEmail.toLowerCase();

    let loginSQL = `SELECT brugernavn, adgangskode, email, adgangskode, bruger_id FROM opret_bruger_information WHERE brugernavn = ? OR email = ?`;

    pool.query(loginSQL, [brugernavnEmail, brugernavnEmail], async (err, results) => {
        if (err) {
            return res.status(500).send();
        }
        console.log(results[0]);
        if (results.length === 0) {
            return res.status(401).send();
        }

        let comparePasswords = await bcrypt.compare(adgangskode, results[0].adgangskode); // return true or false

        if (!comparePasswords) {
            return res.status(401).send();
        }

        if (comparePasswords && results[0].brugernavn === brugernavnEmail || results[0].email === brugernavnEmail) {
            req.session.user = { 
                authorized: 'true',
                id: results[0].bruger_id
         };
            return res.status(201).send();
        }
    })
})

let checkAuthorization = (req, res, next) => {
    if (req.session.user && req.session.user.authorized) {
        req.authorized = true
    } else if (!req.session.user || !req.session.user.authorized) {
        req.authorized = false
    }
    next();
}

app.get('/navBarAuthorization', checkAuthorization, (req, res) => {
    console.log(req.authorized);
    if (req.authorized) {
        res.status(201).send(JSON.stringify({authorized: req.authorized}));
    } else if (!req.authorized) {
        res.status(201).send(JSON.stringify({authorized: req.authorized}));
    }

})

const uploadFile = multer({ dest: './uploads' });

app.post('/stage2Tidskapsel', uploadFile.single('file'), checkAuthorization, (req, res) => {
    
    if (!req.authorized || !req.session.user || !req.session.user.id) {
        return res.status(401).send();
    }
    console.log(req.session.user);
    let { overskrift, navn, efternavn, beskrivelse } = req.body;
    let filePath = req.file.path;
    let stage2TidskapselSQL = `INSERT INTO forside_af_tidskapsel (tidskapsel_id, overskrift, navn, efternavn, beskrivelse, filePath) \
    VALUES (?, ?, ?, ?, ?, ?)`;
    pool.query(stage2TidskapselSQL, [req.session.user.tidskapselNummerIBrug, overskrift, navn, efternavn, beskrivelse, filePath], (err, result) => {
        if (err) {
            res.status(500).send();
        }
        res.status(201).send();
    });
})

app.post('/createTimecapsule', (req, res) => {
    console.log('test')
    console.log(req.session.user.id);
    let createTimecapsuleSQL = `INSERT INTO bruger_tidskapsler (bruger_id) VALUES (?);`
    pool.query(createTimecapsuleSQL, [req.session.user.id], (err, results) => {
        if (err) {
            return console.log(err);
        }
        
        let getTidskapselIDSQL = `SELECT tidskapsel_id FROM bruger_tidskapsler WHERE bruger_id = ?;`
        pool.query(getTidskapselIDSQL, [req.session.user.id], (err, results) => {
            if (err) {
                return console.log(err);
            }
        
            req.session.user.tidskapselNummerIBrug = results[results.length - 1].tidskapsel_id;
            res.status(201).send();
        })
    })
})

app.post('/addPersonVOK', (req, res) => {
    if (req.body) {
    let insertIdSQL = `
    INSERT INTO tidskapsel_indstillinger (tidskapsel_id, skalPersonerInformeres) 
    SELECT ?, ?
    WHERE NOT EXISTS (
        SELECT tidskapsel_id FROM tidskapsel_indstillinger WHERE tidskapsel_id = ?
        )`;

    pool.query(insertIdSQL, [req.session.user.tidskapselNummerIBrug, true, req.session.user.tidskapselNummerIBrug], (err, results) => {
        if (err) {
            return console.log(err);
        }

        let selectIdSQL = `SELECT tidskapsel_indstillinger_id FROM tidskapsel_indstillinger WHERE tidskapsel_id = ?`;
        pool.query(selectIdSQL, [req.session.user.tidskapselNummerIBrug], (err, results) => {
            if (err) {
                return console.log(err);
            }

            let insertPeopleSQL = `INSERT INTO kontakt_pårørende (tidskapsel_indstillinger_id, email_mulighed, vores_organisation_kontakter_mulighed, telefonnummer_mulighed, navn, efternavn, telefonnummer, email, adresse)\
            VALUES (?,?,?,?,?,?,?,?,?)`;
            pool.query(insertPeopleSQL, [results[0].tidskapsel_indstillinger_id, false, true, false, req.body.navnInputVOK.toLowerCase(), req.body.efternavnInputVOK.toLowerCase(), req.body.telefonnummerInputVOK, req.body.emailInputVOK.toLowerCase(), req.body.addresseInputVOK], (err, results) => {
                if (err) {
                    console.log(err);
                }

                res.status(201).send();
            });
        })  
    })
    }
})

app.get('/getAddedContacts', (req, res) => {
    let getIdSQL = `SELECT tidskapsel_indstillinger_id FROM tidskapsel_indstillinger WHERE tidskapsel_id = ?`;
    pool.query(getIdSQL, [req.session.user.tidskapselNummerIBrug], (err, results) => {
    let getVOKData = `SELECT * FROM kontakt_pårørende
    INNER JOIN tidskapsel_indstillinger ON kontakt_pårørende.tidskapsel_indstillinger_id = tidskapsel_indstillinger.tidskapsel_indstillinger_id
    WHERE kontakt_pårørende.vores_organisation_kontakter_mulighed = 1 AND kontakt_pårørende.tidskapsel_indstillinger_id = ?`;
    pool.query(getVOKData, [results[0].tidskapsel_indstillinger_id], (err, results) => {
        if (err) {
            return console.log(err)
        }
        console.log(results);
        for (let i = 0; i < results.length; i++) {
            if (results[i].adresse === null) {
                results[i].adresse = 'Ingen adresse angivet';
            }
        }
        
        if (!results) {
            res.status(500).send();
        } else if (results.length > 0) {
            console.log(results);
            res.status(201).send(JSON.stringify(results));
        } else if (results.length === 0) {
            res.status(201).send();
        }

    });
})
})

app.post('/addTelefonnummer', (req, res) => {
    if (req.body) {
        let insertIdSQL = `
        INSERT INTO tidskapsel_indstillinger (tidskapsel_id, skalPersonerInformeres) 
        SELECT ?, ?
        WHERE NOT EXISTS (
            SELECT tidskapsel_id FROM tidskapsel_indstillinger WHERE tidskapsel_id = ?
            )`;
            
        pool.query(insertIdSQL, [req.session.user.tidskapselNummerIBrug, true, req.session.user.tidskapselNummerIBrug], (err, results) => {
            if (err) {
                return console.log(err);
            }
            
            let selectIdSQL = `SELECT tidskapsel_indstillinger_id FROM tidskapsel_indstillinger WHERE tidskapsel_id = ?`;
            pool.query(selectIdSQL, [req.session.user.tidskapselNummerIBrug], (err, results) => {
                if (err) {
                    return console.log(err);
                }
                for (let i = 0; req.body.storeAddedTelefonnummer.length > i; i++) {
                let insertPeopleSQL = `INSERT INTO kontakt_pårørende (tidskapsel_indstillinger_id, email_mulighed, vores_organisation_kontakter_mulighed, telefonnummer_mulighed, telefonnummer)\
                VALUES (?,?,?,?,?)`;
                pool.query(insertPeopleSQL, [results[0].tidskapsel_indstillinger_id, false, false, true, req.body.storeAddedTelefonnummer[i]], (err, results) => {
                    if (err) {
                        console.log(err);
                    }
    
                    res.status(201).send();
                });
            }
            })  
        })
        }
})

app.post('/addEmail', (req, res) => {
    if (req.body.storeAddedEmails) {
        let insertIdSQL = `
        INSERT INTO tidskapsel_indstillinger (tidskapsel_id, skalPersonerInformeres) 
        SELECT ?, ?
        WHERE NOT EXISTS (
            SELECT tidskapsel_id FROM tidskapsel_indstillinger WHERE tidskapsel_id = ?
            )`;
            
        pool.query(insertIdSQL, [req.session.user.tidskapselNummerIBrug, true, req.session.user.tidskapselNummerIBrug], (err, results) => {
            if (err) {
                return console.log(err);
            }
            
            let selectIdSQL = `SELECT tidskapsel_indstillinger_id FROM tidskapsel_indstillinger WHERE tidskapsel_id = ?`;
            pool.query(selectIdSQL, [req.session.user.tidskapselNummerIBrug], (err, results) => {
                if (err) {
                    return console.log(err);
                }
                for (let i = 0; req.body.storeAddedEmails.length > i; i++) {
                let insertPeopleSQL = `INSERT INTO kontakt_pårørende (tidskapsel_indstillinger_id, email_mulighed, vores_organisation_kontakter_mulighed, telefonnummer_mulighed, email)\
                VALUES (?,?,?,?,?)`;
                pool.query(insertPeopleSQL, [results[0].tidskapsel_indstillinger_id, true, false, false, req.body.storeAddedEmails[i]], (err, results) => {
                    if (err) {
                        console.log(err);
                    }
    
                    res.status(201).send();
                });
            }
            })  
        })
        }
})

app.post('/submitStage3', upload.none(), (req, res) => {
    let updateSettingsSQL = `
    UPDATE tidskapsel_indstillinger
    SET synlighed = ?, udgivelsestidspunkt = ?, skalPersonerInformeres = ?
    WHERE tidskapsel_id = ?;`
    pool.query(updateSettingsSQL, [req.body.synlighed, req.body.udgivelsesTidspunkt, req.body.skalBliveInformeret, req.session.user.tidskapselNummerIBrug], (err, results) => {
        if (err) {
            console.log(err);
        }

        if (req.body.skalBliveInformeret === 'ja') {
            let insertIdSQL = `
        INSERT INTO tidskapsel_indstillinger (tidskapsel_id, skalPersonerInformeres) 
        SELECT ?, ?
        WHERE NOT EXISTS (
            SELECT tidskapsel_id FROM tidskapsel_indstillinger WHERE tidskapsel_id = ?
            )`;
            
        pool.query(insertIdSQL, [req.session.user.tidskapselNummerIBrug, true, req.session.user.tidskapselNummerIBrug], (err, results) => {
            if (err) {
                return console.log(err);
            }
            let getIdSQL = `SELECT tidskapsel_indstillinger_id FROM tidskapsel_indstillinger WHERE tidskapsel_id = ?`;
            pool.query(getIdSQL, [req.session.user.tidskapselNummerIBrug], (err, results) => {
            if (req.body.kontaktMulighed === 'email') {
                let deleteContactsSQL = `DELETE FROM kontakt_pårørende WHERE vores_organisation_kontakter_mulighed = ${true} AND tidskapsel_indstillinger_id = ? OR telefonnummer_mulighed = ${true} AND tidskapsel_indstillinger_id = ?;`;
                pool.query(deleteContactsSQL, [results[0].tidskapsel_indstillinger_id, results[0].tidskapsel_indstillinger_id], (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                })
            } else if (req.body.kontaktMulighed === 'telefonnummer') {
                let deleteContactsSQL = `DELETE FROM kontakt_pårørende WHERE vores_organisation_kontakter_mulighed = ${true} AND tidskapsel_indstillinger_id = ? OR email_mulighed = ${true} AND tidskapsel_indstillinger_id = ?;`;
                pool.query(deleteContactsSQL, [results[0].tidskapsel_indstillinger_id, results[0].tidskapsel_indstillinger_id], (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                })
            } else if (req.body.kontaktMulighed === 'voresOrganisationKontakter') {
                let deleteContactsSQL = `DELETE FROM kontakt_pårørende WHERE telefonnummer_mulighed = ${true} AND tidskapsel_indstillinger_id = ? OR email_mulighed = ${true} AND tidskapsel_indstillinger_id = ?;`;
                pool.query(deleteContactsSQL, [results[0].tidskapsel_indstillinger_id, results[0].tidskapsel_indstillinger_id], (err, results) => {
                    if (err) {
                        console.log(err);
                    }

                    res.status(201).send();
                })
            }
        })
    })
        } else if (req.body.skalBliveInformeret === 'nej' || req.body.skalBliveInformeret === 'vælgSenere') {
            res.status(201).send();
        } 
    })
})

app.listen(1000, () =>{
    console.log('listening on port 1000'); 
})