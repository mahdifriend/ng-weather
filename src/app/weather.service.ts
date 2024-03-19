import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';

import {HttpClient} from '@angular/common/http';
import {CurrentConditions} from './current-conditions/current-conditions.type';
import {ConditionsAndZip} from './conditions-and-zip.type';
import {Forecast} from './forecasts-list/forecast.type';
import {LocationService} from "./location.service";
import {CacheService} from "./cache.service";
import {tap} from "rxjs/operators";

@Injectable()
export class WeatherService {

    static URL = 'https://api.openweathermap.org/data/2.5';
    static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
    static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
    private currentConditionsSubject = new BehaviorSubject<ConditionsAndZip[]>([]);
    currentConditionsByZip$ = this.currentConditionsSubject.asObservable();
    private errorsHandler = new BehaviorSubject<string>('');
    errorsHandler$ = this.errorsHandler.asObservable();

    constructor(
        private http: HttpClient,
        private locationService: LocationService,
        private cacheService: CacheService) {
        // S'abonner aux mises à jour des localisations.
        this.locationService.locations$.subscribe(
            locations => {
                // Logique pour traiter les nouvelles localisations, par exemple, appeler une API météo.
                for (let loc of locations) {
                    if (loc) {
                        this.addCurrentConditions(loc);
                    }
                }
            }
        );
    }

    addCurrentConditions(zipcode: string): void {
        // Here we make a request to get the current conditions data from the API. Note the use of backticks and an expression to insert the zipcode
        const cacheKey = `current-conditions-${zipcode}`;
        const cachedData = this.cacheService.getFromCache(cacheKey);
        if (cachedData) {
            const newConditions = [...this.currentConditionsSubject.getValue(), {zip: zipcode, data: cachedData}];
            this.currentConditionsSubject.next(newConditions);
        } else {
            this.errorsHandler.next('');
            this.http.get<CurrentConditions>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
                .subscribe(data => {
                    const newConditions = [...this.currentConditionsSubject.getValue(), {zip: zipcode, data}];
                    this.currentConditionsSubject.next(newConditions);
                    this.cacheService.saveToCache(cacheKey, data)
                }, error => {
                    if (error.error.message) {
                        this.errorsHandler.next(error.error.message)
                    }
                    this.locationService.removeLocation(zipcode);
                });
        }
    }

    removeCurrentConditions(zipcode: string) {
        const newConditions = this.currentConditionsSubject.getValue();
        for (let i in newConditions) {
            if (newConditions[i].zip == zipcode)
                newConditions.splice(+i, 1);
        }
        this.currentConditionsSubject.next(newConditions);
        this.cacheService.removeFromCache(`current-conditions-${zipcode}`);
    }

    removeForecast(zipcode: string) {
        this.cacheService.removeFromCache(`forecast-${zipcode}`);
    }

    getForecast(zipcode: string): Observable<Forecast> {
        // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
        const cacheKey = `forecast-${zipcode}`;
        const cachedData = this.cacheService.getFromCache(cacheKey);
        if (cachedData) {
            return of(cachedData);
        } else {
            return this.http
                .get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`)
                .pipe(
                    tap(data => this.cacheService.saveToCache(cacheKey, data))
                );
        }
    }

    getWeatherIcon(id): string {
        if (id >= 200 && id <= 232)
            return WeatherService.ICON_URL + "art_storm.png";
        else if (id >= 501 && id <= 511)
            return WeatherService.ICON_URL + "art_rain.png";
        else if (id === 500 || (id >= 520 && id <= 531))
            return WeatherService.ICON_URL + "art_light_rain.png";
        else if (id >= 600 && id <= 622)
            return WeatherService.ICON_URL + "art_snow.png";
        else if (id >= 801 && id <= 804)
            return WeatherService.ICON_URL + "art_clouds.png";
        else if (id === 741 || id === 761)
            return WeatherService.ICON_URL + "art_fog.png";
        else
            return WeatherService.ICON_URL + "art_clear.png";
    }

    // Fonction pour obtenir les conditions actuelles avec la mise en cache
    getCurrentConditions(zip: string): Observable<any> {
        const cacheKey = `current-conditions-${zip}`;
        const cachedData = this.cacheService.getFromCache(cacheKey);
        if (cachedData) {
            return of(cachedData); // RxJS 'of' to return an observable
        } else {
            return this.http.get(`/api/current-conditions/${zip}`).pipe(
                tap(data => this.cacheService.saveToCache(cacheKey, data))
            );
        }
    }
}
