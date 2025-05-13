import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartDataset, ChartOptions } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { AuthHeaderService } from '../auth-header.service';
import { GlucoseService } from '../services/glucose.service';
import { MealService } from '../services/meal.service';

import { GlucoseReading } from '../interfaces/glucose-reading';
import { MealResponse } from '../interfaces/meal-response';

Chart.register(ChartDataLabels);

@Component({
  selector: 'app-data-insights',
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './data-insights.component.html',
  styleUrl: './data-insights.component.css',
})
export class DataInsightsComponent implements OnInit {
  // ================================
  // Dependencies & Directives
  // ================================

  /** Reference to chart component for manual redraw */
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  /** Chart.js data label plugin reference */
  public dataLabelPlugin = ChartDataLabels;

  // ================================
  // Constructor
  // ================================

  constructor(
    private mealService: MealService,
    private glucoseService: GlucoseService,
    private authHeaderService: AuthHeaderService
  ) {}

  // ================================
  // Lifecycle
  // ================================

  /** Called once when component is initialized */
  ngOnInit(): void {
    this.loadGlucoseData();
    this.loadFoodInsights();
  }

  // ================================
  // Glucose Insights
  // ================================

  /** Session-based glucose thresholds */
  public targetHigh = 180;
  public targetLow = 70;

  /** Days to look back when analyzing glucose readings */
  public glucoseRangeDays = 30;

  /** Bar chart labels for glucose range chart */
  public glucoseLabels: string[] = ['Below Range', 'In Range', 'Above Range'];

  /** Glucose bar chart configuration */
  public glucoseRangeOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Average % of Time in Range' },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };

  /** Glucose bar chart data container */
  public glucoseRangeChartData = {
    labels: this.glucoseLabels,
    datasets: [
      {
        label: 'Time in Range',
        data: [0, 0, 0],
        backgroundColor: ['#dc3545', '#198754', '#ffc107'],
      },
    ],
  };

  /**
   * Load glucose readings from API and calculate time in range percentages
   */
  loadGlucoseData(): void {
    console.log(
      `Loading glucose data for last ${this.glucoseRangeDays} days...`
    );
    const headers = this.authHeaderService.getAuthHeaders();

    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - this.glucoseRangeDays);

    this.glucoseService
      .getAllReadings(headers)
      .subscribe((readings: GlucoseReading[]) => {
        console.log('Total readings received:', readings.length);

        const recentReadings = readings.filter((r) => {
          const time = new Date(r.measurementTime);
          return time >= startDate && time <= now;
        });

        console.log('Filtered recent readings:', recentReadings.length);

        const total = recentReadings.length;
        if (total === 0) {
          this.glucoseRangeChartData = {
            labels: this.glucoseLabels,
            datasets: [
              {
                label: 'Time in Range',
                data: [0, 0, 0],
                backgroundColor: ['#dc3545', '#198754', '#ffc107'],
              },
            ],
          };
          this.chart?.update();
          return;
        }

        let below = 0,
          inRange = 0,
          above = 0;
        for (const reading of recentReadings) {
          const value = reading.glucoseLevel;
          if (value < this.targetLow) below++;
          else if (value > this.targetHigh) above++;
          else inRange++;
        }

        const belowPct = Math.round((below / total) * 100);
        const inRangePct = Math.round((inRange / total) * 100);
        const abovePct = Math.round((above / total) * 100);

        console.log('Computed %:', { belowPct, inRangePct, abovePct });

        this.glucoseRangeChartData = {
          labels: [...this.glucoseLabels],
          datasets: [
            {
              label: 'Time in Range',
              data: [belowPct, inRangePct, abovePct],
              backgroundColor: ['#dc3545', '#198754', '#ffc107'],
            },
          ],
        };

        this.chart?.update();
      });
  }

  // ================================
  // Food Insights
  // ================================

  /** Pie chart labels for macronutrients */
  public macroLabels: string[] = ['Carbs', 'Protein', 'Fat'];

  /** Pie chart options for macro breakdown */
  public macroChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const dataset = tooltipItem.dataset;
            const value = dataset.data[tooltipItem.dataIndex] as number;
            const total = (dataset.data as number[]).reduce(
              (sum, val) => sum + val,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${tooltipItem.label}: ${percentage}% (${value}g)`;
          },
        },
      },
    },
  };

  /** Macro pie chart data container */
  public macroChartData: { labels: string[]; datasets: ChartDataset<'pie'>[] } =
    {
      labels: this.macroLabels,
      datasets: [],
    };

  /** Bar chart options for average daily calories */
  public calorieChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    indexAxis: 'y',
    plugins: {
      legend: { position: 'bottom' },
      title: { display: false },
    },
    scales: {
      x: { beginAtZero: true, suggestedMax: 3000 },
      y: { display: false },
    },
  };

  /** Bar chart data container for average daily calories */
  public calorieChartData: {
    labels: string[];
    datasets: ChartDataset<'bar'>[];
  } = {
    labels: ['Calories'],
    datasets: [],
  };

  loadFoodInsights(): void {
    console.log('Loading food insights for last 30 days');
    const headers = this.authHeaderService.getAuthHeaders();

    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - 30);

    this.mealService.getAllMeals(headers).subscribe((meals: MealResponse[]) => {
      const filteredMeals = meals.filter((meal) => {
        const mealDate = new Date(meal.timeEaten);
        return mealDate >= startDate && mealDate <= now;
      });

      console.log('Filtered meals (last 30 days):', filteredMeals.length);

      let totalCarbs = 0;
      let totalProtein = 0;
      let totalFat = 0;
      let totalCalories = 0;

      const uniqueMealDays = new Set<string>();

      for (const meal of filteredMeals) {
        if (!meal.foods || meal.foods.length === 0) continue;

        let mealCarbs = 0;
        let mealProtein = 0;
        let mealFat = 0;
        let mealCalories = 0;

        for (const food of meal.foods) {
          mealCarbs += food.carbs || 0;
          mealProtein += food.protein || 0;
          mealFat += food.fat || 0;
          mealCalories += food.calories || 0;
        }

        if (mealCarbs + mealProtein + mealFat === 0) continue;

        totalCarbs += mealCarbs;
        totalProtein += mealProtein;
        totalFat += mealFat;
        totalCalories += mealCalories;

        const dayKey = new Date(meal.timeEaten).toISOString().split('T')[0];
        uniqueMealDays.add(dayKey);
      }

      const totalMacros = totalCarbs + totalProtein + totalFat;
      const macroData =
        totalMacros > 0
          ? [
              Math.round((totalCarbs / totalMacros) * 100),
              Math.round((totalProtein / totalMacros) * 100),
              Math.round((totalFat / totalMacros) * 100),
            ]
          : [0, 0, 0];

      const daysWithMeals = uniqueMealDays.size || 1;
      const avgCalories = Math.round(totalCalories / daysWithMeals);

      console.log('Macro %:', macroData);
      console.log('Avg daily calories:', avgCalories);

      this.macroChartData = {
        labels: [...this.macroLabels],
        datasets: [
          {
            data: macroData,
            label: 'Macros',
            backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
          },
        ],
      };

      this.calorieChartData = {
        labels: ['Calories'],
        datasets: [
          {
            label: 'Average Daily Calories',
            data: [avgCalories],
            backgroundColor: '#007bff',
          },
          {
            label: 'Calorie Goal',
            data: [2000],
            backgroundColor: '#ffc107',
          },
        ],
      };

      this.chart?.update();
    });
  }
}
