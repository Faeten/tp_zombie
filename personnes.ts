export enum Variants {
    ZOMBIE_A,
    ZOMBIE_B,
    ZOMBIE_32,
    ZOMBIE_C,
    ZOMBIE_ULTIME
}

export class Personne {
    nom: string;
    age: number;
    infecte: boolean;
    immunise: boolean;
    variant: Variants;
    social: Personne[];

    constructor(nom: string, age: number, infecte: boolean, variant: Variants, social: Personne[]) {
        this.nom = nom;
        this.age = age;
        this.infecte = infecte;
        this.variant = variant;
        this.social = social;
        this.immunise = false;
    }
}
