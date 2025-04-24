import { Component } from '@angular/core';
import { UnitConversionService } from '../../services/unit-conversion.service';

@Component({
  selector: 'test-unit-convertion-screen',
  templateUrl: './test-unit-convertion-screen.component.html',
  styleUrls: ['./test-unit-convertion-screen.component.scss']
})
export class TestUnitConvertionScreenComponent {
  constructor(private readonly _unitConvertionService: UnitConversionService) {}

  // Input values
  kgInput: number = 0;
  poundsInput: number = 0;
  cmInput: number = 0;
  feetInput: number = 0;
  inchesInput: number = 0;

  // Result values
  kgToPoundsResult: number | undefined;
  poundsToKgResult: number | undefined;
  feetResult: number | undefined;
  inchesResult: number | undefined;
  cmResult: number | undefined;

  convertKgToPounds() {
    this.kgToPoundsResult = this._unitConvertionService.kgToPounds(this.kgInput);
  }

  convertPoundsToKg() {
    this.poundsToKgResult = this._unitConvertionService.poundsToKg(this.poundsInput);
  }

  convertCmToFeetAndInches() {
    const { feet, inches } = this._unitConvertionService.cmToFeetAndInches(this.cmInput);
    this.feetResult = feet;
    this.inchesResult = inches;
  }

  convertFeetAndInchesToCm() {
    this.cmResult = this._unitConvertionService.feetAndInchesToCm(this.feetInput, this.inchesInput);
  }
}
