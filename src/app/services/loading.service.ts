import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  //set initial value& subs up to date
  private _loadingSubject = new BehaviorSubject<boolean>(false);
  public loading = this._loadingSubject.asObservable();//convert to obs

  show() {
    this._loadingSubject.next(true);
  }

  hide() {
    this._loadingSubject.next(false);
  }
}
