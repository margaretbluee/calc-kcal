import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightGoalComponent } from './weight-goal.component';

describe('WeightGoalComponent', () => {
  let component: WeightGoalComponent;
  let fixture: ComponentFixture<WeightGoalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeightGoalComponent]
    });
    fixture = TestBed.createComponent(WeightGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
