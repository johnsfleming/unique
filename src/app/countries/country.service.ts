import { Injectable } from '@angular/core';
import { Country } from './country';
import { Query } from './country';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CountryService {
  	private countryUrl = '/api/factbook';
  	private worldUrl = '/api/earth';

  	constructor (private http: Http) {}

	// get("/api/country")
	getCountries(): Promise<void | Country[]> {
	  return this.http.get(this.countryUrl)
	             .toPromise()
	             .then(response => response.json() as Country[])
	             .catch(this.handleError);
	}

	//get("/api/earth")
	getEarth(): Promise<void | Country> {
	  return this.http.get(this.worldUrl)
	             .toPromise()
	             .then(response => response.json() as Country)
	             .catch(this.handleError);
	}

	private handleError (error: any) {
      let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }

}

@Injectable()
export class QueryService {
  	private queryUrl = '/api/query';

  	constructor (private http: Http) {}

	//get("/api/query/params")
	getQuery(getQuery: Query): Promise<void | Query> {
	  var countryParam = '/' + getQuery.country;
	  var ageParam = '/' + getQuery.age;
	  var genderParam = '/' + getQuery.gender;
	  var religionParam = '/' + getQuery.religion;
	  var ethnicityParam = '/' + getQuery.ethnicity;
	  var getUrl = this.queryUrl + countryParam + ageParam + genderParam + religionParam + ethnicityParam;
	  return this.http.get(getUrl)
	             .toPromise()
	             .then(response => response.json() as Query)
	             .catch(this.handleError);
	}

	// post("/api/query/create")
    createQuery(newQuery: Query): Promise<void | Query> {
      return this.http.post(this.queryUrl+'/create', newQuery)
                 .toPromise()
                 .then(response => response.json() as Query)
                 .catch(this.handleError);
    }

    // put("/api/query/update/params")
    updateQuery(putQuery: Query): Promise<void | Query> {
      var countryParam = '/' + putQuery.country;
	  var ageParam = '/' + putQuery.age;
	  var genderParam = '/' + putQuery.gender;
	  var religionParam = '/' + putQuery.religion;
	  var ethnicityParam = '/' + putQuery.ethnicity;
	  var putUrl = this.queryUrl + '/update' + countryParam + ageParam + genderParam + religionParam + ethnicityParam;
      return this.http.put(putUrl, putQuery)
                 .toPromise()
                 .then(response => response.json() as Query)
                 .catch(this.handleError);
    }

	private handleError (error: any) {
      let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      console.error(errMsg); // log to console instead
    }

}
