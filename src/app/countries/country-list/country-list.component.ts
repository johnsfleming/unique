import { Component, OnInit } from '@angular/core';
import { Country } from '../country';
import { World } from '../country';
import { CountryService } from '../country.service';
import { CountryDetailsComponent } from '../country-details/country-details.component';

@Component({
  selector: 'country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css'],
  providers: [CountryService]
})
export class CountryListComponent implements OnInit {

  world: World[]
  countries: Country[]
  selectedCountry: Country

  constructor(private countryService: CountryService) { }

  ngOnInit() {
     this.countryService
      .getCountries()
      .then((countries: Country[]) => {
        this.countries = countries.map((country) => {
          return country;
        });
      });

     this.countryService
     .getWorld()
     .then((world: World[]) => {
       this.world = world.map((world) => {
         return world;
       });
     });

  }

  private getIndexOfCountry = (countryId: String) => {
    return this.countries.findIndex((country) => {
      return country._id === countryId;
    });
  }

  selectCountry(country: Country) {
    this.selectedCountry = country
  }
}
