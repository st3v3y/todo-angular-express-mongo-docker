import {Injectable} from '@angular/core';
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

  getLoggedIn() {
    return this.http.get(`${this.baseUrl}/loggedin`);
  }

  login(user: UserLogin): any {
    // return this.http.post(`http://localhost:3022/login`, user);
    return this.http.post(`http://localhost:3022/login`, 'username=' + user.email + '&password=' + user.password);
  }

  register(user: UserRegister): any {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  logout(): any {
    return this.http.get(`${this.baseUrl}`);
  }
}
