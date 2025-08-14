import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CalorieBurnService,
  ActivityInput,
} from 'src/app/services/calorie-burn.service';

import { ChartOptions } from 'chart.js';
import { StoreService } from 'src/app/services/store.service';
import { TranslateService } from '@ngx-translate/core';

interface DayMeta  {
  key: string;   // “Monday”
  labelEn: string; // “M”
    labelEl: string; // “M”


}

 

@Component({
  selector: 'calorie-burn-screen',
  templateUrl: './calorie-burn-screen.component.html',
  styleUrls: ['./calorie-burn-screen.component.scss'],
})
export class CalorieBurnScreenComponent implements OnInit, AfterViewInit {

   constructor(
    private fb: FormBuilder,
    private calorieService: CalorieBurnService,
    private router: Router,
    private _store: StoreService,
    private _translate: TranslateService
  
  ) {}

  /* ---------- forms ---------- */
  userForm!: FormGroup;
  activityForm!: FormGroup;
  currentLang: string = '';

  /* ---------- day handling ---------- */
  days: DayMeta[]  = [
    { key: 'Monday',    labelEn: 'M',    labelEl: 'Δ' },
    { key: 'Tuesday',   labelEn: 'T',    labelEl: 'Τ' },
    { key: 'Wednesday', labelEn: 'W' ,    labelEl: 'Τ'},
    { key: 'Thursday',  labelEn: 'T' ,    labelEl: 'Π'},
    { key: 'Friday',    labelEn: 'F',    labelEl: 'Π' },
    { key: 'Saturday',  labelEn: 'S',    labelEl: 'Σ' },
    { key: 'Sunday',    labelEn: 'S',    labelEl: 'Κ' },
  ];
  selectedDay = this.days[0].key;

  /** holds saved activity per day */
  weekData: Record<string, ActivityInput> = {};

  /* ---------- result ---------- */
  summary:
    | { daily: { day: string; calories: number }[]; weekly: number }
    | null = null;
  barChartData: any;
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 50 },
      },
    },
  };
  
  ngAfterViewInit(): void {
    this._translate.onLangChange.subscribe((data) => {
      console.log(data);
      this.currentLang =  this._translate.currentLang;

    });
  }

  onDayChange( day: DayMeta): void {
    console.log("selectedDay", this.selectedDay);
  // Load existing data for that day into the form
  // this.selectedDay = day.key;
  const data = this.weekData[this.selectedDay];
  if (data) {
    this.activityForm.setValue(data);
  } else {
    this.activityForm.reset({ activity: 'walk', distance: 1, duration: 30 });
    this.selectedDay = day.key;
  }
}


  ngOnInit(): void {
    this._translate.onLangChange.subscribe((data) => {
      console.log(data);
      this.currentLang =  this._translate.currentLang;

    });
    /* personal info */
    console.log(this._store.getGender(),this._store.getAge(),this._store.getWeight(),this._store.getHeight());
    this.userForm = this.fb.group({
      gender: [this._store.getGender(), Validators.required],
      age: [ this._store.getAge(), [Validators.required, Validators.min(0)]],
      height: [this._store.getHeight(), [Validators.required, Validators.min(50)]],
      weight: [this._store.getWeight(), [Validators.required, Validators.min(30)]],
    });

    
    this.userForm.get("gender")?.disable();
    this.userForm.get("age")?.disable();
    this.userForm.get("height")?.disable();
    this.userForm.get("weight")?.disable();

    /* activity info for the currently selected day */
    this.activityForm = this.fb.group({
      activity: ['walk', Validators.required],
      distance: [1, [Validators.required, Validators.min(0.1)]],
      duration: [30, [Validators.required, Validators.min(1)]],
    });
  }

  /* ---------- UX helpers ---------- */
  /** returns true if this day already has stored data */
  hasData(dayKey: string): boolean {
    return !!this.weekData[dayKey];
  }

  /* ---------- actions ---------- */
  saveDayActivity(): void {
    if (this.activityForm.invalid) return;

    
    /* store the data */
    this.weekData[this.selectedDay] = this.activityForm.value as ActivityInput;

    /* quick visual feedback: reset the form & keep activity default */
    this.activityForm.reset({
      activity: 'walk',
      distance: 1,
      duration: 30,
    });
  }

  calculate(): void {
    if (this.userForm.invalid || Object.keys(this.weekData).length === 0) return;

    /* 1. get summary */
    this.summary = this.calorieService.getWeeklySummary(
      this.userForm.value,
      this.weekData
    );

    /* 2. prepare chart data */
    this.barChartData = {
      labels: this.summary.daily.map((d) => d.day),
      datasets: [
        {
          data: this.summary.daily.map((d) => d.calories),
          label: 'Calories Burned',
          backgroundColor: '#4caf50',
        },
      ],
    };
  }

  navigate(): void {
    this.router.navigate(['supermarket-selection-screen']);
  }
}
