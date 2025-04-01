import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {


  isLoaded = false;

  constructor(private _loadingService: LoadingService) { }

  ngOnInit() {
    this._loadingService.loading.subscribe(loading => {//set up listener
      this.isLoaded = loading;
    });
  }

}
