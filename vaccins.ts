import {Personne, Variants} from './personnes';

export function administrerVaccin(personne: Personne): Personne {
    switch (personne.variant) {
        case Variants.ZOMBIE_A:
        case Variants.ZOMBIE_32:
            if (personne.age >= 0 && personne.age <= 30) {
                console.log(`${personne.nom} a reçu le Vaccin-A.1`);
                return {...personne, infecte: false, immunise: true};
            }
            return personne;
        case Variants.ZOMBIE_B:
        case Variants.ZOMBIE_C:
            if (Math.random() < 0.5) {
                console.log(`${personne.nom} a reçu le Vaccin-B.1`);
                return {...personne, infecte: false};
            } else {
                console.log(`${personne.nom} est morte`);
                return personne;
            }
        case Variants.ZOMBIE_ULTIME:
            console.log(`${personne.nom} a reçu le Vaccin-Ultime`);
            return {...personne, immunise: true};
        default:
            console.error('Variant non géré');
            return personne;
    }
}

export function administrerVaccins(personne: Personne): Personne {
    personne = personne.infecte ? administrerVaccin(personne) : personne;

    const descendantsVaccines = personne.social.map(administrerVaccins);

    return {...personne, social: descendantsVaccines};
}
