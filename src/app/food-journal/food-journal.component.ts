import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormArray,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthHeaderService } from '../auth-header.service';
import { MealService } from '../services/meal.service';
import { FoodEntry } from '../interfaces/food-entry';
import { MealResponse } from '../interfaces/meal-response';

@Component({
  standalone: true,
  selector: 'app-food-journal',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './food-journal.component.html',
  styleUrls: ['./food-journal.component.css'],
})
export class FoodJournalComponent implements OnInit {
  foodForm: FormGroup;

  showAdvanced: boolean[] = [];
  meals: MealResponse[] = [];

  mealSaved: boolean = false;
  showForm: boolean = false;

  editingMeal: MealResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private mealService: MealService,
    private authHeaderService: AuthHeaderService
  ) {
    this.foodForm = this.fb.group({
      mealName: ['', Validators.required],
      timeEaten: ['', Validators.required],
      foods: this.fb.array([]),
    });
  }

  get foods(): FormArray {
    return this.foodForm.get('foods') as FormArray;
  }

  ngOnInit(): void {
    this.loadMeals();
  }

  loadMeals(): void {
    const headers = this.authHeaderService.getAuthHeaders();

    this.mealService.getAllMeals(headers).subscribe({
      next: (meals: MealResponse[]) => {
        console.log('Meals from API:', meals);
        this.meals = meals;
      },
      error: (err) => {
        console.error('Failed to fetch meals:', err);
      },
    });
  }

  getTotalCalories(meal: MealResponse): number {
    return meal.foods.reduce((total, food) => {
      const calories = food.calories ?? 0;
      return total + calories;
    }, 0);
  }

  startNewMeal(): void {
    this.mealSaved = false; // Clear success message
    this.showForm = true;
    this.editingMeal = null; // Ensure it's a new meal, not an edit
  }

  addFood(): void {
    const foodGroup = this.fb.group({
      servingSize: [null, Validators.required],
      foodName: [''],
      calories: [''],
      protein: [''],
      fat: [''],
      carbs: [''],
      cholesterol: [''],
      sodium: [''],
      fiber: [''],
      sugar: [''],
      addedSugar: [''],
      vitaminD: [''],
      calcium: [''],
      iron: [''],
      potassium: [''],
      notes: [''],
    });

    this.foods.push(foodGroup);
    this.showAdvanced.push(false); // sync toggle array
  }

  removeFood(index: number): void {
    this.foods.removeAt(index);
    this.showAdvanced.splice(index, 1); // sync toggle array
  }

  toggleAdvanced(index: number): void {
    this.showAdvanced[index] = !this.showAdvanced[index];
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingMeal = null;
    this.foodForm.reset();
    this.foods.clear();
    this.showAdvanced = [];
  }
  onSubmit(): void {
    if (this.foodForm.valid) {
      const raw: {
        mealName: string;
        timeEaten: string;
        foods: any[];
      } = this.foodForm.value;

      const foods: FoodEntry[] = raw.foods.map(
        (food: any): FoodEntry => ({
          // foodId intentionally omitted
          servingSize: food.servingSize,
          foodName: food.foodName ?? null,
          calories: food.calories ?? null,
          protein: food.protein ?? null,
          fat: food.fat ?? null,
          carbs: food.carbs ?? null,
          cholesterol: food.cholesterol ?? null,
          sodium: food.sodium ?? null,
          fiber: food.fiber ?? null,
          sugar: food.sugar ?? null,
          addedSugar: food.addedSugar ?? null,
          vitaminD: food.vitaminD ?? null,
          calcium: food.calcium ?? null,
          iron: food.iron ?? null,
          potassium: food.potassium ?? null,
          notes: food.notes ?? null,
        })
      );

      const mealData = {
        mealName: raw.mealName,
        timeEaten: raw.timeEaten,
        foods: foods,
      };

      const headers = this.authHeaderService.getAuthHeaders();

      this.mealService.saveMeal(mealData, headers).subscribe({
        next: (response) => {
          console.log('Meal saved successfully:', response);
          this.mealSaved = true;
          this.foodForm.reset();
          this.foods.clear();
          this.showAdvanced = [];
          this.showForm = false;
          this.loadMeals();
        },
        error: (err) => {
          console.error('Error saving meal:', err);
        },
      });
    }
  }

  editMeal(meal: MealResponse): void {
    console.log('Edit meal triggered:', meal);
    // TODO: repopulate the form with this meal’s data
  }

  deleteMeal(mealId: number): void {
    console.log('Delete meal triggered for ID:', mealId);
    // TODO: call mealService.deleteMeal(mealId) and refresh list
  }
}
