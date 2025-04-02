import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_STATES } from 'src/app/models/appStates.model';
import { User } from 'src/app/models/user';
import { AppStatesService } from 'src/app/services/app-states.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  CLASSNAME: string = 'LoginComponent';
  email: string = '';
  password: string = '';
  loginForm!: FormGroup;
  loading: boolean = false; //loading spinner status

  constructor(
    private _loadingService: LoadingService,
    private _authService: AuthService,
    private _router: Router,
    private readonly _appStatesService: AppStatesService
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  // onLogin() {
  //   //checks if the login form is valid before proceeding
  //   if (this.loginForm.valid) {
  //     this._loadingService.show(); // loading state -> true
  //     const user: User = this.loginForm.value; // authentication logic ( call the authService)

  //     this._authService.login(user).subscribe({
  //       next: (data) => {
  //        console.log(this.CLASSNAME, "onLogin", "success")

  //         this._loadingService.hide(); //reset loading state
  //         console.log('Response from server:', data);
  //         // if (data.message === 'Login successful') {
  //         this._router.navigate(['/dashboard']);
  //         // } else {
  //       },
  //       error: (error) => {
  //         alert(error);
  //       },
  //     });
  //   }
  //   this.loginForm.reset();
  // }

  onLogin() {
    console.log(this.CLASSNAME, "onLogin", "success")
    this._appStatesService.currentState(APP_STATES.BMI_CALCULATION);
  }
}
