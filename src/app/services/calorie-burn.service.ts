import { Injectable } from '@angular/core';
import { IUserInfo, StoreService } from './store.service';

 
export interface ActivityInput {
  activity: 'walk' | 'run' | 'bike' | 'swim';
  distance: number;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class CalorieBurnService {
  private METS: Record<string, number> = {
    walk: 3.5,
    run: 9.8,
    bike: 7.5,
    swim: 8.0,
  };

 
  constructor(private _store  : StoreService) {
   }

 

calculateTDEE(goal?: 'lose' | 'gain' | 'maintain') : {bmr: number, tdee: number}{
  const user: IUserInfo = this._store.getUserInfo();
  console.log("fetching user info", user )
 
  const bmr = user.gender === 'male'
  ? 10 * user.weight + 6.25 * user.height - 5 * user.age + 5
  : 10 * user.weight + 6.25 * user.height - 5 * user.age - 161;

  const weeklyBurn = this._store.getSummaryWeekly();
  const avgDailyBurn = Math.round(weeklyBurn / 7);
  console.log("sumamry weekly is ", weeklyBurn, "avgDaily burn", avgDailyBurn);
  const tdee = Math.round(bmr + avgDailyBurn);
  console.log("bmr", bmr,"tdee", tdee);

  if(goal){
    let adjustedIntake = tdee;
    if(goal === 'lose') adjustedIntake -= 500;
    if(goal === 'gain') adjustedIntake += 500;
  }

  this._store.setBMR(bmr);
  this._store.setTDEE(tdee);
  return { bmr, tdee}
}

  calculateCalories(weight: number, activity: string, duration: number): number {
    const met = this.METS[activity] || 1;
    return Math.round((duration * met * 3.5 * weight) / 200);
  }

  getWeeklySummary(
    user: IUserInfo,
    weekData: Record<string, ActivityInput>
  ): { daily: { day: string; calories: number }[]; weekly: number } {
    let weeklyTotal = 0;
    const daily = Object.entries(weekData).map(([day, act]) => {
      const calories = this.calculateCalories(user.weight, act.activity, act.duration);
      weeklyTotal += calories;
      return { day, calories };
    });

    return { daily, weekly: weeklyTotal };
  }
}
