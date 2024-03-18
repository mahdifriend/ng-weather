import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

export const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {

    // Initialisation d'un BehaviorSubject avec un tableau vide.
    // BehaviorSubject garde la dernière valeur et la fournit aux nouveaux abonnés.
    private locationsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
    // Exposition d'un Observable pour permettre aux composants de s'abonner aux changements de localisations.
    locations$ = this.locationsSubject.asObservable();

    constructor() {
        let locString = localStorage.getItem(LOCATIONS);
        if (locString) {
            let locations = JSON.parse(locString);
            for (let loc of locations) {
                this.locationsSubject.next([...this.locationsSubject.value, loc]);
            }
        }
    }

    addLocation(zipcode: string) {
        // Mise à jour des localisations et notification des abonnés avec la nouvelle liste de localisations.
        if (!this.locationsSubject.value.includes(zipcode)) {
            const updatedLocations = [...this.locationsSubject.value, zipcode];
            this.locationsSubject.next(updatedLocations);
            localStorage.setItem(LOCATIONS, JSON.stringify(updatedLocations));
        }
    }

    removeLocation(zipcode: string) {
        // Filtre la liste des localisations pour supprimer le zipcode spécifié et notifie les abonnés.
        const updatedLocations = this.locationsSubject.value.filter(z => z !== zipcode);
        this.locationsSubject.next(updatedLocations);
        localStorage.setItem(LOCATIONS, JSON.stringify(updatedLocations));
    }
}
