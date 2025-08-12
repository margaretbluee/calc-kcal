// import { Component, OnInit } from '@angular/core';
// import { SupermarketService } from '../../services/supermarket.service';

// interface Supermarket {
//   id: number;
//   name: string;
  
// }
//  export interface ISuperMarketProducts  {
//   $id: string;
//   $values: any[]
// }

// export interface Product {
//   $id: string;
//   id: number;
//   name: string;
//   price: number;
//   imageBase64: string;
//   discount: boolean;
//   category: string;
//   kcal: number | null;
//   supermarketProducts: ISuperMarketProducts
// }

// export interface PagedResult<T> {
//   $id: string,
//   totalCount: number;
//   items:{
//     $id: string,
//     $values:    T[];
//   }
// }
// @Component({
//   selector: 'app-results-screen',
//   templateUrl: './results-screen.component.html',
//   styleUrls: ['./results-screen.component.scss']
// })

// export class ResultsScreenComponent  implements OnInit {
//   supermarkets: Supermarket[] = [];
//   selectedSupermarket: Supermarket | null = null;
//   products: any[] = [];
//   totalCount: number = 0;

//   currentPage: number = 1;
//   pageSize: number = 12;

//   constructor(private supermarketService: SupermarketService) {}

//   ngOnInit(): void {
//     this.supermarketService.getSupermarkets().subscribe((markets) => {
//       this.supermarkets = markets;
//     });
//   }

// selectSupermarket(market: Supermarket): void {
//   this.selectedSupermarket = market;
//   this.currentPage = 1;
//   this.loadProducts();
// }

// loadProducts(): void {
//   if (!this.selectedSupermarket) return;

//   this.supermarketService
//     .getProductsBySupermarket(this.selectedSupermarket.id, this.currentPage, this.pageSize)
//     .subscribe(response  => {
//       this.products = response.items.$values;
//       this.totalCount = response.totalCount;
//     });
// }

// get totalPages(): number {
//   return Math.ceil(this.totalCount / this.pageSize);
// }

// nextPage(): void {
//   if (this.currentPage < this.totalPages) {
//     this.currentPage++;
//     this.loadProducts();
//   }
// }

// prevPage(): void {
//   if (this.currentPage > 1) {
//     this.currentPage--;
//     this.loadProducts();
//   }
// }
// }
import { Component, OnInit } from '@angular/core';
import { SupermarketService } from '../../services/supermarket.service';
import { StoreService } from '../../services/store.service';
import { Product } from '../../services/supermarket.service';

  interface Supermarket {
    id: number;
    name: string;
 
  }
@Component({
  selector: 'app-results-screen',
  templateUrl: './results-screen.component.html',
  styleUrls: ['./results-screen.component.scss']
})
export class ResultsScreenComponent implements OnInit {
  dailyCategories: { [date: string]: string[] } = {};
  daysList: string[] = [];
  selectedDay: string | null = null;
  selectedCategory: string | null = null;
   supermarkets: Supermarket[] = [];
  selectedSupermarket: Supermarket | null = null;

  products: Product[] = [];
  totalCount = 0;
  currentPage = 1;
  pageSize = 12;

  // Filters
  priceMin: number | null = null;
  priceMax: number | null = null;
  kcalMin: number | null = null;
  kcalMax: number | null = null;
  sortBy = 'priceAsc';

  constructor(
    private supermarketService: SupermarketService,
    private store: StoreService
  ) {}

  ngOnInit(): void {
     this.supermarketService.getSupermarkets().subscribe((markets) => {
   this.supermarkets = markets;
 });
    this.dailyCategories = this.store.getDailyCategories();
    this.daysList = Object.keys(this.dailyCategories);
  }

  selectDay(day: string) {
    this.selectedDay = day;
    this.selectedCategory = null;
    this.products = [];
  }


    onSelectSupermarket(market: Supermarket): void {

    this.selectedSupermarket = market;

  this.currentPage = 1;

  this.loadProducts();}

 

 
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.loadProducts();
  }

  loadProducts() {
    if (!this.selectedSupermarket) return;

    this.supermarketService
      .getProductsBySupermarket(
        this.selectedSupermarket.id,  
        this.currentPage,
        this.pageSize,
        this.selectedCategory,
        this.priceMin,
        this.priceMax,
        this.kcalMin,
        this.kcalMax,
        
      )
      .subscribe(response => {
        this.products = response.items.$values;
        this.totalCount = response.totalCount;
      });
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
