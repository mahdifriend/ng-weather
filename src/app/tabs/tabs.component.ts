import {Component, EventEmitter, Output} from '@angular/core';

interface Tab {
    title: string;
    zipCode: string;
    content: any; // Ce sera un TemplateRef ou tout autre contenu
    active: boolean;
    data?: any;
}

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.css']
})
export class TabsComponent {
    tabs: Tab[] = [];
    activeTabIndex: number | null = null;
    @Output() removeTabEvent = new EventEmitter<string>();

    addTab(title: string, zipCode: string, content: any, data: any): void {
        // Check if an object with the same zip property exists
        var zipExists = this.tabs.some(obj => obj.zipCode === zipCode);
        // If zip doesn't exist, push the object into the array
        if (!zipExists) {
            this.tabs.push({title, zipCode, content, active: false, data});
            if (this.activeTabIndex === null) {
                this.selectTab(this.tabs.length - 1);
            }
        }
    }

    selectTab(index: number): void {
        if (this.activeTabIndex !== null && this.tabs[this.activeTabIndex]) {
            this.tabs[this.activeTabIndex].active = false;
        }
        this.tabs[index].active = true;
        this.activeTabIndex = index;
    }

    removeTab(index: number): void {
        let zipcode = this.tabs[index].zipCode;

        if (zipcode) {
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

            this.removeTabEvent.emit(zipcode);
        }
    }

}
