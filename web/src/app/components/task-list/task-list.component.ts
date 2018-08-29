import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks;
  _taskService: TaskService;
  isCreateNewMode: boolean;
  filter: any;

  constructor(private taskService: TaskService) {
    this._taskService = taskService;
  }

  ngOnInit() {
    this.getTasks();
    this.filter = { isDeleted: false };
  }

  getTasks() {
    this._taskService.getTasks()
    .subscribe(
      data => { this.tasks = data; },
      err => console.error(err),
      () => console.log('done loading tasks')
    );
  }

  changeTask(task) {
    this._taskService.updateTask(task, task._id).subscribe(
      (data) => console.log(data),
      err => console.error(err),
      () => console.log('done updating task')
    );
  }

  deleteTask(task) {
    task.isDeleted = true;
    this._taskService.deleteTask(task._id).subscribe(
      (data) => console.log(data),
      err => console.error(err),
      () => console.log('done deleting task')
    );
  }

  createTask(taskName) {
    const task = { name: taskName };
    this._taskService.addTask(task).subscribe(
      (data) => { console.log(data); this.getTasks();  },
      err => console.error(err),
      () => console.log('done adding task')
    );
  }

  setFilterCompletedOnly() {
    if (this.filter.isCompleted === undefined) {
      this.filter.isCompleted = true;
    } else {
      this.filter.isCompleted = undefined;
    }
  }
  setFilterPendingOnly() {
    if (this.filter.isCompleted === undefined) {
      this.filter.isCompleted = false;
    } else {
      this.filter.isCompleted = undefined;
    }
  }
}
