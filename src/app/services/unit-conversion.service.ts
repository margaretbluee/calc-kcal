import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UnitConversionService {

  constructor() { }

  /**
   * convert kg to pounds
   * @param kg 
   * @returns weight in pounds
   */
  kgToPounds(kg: number): number {
    return kg * 2.20462;
  }

  /**
   * convert pounds to kg
   * @param pounds 
   * @returns equivalent weight in kg 
   */
  poundsToKg(pounds: number): number {
    return pounds / 2.20462;
  }

  /**
   * convert cm to feet and inches
   * @param cm 
   * @returns {feet, inches} as an object
   */
  cmToFeetAndInches(cm: number): { feet: number, inches: number } {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12); // Round to avoid floating numbers
    return { feet, inches };
  }

  /**
   * convert feet and inches to cm
   * @param feet 
   * @param inches 
   * @returns equivalent height in cm
   */
  feetAndInchesToCm(feet: number, inches: number): number {
    const totalInches = (feet * 12) + inches;
    return totalInches * 2.54;
  }
}
