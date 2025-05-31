import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightGoalScreenComponent } from './weight-goal-screen.component';

describe('WeightGoalScreenComponent', () => {
  let component: WeightGoalScreenComponent;
  let fixture: ComponentFixture<WeightGoalScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeightGoalScreenComponent]
    });
    fixture = TestBed.createComponent(WeightGoalScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
