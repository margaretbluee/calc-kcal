import { StoreService } from 'src/app/services/store.service';
import { Component, OnInit } from '@angular/core';
import { SupermarketService } from '../../services/supermarket.service';
import { Product } from '../../services/supermarket.service';
import { TranslateService } from '@ngx-translate/core';
import jsPDF from 'jspdf';
import { Options } from '@angular-slider/ngx-slider';
import { CategoryMappingService } from 'src/app/services/category-mapping.service';

interface Supermarket {
  id: number;
  name: string;
}

interface RecipeData {
  day: string;
  products: Product[];
  instructions?: string;
}

interface Recipe {
  day: string;
  recipe: string; // full recipe string from API
}

@Component({
  selector: 'app-results-screen',
  templateUrl: './results-screen.component.html',
  styleUrls: ['./results-screen.component.scss'],
})
export class ResultsScreenComponent implements OnInit {
  dailyCategories: { [date: string]: string[] } = {};
  daysList: string[] = [];
  selectedDay: string | null = null;
  selectedCategory: string | null = null;
  supermarkets: Supermarket[] = [];
  showOnlyChosen = false;
  selectedSupermarket: Supermarket | null = null;
  loading: boolean = false;
  products: Product[] = [];
  totalCount = 0;
  currentPage = 1;
  pageSize = 12;
  alertMessage: string = '';
  alertStatus: 'info' | 'warning' | 'error' = 'info';
  alertDuration: number = 4000;
  showAlert: boolean = false;
  chosenProducts: { product: Product; day: string }[] = [];
  currentLang: string = '';
  recipes: Recipe[] = [];
  loadingRecipes: boolean = false;
  showRecipesSection = false;
  selectedDayForRecipe: string | null = null;
  recipeDialogData: Recipe | null = null;
  recipeLoadingByDay: { [day: string]: boolean } = {};
  priceMin: number = 0.1;
  priceMax: number = 40;
  kcalMin: number = 0;
  kcalMax: number = 1000;
  sortBy: string = 'priceAsc';
  showRecipeCards = false;
  priceRange = { min: 0.1, max: 40 };
  priceOptions: Options = {
    floor: 0,
    ceil: 40,
    step: 1,
    translate: (value: number): string => `€${value}`,
  };
  supermarketLabels: { [key: string]: { en: string; el: string } } = {
    ab: { en: 'AB', el: 'ΑΒ' },
    masoutis: { en: 'MASOUTIS', el: 'ΜΑΣΟΥΤΗΣ' },
    sklavenitis: { en: 'SKLAVENITIS', el: 'ΣΚΛΑΒΕΝΙΤΗΣ' },
  };
  kcalRange = { min: 0, max: 1000 };
  kcalOptions: Options = {
    floor: 0,
    ceil: 1000,
    step: 10,
    translate: (value: number): string => `${value} kcal`,
  };
  constructor(
    private supermarketService: SupermarketService,
    public store: StoreService,
    private _translate: TranslateService,
    private _categoryMapping: CategoryMappingService
  ) {}

  ngOnInit(): void {
    this._translate.onLangChange.subscribe((data) => {
      console.log(data);
      this.currentLang = this._translate.currentLang;
      console.log('current lang', this.currentLang);
    });
    this.refreshChosen();
    this.loading = true;
    this.supermarketService.getSupermarkets().subscribe(() => {
      this.supermarkets = this.store.getSupermarkets();
      this.selectedSupermarket = this.supermarkets[0];

      this.loading = false;

      this.dailyCategories = this.store.getDailyCategories();
      this.daysList = Object.keys(this.dailyCategories);

      const firstDate = Object.keys(this.dailyCategories).sort()[0];
      const firstCategory = this.dailyCategories[firstDate]?.[0];

      this.selectedDay = firstDate;
      this.selectDay(this.selectedDay);

      this.selectedCategory = firstCategory;
      this.selectCategory(this.selectedCategory);

      this.onSelectSupermarket(this.selectedSupermarket);
      //
    });
  }
  getLocalizedName(marketKey: string): string {
    const labels = this.supermarketLabels[marketKey];
    if (!labels) return marketKey; // fallback to backend value if no translation found
    return this.currentLang === 'el' ? labels.el : labels.en;
  }

  getTotalChosenKcal(): number {
    return this.store.getChosenProducts().reduce((total, item) => {
      return total + (item.product.kcal || 0);
    }, 0);
  }

