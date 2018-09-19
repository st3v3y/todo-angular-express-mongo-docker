import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Globals } from '../helpers/globals';
import { UserLogin, UserRegister } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string;

  constructor(private http: HttpClient, private globals: Globals) {
    this.baseUrl = globals.baseWebApiUrl + 'user';
  }

  register(user: UserRegister): any {
    return this.http.post(`${this.baseUrl}/register`, user);
  }
}
