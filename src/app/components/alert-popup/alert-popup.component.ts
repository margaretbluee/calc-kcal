import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-alert-popup',
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.scss']
})
export class AlertPopupComponent implements OnInit, OnDestroy {
  @Input() message: string = '';
  @Input() status: 'warning' | 'error' | 'info' = 'info';
  @Input() duration = 5000; // default 5 seconds

  @Output() close = new EventEmitter<void>();

  progress = 100; // percent progress for the bar
  private intervalId: any;

  get backgroundColor(): string {
    switch(this.status) {
      case 'warning': return '#ffa600a8'; // orange
      case 'error': return '#ff4036c2';   // red
      case 'info': return '#2ecc40ac';    // green
      default: return '#2ECC40';
    }
  }

  ngOnInit() {
    const stepTime = 50; // ms
    const totalSteps = this.duration / stepTime;
    let currentStep = 0;

    this.intervalId = setInterval(() => {
      currentStep++;
      this.progress = 100 - (currentStep / totalSteps) * 100;

      if (this.progress <= 0) {
        this.closePopup();
      }
    }, stepTime);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  closePopup() {
    clearInterval(this.intervalId);
    this.close.emit();
  }
}
