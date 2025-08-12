import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
    constructor() { }
    gender: 'f' | 'm' = 'f';
    age: number = 27;
    height:  number = 173;
    weight: number = 62;

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
