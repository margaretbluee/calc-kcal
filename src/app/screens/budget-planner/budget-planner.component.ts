import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreService } from 'src/app/services/store.service';
import { addDays, format } from 'date-fns' ;

@Component({
  selector: 'app-budget-planner',
  templateUrl: './budget-planner.component.html',
  styleUrls: ['./budget-planner.component.scss']
})
export class BudgetPlannerComponent {
  form: FormGroup;
  days: string[] = [];
  selectedDay: string | null = null;
  categories = ['Meat', 'Fish', 'Fruit', 'Vegetable', 'Pasta', 'Dairy', 'Snacks'];
  daySelections: { [day: string]: string[] } = {};

  constructor(private fb: FormBuilder, private store: StoreService) {
    this.form = this.fb.group({
      budget: [null, [Validators.required, Validators.min(1)]],
      daysCount: [null, [Validators.required, Validators.min(1)]],
    });
  }

  generateDays() {
    const count = this.form.value.daysCount;
    const today = new Date();
    this.days = Array.from({ length: count }, (_, i) =>
      format(addDays(today, i), 'dd/MM')
    );
    this.selectedDay = this.days[0];
    this.daySelections = {};
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
}
