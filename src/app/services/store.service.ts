import { Injectable } from '@angular/core';
import { Product } from './supermarket.service';
interface ChosenProduct {
  product: Product;
  day: string;
}
@Injectable({
  providedIn: 'root'
})


export class StoreService {
    constructor() { }
    gender: 'f' | 'm' = 'f';
    age: number = 27;
    height:  number = 173;
    weight: number = 62;
 private chosen : { product: Product; day: string }[] = [];

  getChosenProducts(): ChosenProduct[] {
    return this.chosen;
  }

  addProduct(product: Product, day: string) {
    if (!this.chosen.some(p => p.product.id === product.id && p.day === day)) {
      this.chosen.push({ product, day });
    }
  }

  removeProduct(productId: number, day: string) {
    this.chosen = this.chosen.filter(
      p => !(p.product.id === productId && p.day === day)
    );
  }

  isChosen(productId: number, day: string): boolean {
    return this.chosen.some(p => p.product.id === productId && p.day === day);
  }

  getTotalPrice(): number {
    return this.chosen.reduce((sum, cp) => sum + cp.product.price, 0);
  }
    private budget: number | null = null;
private daysCount: number | null = null;
setBudget(budget: number): void {
  this.budget = budget;
}

getBudget(): number | null {
  return this.budget;
}

setDaysCount(count: number): void {
  this.daysCount = count;
}

getDaysCount(): number | null {
  return this.daysCount;
}
    private dailyCategoryPlan: { [date: string]: string[] } = {};

    setDailyCategories(plan: { [date: string]: string[] }): void {
    this.dailyCategoryPlan = plan;
  }

  getDailyCategories(): { [date: string]: string[] } {
    return this.dailyCategoryPlan;
  }

  getGender(): 'f' | 'm'{
    return this.gender;
  }

  setGender(gender: 'f' | 'm'): void{
    this.gender = gender;
  }

    getAge(): number{
    return this.age;
  }

  setAge(age: number): void{
    this.age = age;
  }

    getHeight(): number{
    return this.height;
  }

  setHeight(h: number): void{
    this.height = h;
  }


    getWeight(): number{
    return this.weight;
  }

  setWeight(w: number): void{
    this.weight = w;
  }


}
