import { Component, OnInit, Input } from '@angular/core';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks;
  _taskService: TaskService;

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
      () => console.log('done loading tasks')
    );
  }

  checkedTask(event, task) {
    // task.isCompleted = !task.isCompleted;

    this._taskService.updateTask(task, task._id).subscribe(
      (data) => console.log(data),
      err => console.error(err),
      () => console.log('done updating task')
    );

  }
}
