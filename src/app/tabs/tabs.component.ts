import {AfterContentInit, Component, ContentChildren, EventEmitter, Output, QueryList} from '@angular/core';
import {TabComponent} from "./tab/tab.component";

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements AfterContentInit {
    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
    @Output() removeTabEvent = new EventEmitter<number>();

    ngAfterContentInit() {
        const activeTabs = this.tabs.filter(tab => tab.isActive);
        if (activeTabs.length === 0) {
            this.selectTab(0);
        }
    }

    selectTab(index: number) {
        this.tabs.toArray().forEach((tab, i) => tab.isActive = i === index);
    }

    removeTab(index: number) {
        const tabArray = this.tabs.toArray();
        tabArray.splice(index, 1);
        this.tabs.reset(tabArray);
        if (tabArray.length > 0 && !tabArray.some(tab => tab.isActive)) {
            this.selectTab(0);
        }

        this.removeTabEvent.emit(index);
    }
}
