import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestUnitConvertionScreenComponent } from './test-unit-convertion-screen.component';

describe('TestUnitConvertionScreenComponent', () => {
  let component: TestUnitConvertionScreenComponent;
  let fixture: ComponentFixture<TestUnitConvertionScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestUnitConvertionScreenComponent]
    });
    fixture = TestBed.createComponent(TestUnitConvertionScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
