import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartData } from 'chart.js';

@Component({
  selector: 'app-weight-goal-screen',
  templateUrl: './weight-goal-screen.component.html',
  styleUrls: ['./weight-goal-screen.component.scss']
})
export class WeightGoalScreenComponent implements OnInit {
  goalType: 'lose' | 'gain' = 'lose';
  weightAmount: number = 4;
  timeInWeeks: number = 3;
  currentWeight: number = 70;  
  kcalPerKg: number = 7700;

  dailyKcalChange: number = 0;
  chartData: { kcal: number }[] = [];
  chartLabels: string[] = [];
  chartDatasets: ChartData<'line'>['datasets'] = [];
  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      y: { beginAtZero: false }
    }
  };

  ngOnInit(): void {
    this.calculate();
  }

  calculate(): void {
    if (this.weightAmount > 0 && this.timeInWeeks > 0) {
      const totalKcal = this.weightAmount * this.kcalPerKg;
      this.dailyKcalChange = Math.round(totalKcal / (this.timeInWeeks * 7));

      this.chartData = Array.from({ length: this.timeInWeeks }, (_, i) => {
        const weeklyChange = (this.dailyKcalChange * 7) * (i + 1);
        const weightChange = weeklyChange / this.kcalPerKg;
        return {
          kcal: this.goalType === 'lose'
            ? this.currentWeight - weightChange
            : this.currentWeight + weightChange
        };
      });

      this.chartLabels = this.chartData.map((_, i) => `Week ${i + 1}`);
      this.chartDatasets = [
        {
          label: 'Estimated Weight (kg)',
          data: this.chartData.map(item => item.kcal),
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          tension: 0.4
        }
      ];
    } else {
      this.dailyKcalChange = 0;
      this.chartData = [];
      this.chartLabels = [];
      this.chartDatasets = [];
    }
  }
}
