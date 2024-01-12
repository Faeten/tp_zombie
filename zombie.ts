import * as fs from 'fs';

enum Variants {
    ZOMBIE_A,
    ZOMBIE_B,
    ZOMBIE_32,
    ZOMBIE_C,
    ZOMBIE_ULTIME
}

class Personne {
    nom: string;
    age: number;
    infecte: boolean;
    variant: Variants;
    social: Personne[];
    constructor(nom: string, age: number, infecte: boolean, variant: Variants, social: Personne[]) {
    this.nom = nom;
    this.age = age;
    this.infecte = infecte;
    this.variant = variant;
    this.social = social;
    }
}

function propagerZombieA(personne: Personne, personnes: Personne[]): void {
    if (!personne || personne.infecte) {
        return;
    }

    personne.infecte = true;
    console.log(personne.nom + " a le zombie-A !");

    if (personne.social) {
        for (const p of personne.social) {
            propager(p, personnes);
        }
    }
}

function propagerZombieB(personne: Personne, personnes: Personne[]): void {
    if (!personne || personne.infecte) {
        return;
    }

    personne.infecte = true;
    console.log(personne.nom + " a le zombie-B !");

    const socialAscendants = obtenirAscendants(personne, personnes);
    if(socialAscendants)
    {
        for (const contact of socialAscendants)
        {
            propager(contact, personnes);
        }
    }
}

function propagerZombie32(personne: Personne, personnes: Personne[]): void {
    if (!personne || personne.infecte) {
        return;
    }

    if (personne.age >= 32) {
        personne.infecte = true;
        console.log(personne.nom + " a le zombie-32 !");

        if (personne.social) {
            for (const contact of personne.social) {
                propager(contact, personnes);
            }
        }
    }
    console.log(personne.nom + " n'a pas le zombie-32 !");
}

function propagerZombieC(personneContamine: Personne, personnes: Personne[]): void {
    if (!personneContamine || personneContamine.infecte) {
        return;
    }

    personneContamine.infecte = true;
    console.log(personneContamine.nom + " a le zombie-C !");
    for (const personne of personnes)
    {
        const parent = trouverAscendant(personneContamine, personne);
        if(parent)
        {
            let contaminer = true;
            for(const personne of parent.social)
            {
                if(contaminer)
                {
                    propager(personne, personnes);
                }
                contaminer=!contaminer;
            }
            break;
        }
    }
}

function propagerZombieUltime(personne: Personne, personnes: Personne[]): void {
    if (!personne || personne.infecte) {
        return;
    }

    personne.infecte = true;
    console.log(personne.nom + " a le zombie-Ultime !");

    // Propagation vers la personne racine la plus ascendante
    const parent = obtenirParent(personne, personnes);
    if (parent) {
        propagerZombieUltime(parent, personnes);
    }
}

function trouverAscendant(personneCherche: Personne, personne: Personne): Personne | null
{
    for (let personneDuGroupe of personne.social) {
        if (personneCherche == personneDuGroupe) {
            return personne;
        }
        if (personneDuGroupe.social.length > 0) {
            let personneTrouve = trouverAscendant(personneCherche, personneDuGroupe);
            if (personneTrouve) {
                return personneTrouve;
            }
        }
    }
    return null
}

function obtenirAscendants(personneCherche: Personne, personnes: Personne[]): Personne[] | null {
    if (!personnes || personnes.length === 0) {
        return null;
    }

    const ascendants: Personne[] = [];

    for (const personne of personnes) {
        const parentTrouve = trouverAscendant(personneCherche, personne);

        if (parentTrouve) {
            ascendants.push(parentTrouve);
            const ascendantsDuParent = obtenirAscendants(parentTrouve, personnes);
            if (ascendantsDuParent) {
                ascendants.push(...ascendantsDuParent);
            }
            break;  // parent trouvé
        }
    }


    return ascendants.length > 0 ? ascendants : null;
}

function obtenirParent(personne: Personne, personnes: Personne[]): Personne | null {
    if (!personnes || personnes.length === 0) {
        return null;
    }

    for (const parent of personnes) {
        if (parent.social && parent.social.includes(personne)) {
            return parent;
        } else {
            // récursivité pour le parent
            const parentTrouve = obtenirParent(personne, parent.social);
            if (parentTrouve) {
                return parentTrouve;
            }
        }
    }

    return null;
}

function initialiserInfection(patientsZero: Personne[], personnes: Personne[]): void {
    for (const patientZero of patientsZero) {
        propager(patientZero, personnes);
    }
}

function propager(personne: Personne, personnes: Personne[]): void {
    switch (personne.variant) {
        case Variants.ZOMBIE_A:
            propagerZombieA(personne, personnes);
            break;
        case Variants.ZOMBIE_B:
            propagerZombieB(personne, personnes);
            break;
        case Variants.ZOMBIE_32:
            propagerZombie32(personne, personnes);
            break;
        case Variants.ZOMBIE_C:
            propagerZombieC(personne, personnes);
            break;
        case Variants.ZOMBIE_ULTIME:
            propagerZombieUltime(personne, personnes);
            break;
        default:
            console.error('Variant non géré');
            break;
    }
}

fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Erreur lors de la lecture du fichier :', err);
        return;
    }

    const personnes: Personne[] = JSON.parse(data) as Personne[];

    //Infection des patients zeros en dur
    const patientsZero: Personne[] = [];
    //patientsZero.push(personnes[1].social[0]); //Mary
    patientsZero.push(personnes[0].social[0].social[1]); //Eva

    initialiserInfection(patientsZero, personnes);
    // Trouver la personne Eva dans l'arbre
    const eva = personnes[0].social[0].social[1];

    // Vérifier si Eva a été trouvée
    if (eva) {
        // Utiliser la fonction obtenirAscendants pour obtenir tous les ascendants d'Eva
        const ascendantsEva = obtenirAscendants(eva, personnes);

        // Afficher les noms des ascendants d'Eva
        if (ascendantsEva) {
            const nomsAscendants = ascendantsEva.map((p) => p.nom);
            console.log(`Les ascendants d'Eva sont : ${nomsAscendants.join(', ')}`);
        } else {
            console.log('Eva n\'a pas d\'ascendants.');
        }
    } else {
        console.log('Eva n\'a pas été trouvée dans l\'arbre.');
    }


    console.log(JSON.stringify(personnes, null, 2));
});