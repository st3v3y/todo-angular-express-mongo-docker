import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Globals } from '../helpers/globals';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl: string;

  constructor(private http: HttpClient, private globals: Globals) {
    this.baseUrl = globals.baseWebApiUrl + 'tasks';
  }

  getTasks() {
    return this.http.get(`${this.baseUrl}`);
   }

  getTask(id: string): any {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  addTask(task: Task): any {
    return this.http.post(this.baseUrl, task);
  }

  updateTask(task: Task, id: number) {
    // const body = new URLSearchParams();
    // body.set('status', task.status);
    // const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    // return this.http.put(`${this.baseUrl}/${id}`, body.toString(), { headers, observe: 'response' });
    return this.http.put(`${this.baseUrl}/${id}`, task);
  }

  deleteTask(id: string): any {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
