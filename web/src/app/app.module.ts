import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule, MatMenuModule, MatIconModule, MatButtonModule,
        MatCheckboxModule, MatListModule, MatCardModule} from '@angular/material';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    [BrowserAnimationsModule],
    [MatCardModule, MatListModule, MatToolbarModule, MatMenuModule, MatIconModule, MatButtonModule, MatCheckboxModule]
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
