import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
    gender: 'f' | 'm' = 'f';
    age: number = 27;
    height:  number = 173;
    weight: number = 62;

    private dailyCategoryPlan: { [date: string]: string[] } = {};
  constructor() { }

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

    setDailyCategories(plan: { [date: string]: string[] }): void {
    this.dailyCategoryPlan = plan;
  }

  getDailyCategories(): { [date: string]: string[] } {
    return this.dailyCategoryPlan;
  }

}
