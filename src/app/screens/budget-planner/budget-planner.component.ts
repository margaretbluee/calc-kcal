import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreService } from 'src/app/services/store.service';
import { addDays, format } from 'date-fns';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-budget-planner',
  templateUrl: './budget-planner.component.html',
  styleUrls: ['./budget-planner.component.scss'],
})
export class BudgetPlannerComponent implements OnInit {
  form: FormGroup;
  days: string[] = [];
  selectedDay: string | null = null;
  categories = [
    'meatfish',
    'fruit vegetables',
    'dairy',
    'bakery',
    'frozen',
    'healthy organic',
    'pantry',
    'ready meals',
    'beverages',
    'sweets snacks',
  ];
  daySelections: { [day: string]: string[] } = {};
  showAlert = false;
  alertMessage = '';
  alertStatus: 'warning' | 'error' | 'info' = 'warning';
  alertDuration = 95000; // 5 seconds
  missingCategoryDays: string[] = [];
  currentLang?: string;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: StoreService,
    private _translate: TranslateService
  ) {
    const savedBudget = this.store.getBudget();
    const savedDaysCount = this.store.getDaysCount();

    this.form = this.fb.group({
      budget: [null, [Validators.required, Validators.min(1)]],
      daysCount: [1, [Validators.required, Validators.min(1)]], // default to 1 here
    });

    if (savedBudget !== null && savedDaysCount !== null) {
      this.form.patchValue({
        budget: savedBudget,
        daysCount: savedDaysCount,
      });
    }
  }

  ngOnInit(): void {
    this.currentLang = this._translate.currentLang || 'en'; // fallback to 'en' if undefined

    this._translate.onLangChange.subscribe((data) => {
      this.currentLang = data.lang;
    });
    // Load saved budget and daysCount
    const savedBudget = this.store.getBudget();
    const savedDaysCount = this.store.getDaysCount();

    if (savedBudget !== null) {
      this.form.patchValue({ budget: savedBudget });
    }

    // Load saved daily categories from store
    const savedCategories = this.store.getDailyCategories();
console.log("onInit","saved categories", savedCategories);
    // Determine daysCount from savedCategories keys length, fallback to savedDaysCount, then fallback to 1
    let daysCount = Object.keys(savedCategories).length;
    if (daysCount === 0) {
      daysCount = savedDaysCount && savedDaysCount >= 1 ? savedDaysCount : 1;
    }

    // Patch daysCount form value
    this.form.patchValue({ daysCount });

    // Generate days for the daysCount
    this.generateDays(daysCount);

    // Override daySelections with saved categories (so categories are restored)
    this.daySelections = { ...this.daySelections, ...savedCategories };

    // Set selectedDay to first day or null if no days
    this.selectedDay = this.days[0] || null;

    // Subscribe to daysCount changes (keep existing behavior)
    this.form.get('daysCount')?.valueChanges.subscribe((val) => {
      if (val >= 1) {
        this.generateDays(val);
      } else {
        this.days = [];
        this.selectedDay = null;
        this.daySelections = {};
        this.store.setDailyCategories(this.daySelections);
        console.log("onInit","day selections", this.daySelections);

      }
    });

    this.form.get('budget')?.valueChanges.subscribe((val) => {
      if (val >= 1) {
        this.store.setBudget(val);
        console.log('value of budget changed', val);
      }
    });
  }
  getEmoji(category: string): string {
    const emojiMap: { [key: string]: string } = {
      meatfish: '🥩',
      'fruit vegetables': '🥦',
      dairy: '🧀',
      bakery: '🥖',
      frozen: '❄',
      'healthy organic': '🥗',
      pantry: '🍝',
      'ready meals': '🥪',
      beverages: '🍷',
      'sweets snacks': '🍫',
    };
    return emojiMap[category] || '❓';
  }

  generateDays(count: number) {
    const today = new Date();
    const newDays = Array.from({ length: count }, (_, i) =>
      format(addDays(today, i), 'dd/MM')
    );

    // Preserve previous daySelections for days still in newDays
    const newDaySelections: { [day: string]: string[] } = {};

    newDays.forEach((day) => {
      if (this.daySelections[day]) {
        newDaySelections[day] = this.daySelections[day];
      } else {
        newDaySelections[day] = [];
      }
    });

    this.days = newDays;
    this.daySelections = newDaySelections;

    if (!this.days.includes(this.selectedDay!)) {
      this.selectedDay = this.days[0] || null;
    }

    this.store.setDailyCategories(this.daySelections);
  
  }

  incrementDaysCount() {
    const current = this.form.get('daysCount')?.value || 1;
    const newValue = current + 1;
    this.form.get('daysCount')?.setValue(newValue);
    this.generateDays(newValue);
  }

  decrementDaysCount() {
    const current = this.form.get('daysCount')?.value || 1;
    if (current > 1) {
      const newValue = current - 1;
      this.form.get('daysCount')?.setValue(newValue);
      this.generateDays(newValue);
    }
  }

  closeAlert() {
    this.showAlert = false;
  }
  toggleCategory(category: string) {
    const englishKey = category;
    const selected = this.daySelections[this.selectedDay!] || [];
    const index = selected.indexOf(englishKey);

    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      selected.push(englishKey);
    }

    this.daySelections[this.selectedDay!] = [...selected];
    this.store.setDailyCategories(this.daySelections); // store it
    console.log("toggleCategory","stored Daily Categories", this.store.getDailyCategories());
  }

  isSelected(category: string): boolean {
    return this.daySelections[this.selectedDay!]?.includes(category);
  }

  checkMissingCategories() {
    this.missingCategoryDays = this.days.filter(
      (day) => !this.daySelections[day] || this.daySelections[day].length === 0
    );
  }

  navigate(): void {
    this.checkMissingCategories();
    if (!this.store.getBudget()) {
      this.alertMessage =
        this.currentLang === 'el'
          ? `Το διαθέσιμο budget δεν μπορει να ειναι μηδενικό`
          : 'Please fill out your available budget';
      this.alertStatus = 'error';
      this.alertDuration = 4000;
      this.showAlert = true;
      return;
    }
    for (const day of this.days) {
      if (!this.daySelections[day] || this.daySelections[day].length === 0) {
        this.alertMessage =
          this.currentLang === 'el'
            ? `Παρακαλώ επιλέξτε κατηγορίες για την ημέρα ${day}`
            : `Please select categories for day ${day}`;

        this.alertStatus = 'error';
        this.alertDuration = 4000;
        this.showAlert = true;
        return;
      }
    }
    this.showAlert = false;
    this.store.setDailyCategories(this.daySelections);
    const logData = {
      budget: this.form.value.budget,
      daysCount: this.form.value.daysCount,
      days: this.days,
      selectedDay: this.selectedDay,
      daySelections: this.daySelections,
    };
    console.log('Budget Planner Data:', logData);

    this.form.valueChanges.subscribe((val) => {
      if (val.budget !== null) {
        this.store.setBudget(val.budget);
      }
      if (val.daysCount !== null) {
        this.store.setDaysCount(val.daysCount);
      }
    });
    this.router.navigate(['result-screen']);
  }
}
