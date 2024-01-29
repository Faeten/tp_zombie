import * as fs from 'fs';
import {Personne} from "./personnes";
import * as vaccins from "./vaccins";
import * as virus from "./virus"

fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Erreur lors de la lecture du fichier :', err);
        return;
    }

    const personnes: Personne[] = JSON.parse(data) as Personne[];

    //Infection des patients zeros en dur
    const patientsZero: Personne[] = [
        personnes[1].social[0], // Mary
        personnes[0].social[0].social[1] // Eva
    ];

    virus.initialiserInfection(patientsZero, personnes);
    personnes.map(vaccins.administrerVaccins);
});