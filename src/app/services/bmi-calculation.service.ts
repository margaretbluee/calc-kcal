import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BmiCalculationService {
  calculateBMI(heightCm: number, weightKg: number, gender: 'male' | 'female', age: number): { bmi: number, category: string } {
    const heightM = heightCm / 100;
    const bmi = +(weightKg / (heightM * heightM)).toFixed(1);
    const category = this.getBMICategory(bmi, gender, age);
    return { bmi, category };
  }

  private getBMICategory(bmi: number, gender: 'male' | 'female', age: number): string {
    // Teens (<18)
    if (age < 18) {
      if (bmi < 17) return 'Underweight';
      if (bmi < 22) return 'Normal weight';
      if (bmi < 27) return 'Overweight';
      return 'Obesity';
    }

    // Seniors (65+)
    if (age >= 65) {
      if (bmi < 23) return 'Underweight';
      if (bmi < 30) return 'Normal weight';
      if (bmi < 35) return 'Overweight';
      return 'Obesity';
    }

    // Adults 18–64 (adjusted slightly per gender)
    if (gender === 'male') {
      if (bmi < 20) return 'Underweight';
      if (bmi < 25) return 'Normal weight';
      if (bmi < 30) return 'Overweight';
      return 'Obesity';
    } else {
      if (bmi < 19) return 'Underweight';
      if (bmi < 24) return 'Normal weight';
      if (bmi < 29) return 'Overweight';
      return 'Obesity';
    }
  }
}