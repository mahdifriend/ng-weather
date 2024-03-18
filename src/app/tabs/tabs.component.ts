import {Component, inject} from '@angular/core';
import {LocationService} from "../location.service";
import {WeatherService} from "../weather.service";

interface Tab {
    title: string;
    zipCode: string;
    content: any; // Ce sera un TemplateRef ou tout autre contenu
    active: boolean;
    locationData?: any;
}

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.css']
})
export class TabsComponent {
    tabs: Tab[] = [];
    activeTabIndex: number | null = null;
    protected locationService = inject(LocationService);
    protected weatherService = inject(WeatherService);

    addTab(title: string, zipCode: string, content: any, locationData: any): void {
        // Check if an object with the same zip property exists
        var zipExists = this.tabs.some(obj => obj.zipCode === zipCode);
        // If zip doesn't exist, push the object into the array
        if (!zipExists) {
            this.tabs.push({title, zipCode, content, active: false, locationData});
            if (this.activeTabIndex === null) {
                this.selectTab(this.tabs.length - 1);
            }
        }
    }

    selectTab(index: number): void {
        console.log('selectTab', {activeTabIndex: this.activeTabIndex, index: index, tabs: this.tabs})

        if (this.activeTabIndex !== null && this.tabs[this.activeTabIndex]) {
            this.tabs[this.activeTabIndex].active = false;
        }
        this.tabs[index].active = true;
        this.activeTabIndex = index;
    }

    removeTab(index: number): void {
        let zipcode = this.tabs[index].zipCode;

        if (zipcode) {
            this.weatherService.removeCurrentConditions(zipcode);
            this.weatherService.removeForecast(zipcode);
            this.locationService.removeLocation(zipcode);
            this.tabs.splice(index, 1);

            if (this.tabs[index]) {
                this.tabs[index].active = false;
            }

            if (this.tabs.length > 0 && index === this.activeTabIndex) {
                this.selectTab(0);
            } else if (this.tabs.length > 0 && index !== this.activeTabIndex) {
                this.selectTab(this.activeTabIndex);
            } else {
                this.activeTabIndex = null;
            }
        }
    }

}
