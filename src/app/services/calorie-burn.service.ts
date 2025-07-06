import { Injectable } from '@angular/core';

interface UserInfo {
  gender: 'male' | 'female';
  age: number;
  height: number;
  weight: number;
}

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

  calculateCalories(weight: number, activity: string, duration: number): number {
    const met = this.METS[activity] || 1;
    return Math.round((duration * met * 3.5 * weight) / 200);
  }

  getWeeklySummary(
    user: UserInfo,
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
