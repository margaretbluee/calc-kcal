import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { UnitConversionService } from './services/unit-conversion.service';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgxSliderModule } from '@angular-slider/ngx-slider'; 
import { BmiCalculatorScreenComponent } from './screens/bmi-calculator-screen/bmi-calculator-screen.component';
import { LoginScreenComponent } from './screens/login-screen/login-screen.component';
import { TestUnitConvertionScreenComponent } from './screens/test-unit-convertion-screen/test-unit-convertion-screen.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppStatesService } from './services/app-states.service';
import { AuthService } from './services/auth.service';
import { BmiCalculationService } from './services/bmi-calculation.service';
import { CommonFlowService } from './services/common-flow.service';
import { LoadingService } from './services/loading.service';
import { LanguageComponent } from './components/language/language.component';
import { CalorieBurnScreenComponent } from './screens/calorie-burn-screen/calorie-burn-screen.component';
import { NgChartsModule } from 'ng2-charts';
import { WeightGoalComponent } from './screens/weight-goal/weight-goal.component';
import { WeightGoalScreenComponent } from './screens/weight-goal-screen/weight-goal-screen.component';
import { SupermarketSelectionScreenComponent } from './screens/supermarket-selection-screen/supermarket-selection-screen.component';
import { BudgetPlannerComponent } from './screens/budget-planner/budget-planner.component';
import { ResultsScreenComponent } from './screens/results-screen/results-screen.component';
import { AlertPopupComponent } from './components/alert-popup/alert-popup.component'; 
import { MatDividerModule } from '@angular/material/divider';
 import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // <-- Import this
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    SpinnerComponent,
    BmiCalculatorScreenComponent,
    LoginScreenComponent,
    TestUnitConvertionScreenComponent,
    LanguageComponent,
    CalorieBurnScreenComponent,
    WeightGoalComponent,
    WeightGoalScreenComponent,
    SupermarketSelectionScreenComponent,
    BudgetPlannerComponent,
     ResultsScreenComponent,
     AlertPopupComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    FormsModule,
    AppRoutingModule,
    NgxSliderModule,
   MatMenuModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatIconModule,
    HttpClientModule,
    NgChartsModule,
    MatDividerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    UnitConversionService,
    AppStatesService,
    AuthService,
    BmiCalculationService,
    CommonFlowService,
    LoadingService,
      NgChartsModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
