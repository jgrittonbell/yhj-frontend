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
      foodId: [null],
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
    console.log('🔥 FULL form value before submit:', this.foodForm.value);
    if (this.foodForm.valid) {
      const raw: {
        mealName: string;
        timeEaten: string;
        foods: any[];
      } = this.foodForm.value;

      const foods: FoodEntry[] = raw.foods.map(
        (food: any): FoodEntry => ({
          foodId: food.foodId ?? null,
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

      const request$ = this.editingMeal
        ? this.mealService.updateMeal(this.editingMeal.id, mealData, headers)
        : this.mealService.saveMeal(mealData, headers);

      request$.subscribe({
        next: (response) => {
          console.log(
            `${this.editingMeal ? 'Updated' : 'Saved'} meal:`,
            response
          );
          this.mealSaved = true;
          this.foodForm.reset();
          this.foods.clear();
          this.showAdvanced = [];
          this.showForm = false;
          this.editingMeal = null;
          this.loadMeals();

          setTimeout(() => {
            this.mealSaved = false;
          }, 4000);
        },
        error: (err) => {
          console.error('Error submitting meal:', err);
        },
      });
    }
  }

  editMeal(meal: MealResponse): void {
    this.showForm = true;
    this.editingMeal = meal;

    this.foodForm.patchValue({
      mealName: meal.mealName,
      timeEaten: meal.timeEaten,
    });

    this.foods.clear();
    this.showAdvanced = [];

    meal.foods.forEach((food) => {
      const foodGroup = this.fb.group({
        foodId: [food.foodId ?? null],
        servingSize: [food.servingSize, Validators.required],
        foodName: [food.foodName ?? ''],
        calories: [food.calories ?? null],
        protein: [food.protein ?? null],
        fat: [food.fat ?? null],
        carbs: [food.carbs ?? null],
        cholesterol: [food.cholesterol ?? null],
        sodium: [food.sodium ?? null],
        fiber: [food.fiber ?? null],
        sugar: [food.sugar ?? null],
        addedSugar: [food.addedSugar ?? null],
        vitaminD: [food.vitaminD ?? null],
        calcium: [food.calcium ?? null],
        iron: [food.iron ?? null],
        potassium: [food.potassium ?? null],
        notes: [food.notes ?? null],
      });

      console.log('✅ Added food group to form:', foodGroup.value);
      console.log('✅ Full rebuilt FormArray:', this.foods.value);
      this.foods.push(foodGroup);
      this.showAdvanced.push(true); // show nutrients by default when editing
    });
  }

  deleteMeal(mealId: number): void {
    console.log('Delete meal triggered for ID:', mealId);
    // TODO: call mealService.deleteMeal(mealId) and refresh list
  }
}
