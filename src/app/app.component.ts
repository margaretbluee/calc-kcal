import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStatesService } from './services/app-states.service';
import { APP_STATES } from './models/appStates.model';
import { CommonFlowService } from './services/common-flow.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'calc-kcal';
  CLASSNAME: string = 'AppComponent';

  constructor(
    private _appStateService: AppStatesService,
    private _commonFlowService: CommonFlowService
  ) {

  }

  ngOnInit(): void {
    console.log(this.CLASSNAME, "common flow begins");

    this._appStateService.currentState(APP_STATES.BADGET_LIMIT_INPUT);
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }


}
