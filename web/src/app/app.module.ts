import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule, MatMenuModule, MatIconModule, MatButtonModule,
        MatCheckboxModule, MatListModule, MatCardModule} from '@angular/material';
import { TaskService } from './services/task.service';
import { Globals } from './helpers/globals';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    [BrowserAnimationsModule],
    [MatCardModule, MatListModule, MatToolbarModule, MatMenuModule, MatIconModule, MatButtonModule, MatCheckboxModule]
  ],
  providers: [TaskService, Globals],
  bootstrap: [AppComponent]
})
export class AppModule { }
