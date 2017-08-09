import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
