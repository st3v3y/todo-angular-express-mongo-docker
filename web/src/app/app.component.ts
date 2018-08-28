import { Component, OnInit } from '@angular/core';
import { TaskService } from './services/task.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'todoapp';
  tasks;
  _taskService: any;

  constructor(private taskService: TaskService) {
    this._taskService = taskService;
  }

  ngOnInit() {
    this.getTasks();
  }

  getTasks() {
    this._taskService.getTasks()
    .subscribe(
      data => { this.tasks = data; },
      err => console.error(err),
      () => console.log('done loading foods')
    );
  }
}

