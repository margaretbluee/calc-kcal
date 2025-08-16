import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APP_STATES } from 'src/app/models/appStates.model';
import { AppStatesService } from 'src/app/services/app-states.service';
import { BmiCalculationService } from 'src/app/services/bmi-calculation.service';
import { IUserInfo, StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-bmi-calculator-screen',
  templateUrl: './bmi-calculator-screen.component.html',
  styleUrls: ['./bmi-calculator-screen.component.scss']
})
export class BmiCalculatorScreenComponent implements OnInit {
  bmiForm: FormGroup;
  bmi: number | null = null;
  category: string = '';
  storedData?: IUserInfo = undefined;
  constructor(
    private _formBuilder: FormBuilder, 
    private _bmiService: BmiCalculationService,
    private _appStateService: AppStatesService,
    private _store: StoreService
  ) {
this.bmiForm = this._formBuilder.group({
  gender: ['male', Validators.required],
  age: ['', [Validators.required, Validators.min(1), Validators.max(100)]],       // max 100
  height: ['', [Validators.required, Validators.min(50), Validators.max(300)]],    // max 300 cm
  weight: ['', [Validators.required, Validators.min(10), Validators.max(300)]]     // max 300 kg
});

  }

ngOnInit(): void {
  this.storedData = this._store.getUserInfo(); // or however your service exposes it
  console.log("storedData", this.storedData);
  if (this.storedData) {
    this.bmiForm.patchValue({
      gender: this.storedData.gender || 'male',
      age: this.storedData.age || '',
      height: this.storedData.height || '',
      weight: this.storedData.weight || ''
    });
    this.calculateBMI();
  }
}

  calculateBMI() {
    if (this.bmiForm.valid) {
      const { height, weight, gender, age } = this.bmiForm.value;
      const result = this._bmiService.calculateBMI(height, weight, gender, age);
      this.bmi = result.bmi;
      this.category = result.category;
      this._store.setAge(age);
      this._store.setGender(gender);
      this._store.setHeight(height);
      this._store.setWeight(weight) ;
      this._store.serUserInfo(this.bmiForm.value);
      console.log("userInfo object is stored in memeory", this._store.getUserInfo());
          console.log(this._store.getGender(),this._store.getAge(),this._store.getWeight(),this._store.getHeight());

    }
  }

  navigate(){
    this._appStateService.currentState(APP_STATES.EXERSICE);
  }
}