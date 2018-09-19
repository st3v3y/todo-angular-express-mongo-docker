import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Globals } from '../helpers/globals';
import { UserLogin } from '../models/user';

@Injectable()
export class AuthenticationService {
    private baseUrl: string;

    constructor(private http: HttpClient, private globals: Globals) {
        this.baseUrl = globals.baseWebApiUrl + 'auth';
    }

    login(userData: UserLogin) {
        return this.http.post<any>(`${this.baseUrl}/login`, userData)
            .pipe(map(data => {
                if (data && data.access_token && data.user) {
                    const token = {
                        access_token : data.access_token,
                        expires_in : data.expires_in,
                        refresh_token : data.refresh_token,
                        scope: data.scope,
                        token_type: data.token_type
                    };

                    localStorage.setItem('token', JSON.stringify(token));
                    localStorage.setItem('profile', JSON.stringify(data.user));
                    // localStorage.setItem('userToken', JSON.stringify(data.userToken));
                }
                return data;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('token');
        localStorage.removeItem('profile');
        // localStorage.removeItem('userToken');
    }
}
