import { Injectable } from '@angular/core';
import { Product } from './supermarket.service';
import { Supermarket } from '../screens/supermarket-selection-screen/supermarket-selection-screen.component';
interface ChosenProduct {
  product: Product;
  day: string;
}
 export interface IUserInfo{gender: 'male' | 'female' | undefined,
  age: number,
  weight: number,
  height: number,
  role?: 'sUser' | 'rUser' | 'admin'
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
    sumamryWeekly = 0;
    bmr: number = 0;
    tdee: number = 0;
     private chosen : { product: Product; day: string }[] = [];
private userInfo :IUserInfo  = {gender: undefined, age: 0, height: 0 , weight: 0, role: 'rUser'};


    supermarketsNames: string[] = [];
    supermarkets: Supermarket[] =[];


setSupermarketsNames(sm: string[]): void {
  this.supermarketsNames = sm;
}
setSupermarkets(sm: Supermarket[]): void {
  this.supermarkets = sm;
}

getSupermarketsNames(): string[]{
  return this.supermarketsNames;
}
getSupermarkets(): Supermarket[]{
  return this.supermarkets;
}
getUserInfo() : IUserInfo {
  return this.userInfo;
}

serUserInfo(user: IUserInfo){
  this.userInfo = user;
}

setRole(role: 'sUser' | 'rUser' | 'admin') {
  this.userInfo = {
    ...this.userInfo, // keep existing values
    role: role        // override only role
  };
}

getRole(){
  return this.userInfo.role;
}
getBMR(){
  return this.bmr;
}

setBMR(bmr: number){
  this.bmr = bmr;
}

getTDEE(){
  return this.tdee;
}

setTDEE(tdee: number){
  this.tdee = tdee;
}

getSummaryWeekly(){
  return this.sumamryWeekly;
}

setSummaryWeekly(sumWeekly: number){
  this.sumamryWeekly = sumWeekly;
}


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
clearAll(): void {
 
  this.gender = 'f';
  this.age = 27;
  this.height = 173;
  this.weight = 62;
  this.sumamryWeekly = 0;
  this.bmr = 0;
  this.tdee = 0;

 
  this.chosen = [];
  this.userInfo = { gender: undefined, age: 0, height: 0, weight: 0, role: 'rUser' };
  this.supermarketsNames = [];
  this.supermarkets = [];
  this.dailyCategoryPlan = {};

 
  this.budget = null;
  this.daysCount = null;
}

}
