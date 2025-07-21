import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SupermarketService } from 'src/app/services/supermarket.service';

@Component({
  selector: 'app-supermarket-selector',
  templateUrl: './supermarket-selection-screen.component.html',
  styleUrls: ['./supermarket-selection-screen.component.scss']
})
export class SupermarketSelectionScreenComponent {
  form: FormGroup;
  supermarkets: string[] = [];
  loading = true;

  constructor(
    private fb: FormBuilder,
    private supermarketService: SupermarketService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      selectedSupermarkets: [[]] // multiple selection
    });
  }

  ngOnInit(): void {
    this.supermarketService.getSupermarkets().subscribe({
      next: (names) => {
        this.supermarkets = names;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load supermarkets:', err);
        this.loading = false;
      }
    });
  }

  toggleSelection(market: string): void {
    const selected = this.form.value.selectedSupermarkets;
    const index = selected.indexOf(market);
    if (index > -1) {
      selected.splice(index, 1); // remove
    } else {
      selected.push(market); // add
    }
    this.form.get('selectedSupermarkets')?.setValue([...selected]);
  }

  isSelected(market: string): boolean {
    return this.form.value.selectedSupermarkets.includes(market);
  }

  submit() {
    const selected = this.form.value.selectedSupermarkets;
    // alert(`Selected supermarkets: ${selected.join(', ')}`);
    this.router.navigate(['budget-planner-screen']);
  
  }
}