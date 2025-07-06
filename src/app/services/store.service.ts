import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
    gender: 'f' | 'm' = 'f';
    age: number = 27;
    height:  number = 173;
    weight: number = 62;
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

}