  getKcalLimit(): number {
    return (this.store.getTDEE() || 0) * (this.daysList?.length || 1);
  }

  getKcalProgress(): number {
    const limit = this.getKcalLimit();
    if (!limit) return 0;
    return Math.min((this.getTotalChosenKcal() / limit) * 100, 100);
  }

  getKcalColor(): string {
    const progress = this.getKcalProgress();
    if (progress <= 25) return 'blue';
    if (progress <= 50) return 'green';
    if (progress <= 75) return 'orange';
    return 'red';
  }

  getKcalColorAlpha(alpha: number = 0.3): string {
    const progress = this.getKcalProgress();
    if (progress <= 25) return `rgba(13, 110, 253, ${alpha})`; // blue
    if (progress <= 50) return `rgba(25, 135, 84, ${alpha})`; // green
    if (progress <= 75) return `rgba(255, 165, 0, ${alpha})`; // orange
    return `rgba(220, 53, 69, ${alpha})`; // red
  }

  getBudgetColorAlpha(alpha: number = 0.3): string {
    const progress = this.getBudgetProgress();
    if (progress <= 25) return `rgba(13, 110, 253, ${alpha})`; // blue
    if (progress <= 50) return `rgba(25, 135, 84, ${alpha})`; // green
    if (progress <= 75) return `rgba(255, 165, 0, ${alpha})`; // orange
    return `rgba(220, 53, 69, ${alpha})`; // red
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  max(a: number, b: number): number {
    return Math.max(a, b);
  }
  toggleRecipesSection() {
    this.showRecipeCards = !this.showRecipeCards;

    if (this.showRecipeCards) {
      console.log('Showing recipe cards, hiding products.');
      this.products = []; // hide products
    } else {
      console.log('Back to products view.');
      this.loadProducts(); // restore products
    }
  }
  getFormattedRecipe(recipe: string | undefined): string {
    if (!recipe) return '';

    let formatted = recipe;

    // Convert bold markdown **text** to HTML <strong>
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert double newlines to paragraph breaks
    formatted = formatted.replace(/\n\s*\n/g, '</p><p>');

    // Convert single newlines to <br>
    formatted = formatted.replace(/\n/g, '<br>');

    // Wrap in paragraph if not already
    if (!formatted.startsWith('<p>')) {
      formatted = `<p>${formatted}</p>`;
    }

    return formatted;
  }

  generateRecipeForDay(day: string) {
    const productsForDay = this.chosenProducts
      .filter((cp) => cp.day === day)
      .map((cp) => cp.product.id);

    if (!productsForDay.length) {
      this.alertMessage =
        this.currentLang === 'el'
          ? 'Δεν υπάρχουν προϊόντα για αυτή την ημέρα'
          : 'No products for this day';
      this.alertStatus = 'warning';
      this.showAlert = true;
      return;
    }

    this.loadingRecipes = true;
    this.selectedDayForRecipe = day;

    this.supermarketService
      .generateRecipe({ day, productIds: productsForDay })
      .subscribe({
        next: (res: Recipe) => {
          console.log('Generated recipe:', res);
          this.recipeDialogData = res; // recipe string
          this.loadingRecipes = false;
        },
        error: () => {
          this.loadingRecipes = false;
          this.alertMessage = 'Failed to load recipe.';
          this.alertStatus = 'error';
          this.showAlert = true;
        },
      });
  }
  closeRecipeDialog() {
    this.recipeDialogData = null;
    this.selectedDayForRecipe = null;
  }

  downloadRecipePDF(recipe: RecipeData) {
    const doc = new jsPDF();
    doc.text(`${recipe.day} Recipe`, 10, 10);
    recipe.products.forEach((p, i) =>
      doc.text(`${i + 1}. ${p.name}`, 10, 20 + i * 10)
    );
    if (recipe.instructions)
      doc.text(
        `Instructions: ${recipe.instructions}`,
        10,
        20 + recipe.products.length * 10
      );
    doc.save(`${recipe.day}-recipe.pdf`);
  }

  showAlertMessage(message: string, status: 'info' | 'error') {
    this.alertMessage = message;
    this.alertStatus = status;
    this.showAlert = true;
    setTimeout(() => (this.showAlert = false), this.alertDuration);
  }

  getProductsForDay(day: string) {
    return this.chosenProducts.filter((p) => p.day === day);
  }

  closeAlert() {
    this.showAlert = false;
  }

  toggleShowChosen() {
    this.showOnlyChosen = !this.showOnlyChosen;
    this.currentPage = 1;

    if (this.showOnlyChosen) {
      this.loadChosenProducts();
    } else {
      this.loadProducts();
    }
  }

  loadChosenProducts() {
    const ids = this.chosenProducts.map((cp) => cp.product.id);
    console.log('loadChosenProducts', 'chosen ids', ids);
    if (ids.length === 0) {
      this.products = [];
      this.totalCount = 0;
      return;
    }

    this.loading = true;
    this.supermarketService
      .getProductsByIds(ids, this.currentPage, this.pageSize)
      .subscribe((response) => {
        this.products = response.items.$values.map((p: any) => ({
          ...p,
          category: this._categoryMapping.mapCategory(p.category),
        }));
        this.totalCount = response.totalCount;
        this.loading = false;
      });
  }

  toggleChosen(product: Product) {
    if (!this.selectedDay) {
      this.alertMessage =
        this.currentLang === 'el'
          ? `Παρακαλώ διαλέξτε μερα πρωτα`
          : 'Please select day first';
      this.alertStatus = 'error';
      this.alertDuration = 4000;
      this.showAlert = true;
      return;
    }

    if (this.store.isChosen(product.id, this.selectedDay)) {
      this.store.removeProduct(product.id, this.selectedDay);
    } else {
      this.store.addProduct(product, this.selectedDay);
    }
    this.refreshChosen();
  }

  private refreshChosen() {
    this.chosenProducts = this.store.getChosenProducts();
  }

getAllChosenProducts(product: Product): boolean {
  return this.store
    .getChosenProducts()
    .some((chosen) => chosen.product.id === product.id);
}


  isChosen(product: Product): boolean {
    if (this.selectedDay) {
      return this.store.isChosen(product.id, this.selectedDay);
    } else {
      this.alertMessage =
        this.currentLang === 'el'
          ? `Παρακαλώ διαλέξτε μερα πρωτα`
          : 'Please select day first';
      this.alertStatus = 'error';
      this.alertDuration = 4000;
      this.showAlert = true;
      return false;
    }
  }

  getBudgetColor(): string {
    const progress = this.getBudgetProgress();
    if (progress <= 25) return 'blue';
    if (progress <= 50) return 'green';
    if (progress <= 75) return 'orange';
    return 'red';
  }

  get totalChosenPrice(): number {
    return this.chosenProducts.reduce(
      (total, item) => total + item.product.price,
      0
    );
  }

  getBudgetProgress(): number {
    const budget = this.store.getBudget() || 0;
    const spent = this.totalChosenPrice;
    if (budget === 0) return 0;
    return Math.min((spent / budget) * 100, 100); // clamp at 100%
  }

  getRemainingBudget(): number {
    const budget = this.store.getBudget() || 0;
    return Math.max(budget - this.totalChosenPrice, 0);
  }

  selectDay(day: string) {
    this.selectedDay = day;
    this.selectedCategory = null;
    this.products = [];
  }

  onSelectSupermarket(market: Supermarket): void {
    this.selectedSupermarket = market;

    this.currentPage = 1;

    this.loadProducts();
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.loadProducts();
  }

  loadProducts() {
    if (!this.selectedSupermarket) return;
    this.loading = true;
    this.supermarketService
      .getProductsBySupermarket(
        this.selectedSupermarket.id,
        this.currentPage,
        this.pageSize,
        this.selectedCategory?.toLowerCase(),
        this.priceMin,
        this.priceMax,
        this.kcalMin,
        this.kcalMax,
        this.sortBy
      )
      .subscribe((response) => {
        this.products = response.items.$values.map((p: any) => ({
          ...p,
          category: this._categoryMapping.mapCategory(p.category),
        }));
        this.totalCount = response.totalCount;
        this.loading = false;
      });
  }

  collapsedSections = {
    supermarkets: false,
    mealPlan: false,
    filters: false,
    chosenProducts: false,
  };
  sectionOpen: { [key: string]: boolean } = {
    supermarkets: true,
    mealPlan: true,
    filters: true,
    chosen: true,
  };

  isSectionOpen(section: string): boolean {
    return this.sectionOpen[section];
  }

  toggleSection(section: string) {
    this.sectionOpen[section] = !this.sectionOpen[section];
  }

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }
}
