import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { AppStatesService } from './app-states.service';
import { Router } from '@angular/router';
import { APP_STATES } from '../models/appStates.model';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonFlowService implements OnInit, OnDestroy {
  onStateChange?: Subscription;
  CLASSNAME: string = 'CommonFlowService';

  constructor(
    private readonly _appStatesService: AppStatesService,
    private _router: Router,) {
    this.onStateChange = this._appStatesService.onStateChanged().subscribe((value) => {
      this.execute(value);
    });
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


  execute(state: number) {
    console.log('Current state: ', state);

    switch (state) {
      case APP_STATES.ADD_NEW_USER:

        break;

      case APP_STATES.AUTHENTICATE_USER:
        console.log(this.CLASSNAME, "[execute]", "[common flow started]");
        this._router.navigate(['login']);

        break;

      case APP_STATES.BMI_CALCULATION:
        console.log(this.CLASSNAME, "[execute]", "[bmi calculator]");
        this._router.navigate(['login']);
        break;

      case APP_STATES.EXERSICE:

        break;

      case APP_STATES.WEIGHT_GOAL:

        break;

      case APP_STATES.EATING_HABITS:

        break;

      case APP_STATES.INTOLERANCE_AND_HEALTH_CHECK:

        break;

      case APP_STATES.SUPERMARKETS_OF_PREFERENCE:

        break;

      case APP_STATES.BADGET_LIMIT_INPUT:

        break;

      case APP_STATES.FILTERED_RESULTS:

        break;

      case APP_STATES.PROPOSALS:

        break;
    }
  }

  ngOnDestroy(): void {
    this.onStateChange?.unsubscribe();
  }

}
