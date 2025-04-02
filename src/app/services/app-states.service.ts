import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppStatesService {
  private onStateChange = new Subject<number>();
  constructor() { }

  currentState(state: number) {
    this.onStateChange.next(state);
  }

  onStateChanged() {
    return this.onStateChange;
  }
}
