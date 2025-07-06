import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APP_STATES } from 'src/app/models/appStates.model';
import { AppStatesService } from 'src/app/services/app-states.service';
import { BmiCalculationService } from 'src/app/services/bmi-calculation.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-bmi-calculator-screen',
  templateUrl: './bmi-calculator-screen.component.html',
  styleUrls: ['./bmi-calculator-screen.component.scss']
})
export class BmiCalculatorScreenComponent {
  bmiForm: FormGroup;
  bmi: number | null = null;
  category: string = '';

  constructor(
    private _formBuilder: FormBuilder, 
    private _bmiService: BmiCalculationService,
    private _appStateService: AppStatesService,
    private _store: StoreService
  ) {
    this.bmiForm = this._formBuilder.group({
      gender: ['male', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      height: ['', [Validators.required, Validators.min(50)]],
      weight: ['', [Validators.required, Validators.min(10)]]
    });
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
          console.log(this._store.getGender(),this._store.getAge(),this._store.getWeight(),this._store.getHeight());

    }
  }

  navigate(){
    this._appStateService.currentState(APP_STATES.EXERSICE);
  }
}