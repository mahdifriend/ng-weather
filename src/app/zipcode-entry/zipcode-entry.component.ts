import {Component, inject, OnInit} from '@angular/core';
import {LocationService} from "../location.service";
import {WeatherService} from "../weather.service";

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent implements OnInit{

  private weatherService = inject(WeatherService);
  protected error: any = '';

  constructor(private service : LocationService) { }

  ngOnInit(): void {
    this.weatherService.errorsHandler$.subscribe(error => {
      this.error = error;
    })
  }

  addLocation(zipcode : string){
    this.service.addLocation(zipcode);
  }

}
