import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreService } from 'src/app/services/store.service';
import { addDays, format } from 'date-fns' ;
import { Router } from '@angular/router';

@Component({
  selector: 'app-budget-planner',
  templateUrl: './budget-planner.component.html',
  styleUrls: ['./budget-planner.component.scss']
})
export class BudgetPlannerComponent implements OnInit{
  form: FormGroup;
  days: string[] = [];
  selectedDay: string | null = null;
  categories = ['Meat', 'Fish', 'Fruit', 'Vegetable', 'Pasta', 'Dairy', 'Snacks'];
  daySelections: { [day: string]: string[] } = {};
showAlert = false;
alertMessage = '';
alertStatus: 'warning' | 'error' | 'info' = 'warning';
alertDuration = 95000; // 5 seconds
missingCategoryDays: string[] = [];
 
constructor(private router: Router, private fb: FormBuilder, private store: StoreService) {
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
  // Load saved budget and daysCount
  const savedBudget = this.store.getBudget();
  const savedDaysCount = this.store.getDaysCount();

  if (savedBudget !== null) {
    this.form.patchValue({ budget: savedBudget });
  }

  // Load saved daily categories from store
  const savedCategories = this.store.getDailyCategories();

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
  this.form.get('daysCount')?.valueChanges.subscribe(val => {
    if (val >= 1) {
      this.generateDays(val);
    } else {
      this.days = [];
      this.selectedDay = null;
      this.daySelections = {};
      this.store.setDailyCategories(this.daySelections);
    }
  });
}
getEmoji(category: string): string {
  const emojiMap: { [key: string]: string } = {
    Meat: '🥩',
    Fish: '🐟',
    Fruit: '🍎',
    Vegetable: '🥦',
    Pasta: '🍝',
    Dairy: '🧀',
    Snacks: '🍪',
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
  
  newDays.forEach(day => {
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


closeAlert(){
  this.showAlert=false;
}
  toggleCategory(category: string) {
    const selected = this.daySelections[this.selectedDay!] || [];
    const index = selected.indexOf(category);

    if (index >= 0) {
      selected.splice(index, 1);
    } else {
      selected.push(category);
    }

    this.daySelections[this.selectedDay!] = [...selected];
    this.store.setDailyCategories(this.daySelections); // store it
  }

  isSelected(category: string): boolean {
    return this.daySelections[this.selectedDay!]?.includes(category);
  }

checkMissingCategories() {
  this.missingCategoryDays = this.days.filter(day => 
    !this.daySelections[day] || this.daySelections[day].length === 0
  );
}


navigate(): void {
   this.checkMissingCategories();

  for (const day of this.days) {
    if (!this.daySelections[day] || this.daySelections[day].length === 0) {
      this.alertMessage = `Παρακαλώ επιλέξτε κατηγορίες για την ημέρα ${day}`;
      this.alertStatus = 'error';
      this.alertDuration = 4000;
      this.showAlert = true;
      return;
    }
  }
  this.showAlert = false;

       const logData = {
    budget: this.form.value.budget,
    daysCount: this.form.value.daysCount,
    days: this.days,
    selectedDay: this.selectedDay,
    daySelections: this.daySelections,
  };
  console.log('Budget Planner Data:', logData);

  this.form.valueChanges.subscribe(val => {
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
