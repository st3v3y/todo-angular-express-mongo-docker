import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule, MatMenuModule, MatIconModule, MatButtonModule,
        MatCheckboxModule, MatListModule, MatCardModule} from '@angular/material';
import { TaskService } from './services/task.service';
import { Globals } from './helpers/globals';
import { HttpClientModule } from '@angular/common/http';
import { TaskListComponent } from './components/task-list/task-list.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    [BrowserAnimationsModule],
    [MatCardModule, MatListModule, MatToolbarModule, MatMenuModule, MatIconModule, MatButtonModule, MatCheckboxModule]
  ],
  providers: [TaskService, Globals],
  bootstrap: [AppComponent]
})
export class AppModule { }
