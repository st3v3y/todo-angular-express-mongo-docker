import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule, MatMenuModule, MatIconModule, MatButtonModule,
        MatCheckboxModule, MatListModule, MatCardModule, MatInputModule,
        MatProgressSpinnerModule, MatTooltipModule} from '@angular/material';
import { TaskService } from './services/task.service';
import { Globals } from './helpers/globals';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TaskListComponent } from './components/task-list/task-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskFilterPipe } from './pipes/task-filter.pipe';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './helpers/auth.guard';
import { UserService } from './services/user.service';
import { AlertService } from './services/alert.service';
import { AlertComponent } from './components/alert/alert.component';
import { RegisterComponent } from './components/register/register.component';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { OAuthInterceptor } from './interceptors/oauth.interceptor';
import { AuthenticationService } from './services/authentication.service';

const appRoutes: Routes = [
  { path: '', component: TaskListComponent, canActivate : [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    LoginComponent,
    AlertComponent,
    RegisterComponent,
    TaskFilterPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    [BrowserAnimationsModule],
    [MatCardModule, MatListModule, MatToolbarModule, MatMenuModule, MatIconModule,
     MatButtonModule, MatCheckboxModule, MatInputModule, MatProgressSpinnerModule, MatTooltipModule]
  ],
  providers: [
    TaskService,
    UserService,
    AlertService,
    AuthenticationService,
    Globals,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: OAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
