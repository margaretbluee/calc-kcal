import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { APP_STATES } from 'src/app/models/appStates.model';
import { AppStatesService } from 'src/app/services/app-states.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'login',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.scss'],
})
export class LoginScreenComponent {
  CLASSNAME: string = 'LoginScreenComponent';
  email: string = '';
  password: string = '';
  loginForm!: FormGroup;
  loading: boolean = false; //loading spinner status
  register: boolean = false;

  constructor(
    private _loadingService: LoadingService,
    private _authService: AuthService,
    private _router: Router,
    private readonly _appStatesService: AppStatesService
  ) { }

  ngOnInit() {
    console.log("this.register", this.register);
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });

  }

toggleRegister(): void {
  this.register = !this.register;
}

submitRegister(): void {
  if (this.loginForm.valid) {
    this.loading = true;
    const user = this.loginForm.value;

    // Simulate API call
    console.log("Registering user", user);
    setTimeout(() => {
      this.loading = false;
      alert('Registered successfully!');
      this.toggleRegister(); // Switch back to login
      this.loginForm.reset();
    }, 1000);
  }
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



 
