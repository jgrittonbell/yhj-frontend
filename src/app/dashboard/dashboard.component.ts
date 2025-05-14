import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartDataset, ChartOptions } from 'chart.js';
import { MealService } from '../services/meal.service';
import { MealResponse } from '../interfaces/meal-response';
import { GlucoseService } from '../services/glucose.service';
import { GlucoseReading } from '../interfaces/glucose-reading';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  recentMeals: MealResponse[] = [];
  allReadings: GlucoseReading[] = [];
  selectedHours = 3;
  rangeOptions = [24, 12, 6, 3, 1];

  glucoseChartLabels: string[] = [];
  glucoseChartData: ChartDataset[] = [];
  glucoseChartOptions: ChartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { title: { display: true, text: 'Time' } },
      y: { title: { display: true, text: 'Glucose Level (mg/dL)' } },
    },
  };

  constructor(
    private router: Router,
    private mealService: MealService,
    private glucoseService: GlucoseService
  ) {}

  ngOnInit(): void {
    this.loadRecentMeals();
    this.loadReadings();
  }

  loadRecentMeals(): void {
    this.mealService.getAllMeals().subscribe((meals) => {
      this.recentMeals = meals
        .sort((a, b) => b.timeEaten.localeCompare(a.timeEaten))
        .slice(0, 5);
    });
  }

  loadReadings(): void {
    this.glucoseService.getAllReadings().subscribe((readings) => {
      this.allReadings = readings.sort((a, b) =>
        b.measurementTime.localeCompare(a.measurementTime)
      );
      this.setRange(this.selectedHours);
    });
  }

  setRange(hours: number): void {
    this.selectedHours = hours;

    const now = new Date();
    const filtered = this.allReadings.filter((r) => {
      const time = new Date(r.measurementTime);
      return now.getTime() - time.getTime() <= hours * 60 * 60 * 1000;
    });

    this.glucoseChartLabels = filtered.map((r) =>
      new Date(r.measurementTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    );

    this.glucoseChartData = [
      { data: filtered.map((r) => r.glucoseLevel), label: 'Glucose mg/dL' },
    ];
  }

  goToAddMeal(): void {
    this.router.navigate(['/food-journal'], { state: { openForm: true } });
  }

  goToAddReading(): void {
    this.router.navigate(['/glucose-journal'], { state: { openForm: true } });
  }
}
