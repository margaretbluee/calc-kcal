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

  constructor(private _http: HttpClient) { }

  login(user: User): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    //this method makes an HTTP POST request
    return this._http.get<any>(this._apiUrl).pipe(
      tap((response) => {
        // checks if the response contains a token
        // if (response.token) {
        this._loggedIn.next(true); //updates the logged-in status,
        //   localStorage.setItem('authToken', response.token); // Store the token
        // }
      }),
      catchError((error) => {
        console.error('Login error', error);
        return throwError('Login failed: Invalid email or password.', error);
        // return of(null);
      })
    );
  }

  logout() {
    this._loggedIn.next(false);
  }

  isLoggedIn() {
    return this._loggedIn.getValue();
  }
}
