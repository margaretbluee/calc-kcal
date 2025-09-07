import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { APP_STATES } from 'src/app/models/appStates.model';
import { AppStatesService } from 'src/app/services/app-states.service';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { StoreService } from 'src/app/services/store.service';

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
  registerForm!: FormGroup;
  loading: boolean = false; //loading spinner status
  register: boolean = false;
  alertMessage: string = '';
  alertStatus: 'info' | 'warning' | 'error' = 'info';
  alertDuration: number = 4000;
  showAlert: boolean = false;
  currentLang?: string;
  constructor(
    private _loadingService: LoadingService,
    private _authService: AuthService,
    private _router: Router,
    private readonly _appStatesService: AppStatesService,
    private _storeService: StoreService,
    private _translationService: TranslateService
  ) {}

  ngOnInit() {
    this.currentLang = this._translationService.currentLang || 'en'; // fallback to 'en' if undefined

    this._translationService.onLangChange.subscribe((data) => {
      this.currentLang = data.lang;
    });
    console.log('this.register', this.register);
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
    this.registerForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  closeAlert() {
    this.showAlert = false;
  }

  toggleRegister(): void {
    this.register = !this.register;
  }

  submitRegister(): void {
    if (this.registerForm.valid) {
      this.loading = true;
              const payload = {
    email: this.registerForm.value.email,
    encryptedPassword: this.registerForm.value.password
  };
 

      this._authService.register(payload).subscribe({
        next: (res) => {
          this.loading = false;
          this.alertMessage =
            this.currentLang === 'el'
              ? `Η εγγραφή σας ολοκληρώθηκε`
              : 'Registration was successfull';
          this.alertStatus = 'info';
          this.alertDuration = 4000;
          this.showAlert = true;
          this.loginForm.patchValue({
  email: this.registerForm.value.email,
  password: this.registerForm.value.password
});
          this.toggleRegister();
          
        },
        error: (err) => {
          this.loading = false;
          this.alertMessage =
            this.currentLang === 'el'
              ? `Η εγγραφή απέτυχε`
              : 'Registration failed';
          this.alertStatus = 'error';
          this.alertDuration = 4000;
          this.showAlert = true;
        },
      });
    }  else {
      this.alertMessage =
        this.currentLang === 'el'
          ? `Παρακαλώ συμπληρώστε τα στοιχεία σας`
          : 'Please fill the registration form';
      this.alertStatus = 'warning';
      this.alertDuration = 4000;
      this.showAlert = true;
    }
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.loading = true;
        const payload = {
    email: this.loginForm.value.email,
    password: this.loginForm.value.password
  };
  console.log("sending request with data", "login payload", payload);
      this._authService.login(payload).subscribe({
        next: (res) => {
 
          this.loading = false;
          this.alertMessage =
            this.currentLang === 'el' ? `Καλως ορίσατε` : 'Welcome';
          this.alertStatus = 'info';
          this.alertDuration = 4000;
          this.showAlert = true;
          // save role in store
          this._storeService.setRole(res.role);

          if (res.role === 'admin') {
            this._appStatesService.currentState(APP_STATES.FILTERED_RESULTS);
          } else {
            this._appStatesService.currentState(APP_STATES.BMI_CALCULATION);
          }
        },
        error: (err) => {
          console.log("H συνδεση απετυχε");
          this.loading = false;
          this.alertMessage =
                  this.currentLang === 'el'
          ? 'H σύνδεση απέτυχε'
          : 'Login failed';
      this.alertStatus = 'error';
      this.alertDuration = 4000;
      this.showAlert = true;
        },
      });
    } else {
      this.alertMessage =
        this.currentLang === 'el'
          ? `Παρακαλώ συμπληρώστε τα στοιχεία σας`
          : 'Please fill the login form';
      this.alertStatus = 'warning';
      this.alertDuration = 4000;
      this.showAlert = true;
    }
  }

  // bypass login/register
  bypassLogin(): void {
  
    this._storeService.setRole('sUser');
    this._appStatesService.currentState(APP_STATES.SUPERMARKETS_OF_PREFERENCE);
  }
}
