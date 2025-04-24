import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { TestUnitConvertionScreenComponent } from './screens/test-unit-convertion-screen/test-unit-convertion-screen.component';

import { BmiCalculatorScreenComponent } from './screens/bmi-calculator-screen/bmi-calculator-screen.component';
import { CalorieBurnScreenComponent } from './screens/calorie-burn-screen/calorie-burn-screen.component';

const routes: Routes = [
  { path: '', redirectTo: 'login-screen', pathMatch: 'full' }, // Redirect to login
  { path: 'login-screen', component: LoginScreenComponent },
  { path: 'test-unit-convertion-screen', component: TestUnitConvertionScreenComponent },
  { path: 'bmi-calculator-screen', component: BmiCalculatorScreenComponent },
  { path: 'calorie-burn-screen', component: CalorieBurnScreenComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
