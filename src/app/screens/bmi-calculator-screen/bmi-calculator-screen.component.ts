import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BmiCalculationService } from 'src/app/services/bmi-calculation.service';

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
    private _bmiService: BmiCalculationService) {
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
    }
  }
}