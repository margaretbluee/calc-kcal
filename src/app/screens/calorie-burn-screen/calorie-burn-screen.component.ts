import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalorieBurnService } from 'src/app/services/calorie-burn.service';

@Component({
  selector: 'calorie-burn-screen',
  templateUrl: './calorie-burn-screen.component.html',
  styleUrls: ['./calorie-burn-screen.component.scss']
})
export class CalorieBurnScreenComponent implements OnInit {
  calorieForm!: FormGroup;
  summary: { daily: number; weekly: number; pace: string } | null = null;
  showResults = false;

  constructor(
    private fb: FormBuilder,
    private calorieService: CalorieBurnService
  ) {}

  ngOnInit(): void {
    this.calorieForm = this.fb.group({
      gender: ['male', Validators.required],
      age: [25, [Validators.required, Validators.min(0)]],
      height: [170, [Validators.required, Validators.min(50)]],
      weight: [65, [Validators.required, Validators.min(30)]],
      activity: ['walk', Validators.required],
      distance: [1, [Validators.required, Validators.min(0.1)]],
      duration: [30, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.calorieForm.valid) {
      const formData = this.calorieForm.value;
      this.summary = this.calorieService.getSummary(formData);
      this.showResults = true;
    }
  }
}
