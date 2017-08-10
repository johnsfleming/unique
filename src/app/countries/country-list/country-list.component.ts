import { Component, OnInit } from '@angular/core';
import { Country } from '../country';
import { CountryService } from '../country.service';
import { CountryDetailsComponent } from '../country-details/country-details.component';

@Component({
  selector: 'country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css'],
  providers: [CountryService]
})
export class CountryListComponent implements OnInit {

  countries: Country[]
  selectedCountry: Country
  world: Country
  demographic: number
  demographicString: string

  constructor(private countryService: CountryService) { }

  ngOnInit() {
     this.countryService
      .getCountries()
      .then((countries: Country[]) => {
        this.countries = countries.map((country) => {
          return country;
        });
        this.countries.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} ); 

      });

     this.countryService
      .getEarth()
      .then((world: Country) => {
        this.countries.unshift(world);
        this.demographic = world.population;
      });

      
  }

  private getIndexOfCountry = (countryId: String) => {
    return this.countries.findIndex((country) => {
      return country._id === countryId;
    });
  }

  demographicToString(demographic: number){
    return demographic.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  selectCountry(country: Country) {
    this.selectedCountry = country;
    this.demographic = this.selectedCountry.population;
    this.demographicString = this.demographic.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
