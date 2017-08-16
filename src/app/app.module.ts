import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CountoModule} from 'angular2-counto';

import { AppComponent } from './app.component';
import { CountryDetailsComponent } from './countries/country-details/country-details.component';
import { CountryListComponent, ObjNgFor } from './countries/country-list/country-list.component';

@NgModule({
  declarations: [
    AppComponent,
    CountryDetailsComponent,
    CountryListComponent,
    ObjNgFor
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    CountoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
