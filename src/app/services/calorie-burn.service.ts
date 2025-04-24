import { Injectable } from '@angular/core';

interface CalorieBurnInput {
  gender: 'male' | 'female';
  age: number;
  height: number; // cm
  weight: number; // kg
  activity: 'walk' | 'run' | 'bike' | 'swim';
  distance: number; // km
  duration: number; // minutes
}

@Injectable({ providedIn: 'root' })
export class CalorieBurnService {
  private METS: Record<string, number> = {
    walk: 3.5,
    run: 9.8,
    bike: 7.5,
    swim: 8.0,
  };

  calculateCaloriesBurned(data: CalorieBurnInput): number {
    const { weight, activity, duration } = data;
    const met = this.METS[activity];
    return Math.round((duration * met * 3.5 * weight) / 200);
  }

  getPace(data: CalorieBurnInput): string {
    const pace = data.duration / data.distance;
    const minutes = Math.floor(pace);
    const seconds = Math.round((pace - minutes) * 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} min/km`;
  }

  getSummary(data: CalorieBurnInput): { daily: number; weekly: number; pace: string } {
    const daily = this.calculateCaloriesBurned(data);
    const weekly = daily * 7;
    const pace = this.getPace(data);
    return { daily, weekly, pace };
  }
}
