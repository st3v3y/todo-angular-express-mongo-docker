import { Component, OnInit } from '@angular/core';
import { TaskService } from './services/task.service';
import { HttpResponse } from '@angular/common/http';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Todo App';
  user: any;

  constructor() {
    this.user = JSON.parse(localStorage.getItem('profile'));

    console.log(this.user);
  }

}

