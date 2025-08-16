import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //login state can only be changed through the defined methods
  private _loggedIn = new BehaviorSubject<boolean>(false);
  //public objerv->components subscribe the state without being able to change it
  loggedIn = this._loggedIn.asObservable();

  private _apiUrl = 'http://localhost:5000/api/users';
  // private _jsonUrl = '/assets/data/users.json';

  constructor(private  http: HttpClient) { }
 private apiUrl = 'http://localhost:5000/api/users'; // adjust to your backend

 
 
  register(user: { email: string; encryptedPassword: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

login(user: { email: string; password: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, user);
}

  logout() {
    this._loggedIn.next(false);
  }

  isLoggedIn() {
    return this._loggedIn.getValue();
  }
}
