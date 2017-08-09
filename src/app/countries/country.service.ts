import { Injectable } from '@angular/core';
import { Country } from './country';
import { World } from './country';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CountryService {
  	private countryUrl = '/api/factbook';
  	private worldUrl = '/';

  	constructor (private http: Http) {}

	// get("/api/country")
	getCountries(): Promise<void | Country[]> {
	  return this.http.get(this.countryUrl)
	             .toPromise()
	             .then(response => response.json() as Country[])
	             .catch(this.handleError);
	}

	//get ("/")
	getWorld(): Promise<void | World[]> {
	  return this.http.get(this.worldUrl)
	  			 .toPromise()
	  			 .then(response => response.json as World[])
	  			 .catch(this.handleError);
	}

	private handleError (error: any) {
      let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }

}
