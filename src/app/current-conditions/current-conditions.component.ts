import {AfterViewInit, ChangeDetectorRef, Component, inject, TemplateRef, ViewChild} from '@angular/core';
import {WeatherService} from "../weather.service";
import {LocationService} from "../location.service";
import {Router} from "@angular/router";
import {ConditionsAndZip} from '../conditions-and-zip.type';
import {TabsComponent} from "../tabs/tabs.component";

@Component({
    selector: 'app-current-conditions',
    templateUrl: './current-conditions.component.html',
    styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent implements AfterViewInit {

    private weatherService = inject(WeatherService);
    private router = inject(Router);
    protected locationService = inject(LocationService);
    protected currentConditionsByZip: ConditionsAndZip[] = [];

    @ViewChild(TabsComponent) tabsComponent!: TabsComponent;
    @ViewChild('tabContent') tabContentRef: TemplateRef<any>;

    constructor(private cd: ChangeDetectorRef) {

    }

    ngAfterViewInit(): void {
        this.weatherService.currentConditionsByZip$.subscribe(locations => {
            this.currentConditionsByZip = locations;
            if (this.currentConditionsByZip.length > 0) {
                // Convertir les localisations en onglets
                this.currentConditionsByZip.map((location: any) => {
                    if (location) {
                        this.addLocationTab(location);
                    }
                });
            }
        });

        // Déclencher manuellement la détection des changements
        this.cd.detectChanges();
    }

    // Méthode pour ajouter un onglet de localisation
    addLocationTab(location: any) {
        if (location && this.tabsComponent) {
            this.tabsComponent.addTab(
                `${location.data.name} (${location.zip})`,
                location.zip,
                this.tabContentRef,
                {...location.data, zipCode: location.zip}
            );
        }
    }

    showForecast(zipcode: string) {
        this.router.navigate(['/forecast', zipcode])
    }
}
