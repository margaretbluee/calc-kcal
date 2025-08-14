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
      if (bmi < 17) return 'category_underweight';
      if (bmi < 22) return 'categoryNormal';
      if (bmi < 27) return 'category_overweight';
      return 'category_obesity';
    }

    // Seniors (65+)
    if (age >= 65) {
      if (bmi < 23) return 'category_underweight';
      if (bmi < 30) return 'categoryNormal';
      if (bmi < 35) return 'category_overweight';
      return 'category_obesity';
    }

    // Adults 18–64 (adjusted slightly per gender)
    if (gender === 'male') {
      if (bmi < 20) return 'category_underweight';
      if (bmi < 25) return 'categoryNormal';
      if (bmi < 30) return 'category_overweight';
      return 'category_obesity';
    } else {
      if (bmi < 19) return 'category_underweight';
      if (bmi < 24) return 'categoryNormal';
      if (bmi < 29) return 'category_overweight';
      return 'category_obesity';
    }
  }
}