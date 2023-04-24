
USE tidskapslen_database;

CREATE TABLE opret_bruger_information (
	bruger_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    brugernavn VARCHAR(255),
    email VARCHAR(255),
    telefonnummer VARCHAR(255),
    adgangskode VARCHAR(255)
);
    
SELECT * FROM opret_bruger_information;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE kontakt_pårørende;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE bruger_tidskapsler (
	tidskapsel_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	bruger_id INTEGER,
    FOREIGN KEY (bruger_id) REFERENCES opret_bruger_information (bruger_id)
);

SELECT * FROM bruger_tidskapsler;

CREATE TABLE forside_af_tidskapsel (
	forside_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	tidskapsel_id INTEGER,
    FOREIGN KEY (tidskapsel_id) REFERENCES bruger_tidskapsler (tidskapsel_id),
    overskrift VARCHAR(255),
    navn VARCHAR(255),
    efternavn VARCHAR(255),
    beskrivelse VARCHAR(500),
    filePath VARCHAR(100)
);

SELECT * FROM forside_af_tidskapsel;

CREATE TABLE tidskapsel_indstillinger (
	tidskapsel_indstillinger_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
	tidskapsel_id INTEGER,
    FOREIGN KEY (tidskapsel_id) REFERENCES bruger_tidskapsler (tidskapsel_id),
    synlighed VARCHAR(255),
    udgivelsestidspunkt VARCHAR(255),
    skalPersonerInformeres VARCHAR(255)
);

SELECT * FROM tidskapsel_indstillinger;

CREATE TABLE kontakt_pårørende (
	kontakt_mulighed_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tidskapsel_indstillinger_id INTEGER,
	FOREIGN KEY (tidskapsel_indstillinger_id) REFERENCES tidskapsel_indstillinger (tidskapsel_indstillinger_id),
    email_mulighed VARCHAR(5),
    vores_organisation_kontakter_mulighed VARCHAR(5),
    telefonnummer_mulighed VARCHAR(5),
    navn VARCHAR(255),
    efternavn VARCHAR(255),	
    telefonnummer VARCHAR(255),
    email VARCHAR(255),
    adresse VARCHAR(255)
);
SELECT * FROM kontakt_pårørende;

