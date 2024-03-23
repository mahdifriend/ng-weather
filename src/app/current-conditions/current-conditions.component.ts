import {
    ChangeDetectorRef,
    Component,
    inject, OnInit
} from '@angular/core';
import {WeatherService} from "../weather.service";
import {LocationService} from "../location.service";
import {Router} from "@angular/router";
import {ConditionsAndZip} from '../conditions-and-zip.type';

@Component({
    selector: 'app-current-conditions',
    templateUrl: './current-conditions.component.html',
    styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent implements OnInit {

    active: boolean = false;
    private router = inject(Router);
    protected locationService = inject(LocationService);
    protected weatherService = inject(WeatherService);
    protected currentConditionsByZip: ConditionsAndZip[] = [];

    constructor(private cd: ChangeDetectorRef) {

    }

    ngOnInit(): void {
        this.weatherService.currentConditionsByZip$.subscribe(locations => {
            if (locations.length > 0) {
                locations.map((location: ConditionsAndZip, index) => {
                    // Check if an object with the same zip property exists
                    var zipExists = this.currentConditionsByZip.some(obj => obj.zip === location.zip);
                    // If zip doesn't exist, push the object into the array
                    if (!zipExists) {
                        this.currentConditionsByZip.push(location);
                    }
                });
                this.active = true;
            }
            // Déclencher manuellement la détection des changements
            this.cd.detectChanges();
        });
    }

    showForecast(zipcode: string) {
        this.router.navigate(['/forecast', zipcode])
    }


    handleRemoveTab(index) {
        let selectedTab = this.currentConditionsByZip[index] || null;
        if (selectedTab && selectedTab.zip) {
            this.weatherService.removeCurrentConditions(selectedTab.zip);
            this.weatherService.removeForecast(selectedTab.zip);
            this.locationService.removeLocation(selectedTab.zip);
            this.currentConditionsByZip.splice(index, 1);
        }
    }
}
