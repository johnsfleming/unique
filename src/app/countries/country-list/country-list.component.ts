import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Country } from '../country';
import { CountryService } from '../country.service';
import { CountryDetailsComponent } from '../country-details/country-details.component';

@Pipe({ name: 'ObjNgFor',  pure: false })
export class ObjNgFor implements PipeTransform {
    transform(value: any, args: any[] = null): any {
      let keys = [];
      for (let key in value) {
          keys.push({key: key, value: value[key]});
      }
      return keys;
    }
}

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
  previousdemographic: number
  selectedAgeRange: string
  genderRatio: number
  gender: string
  selectedReligion: string
  selectedEthnicGroup: string
  isDataAvailable: boolean = false;

  constructor(private countryService: CountryService) { }

  ngOnInit() {
     this.countryService
      .getCountries()
      .then((countries: Country[]) => {
        this.countries = countries.map((country) => {
          return country;
        });
        this.countries.sort(function(a,b) {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);} ); 
        this.isDataAvailable = true;
      });

     this.countryService
      .getEarth()
      .then((world: Country) => {
        this.world = world;
        this.selectedCountry = this.world;
        this.previousdemographic = 0;
        this.demographic = this.selectedCountry.population;
        this.selectedAgeRange = "Leave blank";
        this.selectedReligion = "Leave blank";
        this.selectedEthnicGroup = "Leave blank";
        this.genderRatio = 1;
        this.gender = "Leave blank";
      });
  }

  countryChange(){
    if(!(this.selectedReligion in this.selectedCountry['religions'])){
      this.selectedReligion = "Leave blank";
    }
    if(!(this.selectedEthnicGroup in this.selectedCountry['ethnicGroups'])){
      this.selectedEthnicGroup = "Leave blank";
    }
    this.onChange();
  }

  onChange(){
    var pop = this.selectedCountry.population;
    pop = pop*this.selectedCountry.age[this.selectedAgeRange]/100;
    if(this.gender=="Leave blank"){
      this.genderRatio = 1;
    }
    else if(this.gender=="Male"){
      this.genderRatio = (this.selectedCountry['gender'][this.selectedAgeRange])/2;
    }
    else{
      this.genderRatio = (1/this.selectedCountry['gender'][this.selectedAgeRange])/2;
    }
    pop = pop*this.genderRatio;
    pop = pop*this.selectedCountry.religions[this.selectedReligion]/100;
    pop = pop*this.selectedCountry.ethnicGroups[this.selectedEthnicGroup]/100;
    this.previousdemographic = this.demographic;
    this.demographic = Math.round(pop);
  }

  identify(index,item){
    return item.key;
  }
}