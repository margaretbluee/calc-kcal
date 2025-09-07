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
  keyEn: string;   // “Monday”
  keyEl: string;
  helperEl: string;
  labelEn: string; // “M”
    labelEl: string; // “M”


}

 

@Component({
  selector: 'calorie-burn-screen',
  templateUrl: './calorie-burn-screen.component.html',
  styleUrls: ['./calorie-burn-screen.component.scss'],
})
export class CalorieBurnScreenComponent implements OnInit {

   constructor(
    private fb: FormBuilder,
    private calorieService: CalorieBurnService,
    private router: Router,
    private _store: StoreService,
    private _translate: TranslateService
  
  ) {}

  userForm!: FormGroup;
  activityForm!: FormGroup;
  currentLang: string = '';

  days: DayMeta[]  = [
    { keyEn: 'Monday',     keyEl: 'Δευτέρα',   helperEl: 'Δευτέρας',    labelEn: 'M',    labelEl: 'Δ' },
    { keyEn: 'Tuesday',    keyEl: 'Τρίτη',    helperEl: 'Τρίτης',    labelEn: 'T',    labelEl: 'Τ' },
    { keyEn: 'Wednesday',  keyEl: 'Τετάρτη',  helperEl: 'Τετάρτης',   labelEn: 'W' ,    labelEl: 'Τ'},
    { keyEn: 'Thursday',   keyEl: 'Πέμπτη',   helperEl: 'Πέμπτης',      labelEn: 'T' ,    labelEl: 'Π'},
    { keyEn: 'Friday',     keyEl: 'Παρασκευή',helperEl: 'Παρασκευής',    labelEn: 'F',    labelEl: 'Π' },
    { keyEn: 'Saturday',   keyEl: 'Σάββατο',  helperEl: 'Σαββάτου',    labelEn: 'S',    labelEl: 'Σ' },
    { keyEn: 'Sunday',     keyEl: 'Κυριακή',  helperEl: 'Κυριακής',    labelEn: 'S',    labelEl: 'Κ' },
  ];
  selectedDay = this.currentLang === 'el' ? this.days[0].keyEl : this.days[0].keyEn;

  weekData: Record<string, ActivityInput> = {};

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
  
 

  onDayChange( day: DayMeta): void {
    console.log("selectedDay", this.selectedDay);
  // Load existing data for that day into the form
  // this.selectedDay = day.key;
  const data = this.weekData[this.selectedDay];
  if (data) {
    this.activityForm.setValue(data);
  } else {
    this.activityForm.reset({ activity: 'walk', distance: 1, duration: 30 });
    this.selectedDay = this.currentLang === 'el' ? day.keyEl : day.keyEn;
  }
}
get selectedDayLabel(): string {
  const dayObj = this.days.find(
    d => d.keyEn === this.selectedDay || d.keyEl === this.selectedDay
  );
  if (!dayObj) return '';
  return this.currentLang === 'el' ? dayObj.helperEl : dayObj.keyEn;
}

  ngOnInit(): void {
  this.currentLang = this._translate.currentLang || 'en'; // fallback to 'en' if undefined

  this._translate.onLangChange.subscribe((data) => {
    this.currentLang = data.lang;
  });
    this.selectedDay = this.currentLang === 'el' ? this.days[0].keyEl : this.days[0].keyEn;

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

     
    this.activityForm = this.fb.group({
      activity: ['walk', Validators.required],
      distance: [1, [Validators.required, Validators.min(0.1)]],
      duration: [30, [Validators.required, Validators.min(1)]],
    });
  }


hasData(day: DayMeta): boolean {
  const key = this.currentLang === 'el' ? day.keyEl : day.keyEn;
  return !!this.weekData[key];
}

  saveDayActivity(): void {
    if (this.activityForm.invalid) return;

    
    
    this.weekData[this.selectedDay] = this.activityForm.value as ActivityInput;
 
    this.activityForm.reset({
      activity: 'walk',
      distance: 1,
      duration: 30,
    });
  }

  calculate(): void {
    if (this.userForm.invalid || Object.keys(this.weekData).length === 0) return;

 
    this.summary = this.calorieService.getWeeklySummary(
      this.userForm.value,
      this.weekData
    );

    let summaryWeekly = this.summary.weekly;
    this._store.setSummaryWeekly(summaryWeekly);
    console.log("summaryWeekly info stred in memory", this._store.getSummaryWeekly());
 
    const label = this.currentLang === 'en' ? 'Calories Burned' : 'Θερμίδες'
    this.barChartData = {
      labels: this.summary.daily.map((d) => d.day),
      datasets: [
        {
          data: this.summary.daily.map((d) => d.calories),
          label: label,
          backgroundColor: '#4caf50',
        },
      ],
    };
  }

  navigate(): void {
    this.calorieService.calculateTDEE();
    this.router.navigate(['supermarket-selection-screen']);
  }
}
