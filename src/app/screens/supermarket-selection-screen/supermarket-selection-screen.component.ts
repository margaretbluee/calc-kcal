import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StoreService } from 'src/app/services/store.service';
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
  currentLang?: string;
 
supermarketLabels: { [key: string]: { en: string; el: string } } = {
  'ab': { en: 'AB', el: 'ΑΒ' },
  'masoutis': { en: 'MASOUTIS', el: 'ΜΑΣΟΥΤΗΣ' },
  'sklavenitis': { en: 'SKLAVENITIS', el: 'ΣΚΛΑΒΕΝΙΤΗΣ' },
  
};
  constructor(
    private fb: FormBuilder,
    private supermarketService: SupermarketService,
    private router: Router,
    private _translate: TranslateService,
    private _store: StoreService
  ) {
    // let existingSelections = this._store.getSupermarkets();
    // if(existingSelections){
    //   this.form = this.fb.group({
    //     selectedSupermarkets: existingSelections
    //   });
    // } else{
    this.form = this.fb.group({
      selectedSupermarkets: [[]] // multiple selection
    });
    // }

  }

  ngOnInit(): void {
      this.currentLang = this._translate.currentLang || 'en'; // fallback to 'en' if undefined

  this._translate.onLangChange.subscribe((data) => {
    this.currentLang = data.lang;
  });
  this.supermarketService.getSupermarketNames().subscribe({
    next: (names) => {
      this.supermarkets = names;
            // patch form with existing selections from store, only if they exist in the backend list
      const existingSelections = this._store.getSupermarkets() || [];
      const validSelections = existingSelections.filter(s => this.supermarkets.includes(s));
      this.form.get('selectedSupermarkets')?.setValue(validSelections);

      this.loading = false;
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
getLocalizedName(marketKey: string): string {
  const labels = this.supermarketLabels[marketKey];
  if (!labels) return marketKey; // fallback to backend value if no translation found
  return this.currentLang === 'el' ? labels.el : labels.en;
}
 

  submit() {
    const selected = this.form.value.selectedSupermarkets;
    this._store.setSupermarkets(selected);
    // alert(`Selected supermarkets: ${selected.join(', ')}`);
    this.router.navigate(['budget-planner-screen']);
  
  }
}