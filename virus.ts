import {Personne, Variants} from "./personnes";

class Maybe<T> {
    private readonly value: T | null;

    private constructor(value: T | null) {
        this.value = value;
    }

    static of<T>(value: T | null) {
        return new Maybe<T>(value);
    }

    isNothing() {
        return this.value === null || this.value === undefined;
    }

    isSomething() {
        return !this.isNothing();
    }

    get(): T {
        if (!this.value) {
            throw new Error();
        }
        return this.value;
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
    if (socialAscendants) {
        for (const contact of socialAscendants) {
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
    for (const personne of personnes) {
        const parent = trouverAscendant(personneContamine, personne);
        if(parent.isSomething())
        {
            let contaminer = true;
            for(const personne of parent.get().social)
            {
                if(contaminer)
                {
                    propager(personne, personnes);
                }
                contaminer = !contaminer;
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

function trouverAscendant(personneCherche: Personne, personne: Personne, cache: Map<Personne,
    Maybe<Personne>> = new Map()): Maybe<Personne>
{
    if (cache.has(personne)) {
        return cache.get(personne) as Maybe<Personne>;
    }
    for (const personneDuGroupe of personne.social)
    {
        if (personneCherche === personneDuGroupe)
        {
            const maybePersonne = Maybe.of(personne);
            cache.set(personne, maybePersonne);
            return maybePersonne;
        }

        if (personneDuGroupe.social.length > 0)
        {
            const maybePersonneTrouve = trouverAscendant(personneCherche, personneDuGroupe, cache);
            if (maybePersonneTrouve.isSomething()) {
                cache.set(personne, maybePersonneTrouve);
                return maybePersonneTrouve;
            }
        }
    }
    const maybeNull = Maybe.of<Personne>(null);
    cache.set(personne, maybeNull);
    return maybeNull;
}

function obtenirAscendants(personneCherche: Personne, personnes: Personne[]): Personne[] | null {
    if (!personnes || personnes.length === 0) {
        return null;
    }

    const ascendants: Personne[] = [];

    for (const personne of personnes) {
        const parentTrouve = trouverAscendant(personneCherche, personne);

        if (parentTrouve.isSomething()) {
            ascendants.push(parentTrouve.get());
            const ascendantsDuParent = obtenirAscendants(parentTrouve.get(), personnes);
            if (ascendantsDuParent) {
                ascendants.push(...ascendantsDuParent);
            }
            break;
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

export function initialiserInfection(patientsZero: Personne[], personnes: Personne[]): void {
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