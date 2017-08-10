import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import * as $ from 'jquery';

import { AppComponent } from './app.component';
import { CountryDetailsComponent } from './countries/country-details/country-details.component';
import { CountryListComponent } from './countries/country-list/country-list.component';

@NgModule({
  declarations: [
    AppComponent,
    CountryDetailsComponent,
    CountryListComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
