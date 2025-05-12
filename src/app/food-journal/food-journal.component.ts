import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormsModule,
  FormArray,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthHeaderService } from '../auth-header.service';
import { MealService } from '../services/meal.service';
import { FoodEntry } from '../interfaces/food-entry';
import { MealResponse } from '../interfaces/meal-response';
import { NutritionixService } from '../services/nutritionix.service';
import { NutritionixParsedFood } from '../interfaces/nutritionix-parsed.model';
import { NutritionixFoodDetail } from '../interfaces/nutritionix-detail.model';
import { NUTRIENT_MAP } from '../constants/nutrient-map';

type NutritionixSuggestion =
  | NutritionixParsedFood
  | { food_name: string; nix_item_id?: string };

@Component({
  standalone: true,
  selector: 'app-food-journal',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './food-journal.component.html',
  styleUrls: ['./food-journal.component.css'],
})
export class FoodJournalComponent implements OnInit {
  foodForm: FormGroup;

  showAdvanced: boolean[] = [];
  meals: MealResponse[] = [];

  mealSaved: boolean = false;
  mealUpdated: boolean = false;
  mealDeleted: boolean = false;
  showForm: boolean = false;

  editingMeal: MealResponse | null = null;

  filterText: string = '';
  sortColumn: string = 'timeEaten';
  sortDirection: 'asc' | 'desc' = 'desc';

  searchTerm: string = '';
  suggestions: NutritionixSuggestion[] = [];
  searching: boolean = false;

  constructor(
    private fb: FormBuilder,
    private mealService: MealService,
    private authHeaderService: AuthHeaderService,
    private nutritionixService: NutritionixService
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

  /**
   * Lifecycle hook that runs once after component initialization.
   * Used to load all meals and clear stale delete messages.
   */
  ngOnInit(): void {
    this.mealDeleted = false;
    this.sortColumn = 'timeEaten';
    this.sortDirection = 'desc';
    this.loadMeals();
    //this.debugSearch();
    //this.debugParse();
    //this.debugGetFoodDetails();
  }

  /**
   * Fetches all meals from the API for display in the journal.
   */
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

  /**
   * Calculates the total calories for a given meal based on its foods.
   *
   * @param meal The meal whose calories should be summed.
   * @returns The total calorie count for the meal.
   */
  getTotalCalories(meal: MealResponse): number {
    return meal.foods.reduce((total, food) => {
      const calories = food.calories ?? 0;
      return total + calories;
    }, 0);
  }

  /**
   * Prepares the form for creating a new meal (not editing).
   * Resets success flags and form state.
   */
  startNewMeal(): void {
    this.mealSaved = false; // Clear success message
    this.showForm = true;
    this.editingMeal = null; // Ensure it's a new meal, not an edit
  }

  /**
   * Adds a new food item form group to the foods FormArray.
   */
  addFood(): void {
    const foodGroup = this.fb.group({
      foodId: [null],
      servingSize: [null, [Validators.required, Validators.min(0)]],
      foodName: ['', Validators.required],
      calories: [null, [Validators.required, Validators.min(0)]],
      fat: [null, [Validators.required, Validators.min(0)]],
      protein: [null, [Validators.required, Validators.min(0)]],
      carbs: [null, [Validators.required, Validators.min(0)]],
      cholesterol: [null, Validators.min(0)],
      sodium: [null, Validators.min(0)],
      fiber: [null, Validators.min(0)],
      sugar: [null, Validators.min(0)],
      addedSugar: [null, Validators.min(0)],
      vitaminD: [null, Validators.min(0)],
      calcium: [null, Validators.min(0)],
      iron: [null, Validators.min(0)],
      potassium: [null, Validators.min(0)],
      notes: [''],
    });

    this.foods.push(foodGroup);
    this.showAdvanced.push(false); // sync toggle array
  }

  /**
   * Removes a food item from the FormArray and advanced toggle list.
   *
   * @param index The index of the food item to remove.
   */
  removeFood(index: number): void {
    this.foods.removeAt(index);
    this.showAdvanced.splice(index, 1); // sync toggle array
  }

  /**
   * Toggles the visibility of advanced nutrient inputs for a food entry.
   *
   * @param index The index of the food in the form array.
   */
  toggleAdvanced(index: number): void {
    this.showAdvanced[index] = !this.showAdvanced[index];
  }

  /**
   * Cancels the form entry process and resets the form state.
   */
  cancelForm(): void {
    this.showForm = false;
    this.editingMeal = null;
    this.foodForm.reset();
    this.foods.clear();
    this.showAdvanced = [];
  }

  /**
   * Handles submission of the form for creating or updating a meal.
   * Validates data, sends the request, and shows confirmation messages.
   */
  onSubmit(): void {
    console.log('FULL form value before submit:', this.foodForm.value);
    this.mealSaved = false;
    this.mealUpdated = false;

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

          this.foodForm.reset();
          this.foods.clear();
          this.showAdvanced = [];
          this.showForm = false;
          this.editingMeal = null;

          if (this.editingMeal) {
            this.mealUpdated = true;
          } else {
            this.mealSaved = true;
          }

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

  /**
   * Loads a meal into the form for editing.
   *
   * @param meal The meal object to be edited.
   */
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

      console.log('Added food group to form:', foodGroup.value);
      console.log('Full rebuilt FormArray:', this.foods.value);
      this.foods.push(foodGroup);
      this.showAdvanced.push(true); // show nutrients by default when editing
    });
  }

  /**
   * Deletes a meal by its ID after confirmation.
   *
   * @param mealId The ID of the meal to delete.
   */
  deleteMeal(mealId: number): void {
    if (!confirm('Are you sure you want to delete this meal?')) {
      return;
    }

    const headers = this.authHeaderService.getAuthHeaders();

    this.mealService.deleteMeal(mealId, headers).subscribe({
      next: () => {
        console.log(`Meal ${mealId} deleted`);
        this.mealDeleted = true;
        this.loadMeals(); // Refresh list
      },
      error: (err) => {
        console.error(`Failed to delete meal ${mealId}:`, err);
      },
    });
  }

  get sortedMeals(): MealResponse[] {
    const filtered = this.filterText.trim()
      ? this.meals.filter(
          (meal) =>
            meal.mealName
              .toLowerCase()
              .includes(this.filterText.toLowerCase()) ||
            meal.timeEaten
              .toLowerCase()
              .includes(this.filterText.toLowerCase()) ||
            meal.foods.some((f) =>
              f.foodName?.toLowerCase().includes(this.filterText.toLowerCase())
            )
        )
      : this.meals;

    return [...filtered].sort((a, b) => {
      const valA = (a as any)[this.sortColumn];
      const valB = (b as any)[this.sortColumn];

      return this.sortDirection === 'asc'
        ? valA > valB
          ? 1
          : -1
        : valA < valB
        ? 1
        : -1;
    });
  }
  setSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  debugSearch(): void {
    const headers = this.authHeaderService.getAuthHeaders();
    this.nutritionixService
      .searchAllFoods('apple', headers)
      .subscribe((response) => {
        console.log('Nutritionix Search Response:', response);
      });
  }

  debugParse(): void {
    const headers = this.authHeaderService.getAuthHeaders();
    this.nutritionixService
      .parseNutrientsFromQuery('1 apple', headers)
      .subscribe((response) => {
        console.log('Nutritionix Parsed Nutrients Response:', response);
      });
  }

  debugGetFoodDetails(): void {
    const headers = this.authHeaderService.getAuthHeaders();
    const testId = '5c417c43f7b925f079302de7';
    this.nutritionixService
      .getFoodDetails(testId, headers)
      .subscribe((response) => {
        console.log('Nutritionix Food Detail Response:', response);
      });
  }

  onSearchChange(): void {
    const headers: HttpHeaders = this.authHeaderService.getAuthHeaders();

    if (this.searchTerm.length > 2) {
      this.nutritionixService
        .searchAllFoods(this.searchTerm, headers)
        .subscribe((response) => {
          this.suggestions = [...response.common, ...response.branded];
          this.searching = true;
        });
    } else {
      this.suggestions = [];
      this.searching = false;
    }
  }

  onSearchBlur(): void {
    // Delay clearing to allow click event to finish
    setTimeout(() => {
      this.searching = false;
    }, 200);
  }

  selectFood(food: NutritionixSuggestion): void {
    const headers: HttpHeaders = this.authHeaderService.getAuthHeaders();

    this.searchTerm = food.food_name;
    this.suggestions = [];
    this.searching = false;

    if ('nix_item_id' in food && food.nix_item_id) {
      // Branded food → fetch detail
      this.nutritionixService
        .getFoodDetails(food.nix_item_id, headers)
        .subscribe((detail: NutritionixFoodDetail) => {
          this.addFoodFromNutritionix(detail);
        });
    } else {
      // Common food → parse
      this.nutritionixService
        .parseNutrientsFromQuery(food.food_name, headers)
        .subscribe((parsed) => {
          if (parsed.length > 0) {
            this.addFoodFromNutritionix(parsed[0]);
          }
        });
    }
  }

  addFoodFromNutritionix(
    food: NutritionixParsedFood | NutritionixFoodDetail
  ): void {
    const controls: { [key: string]: any } = {
      foodName: food.food_name,
      servingSize: food.serving_qty ?? 1,
      notes: food.nf_ingredient_statement ?? '',
    };

    const fullNutrients = food.full_nutrients ?? [];

    // 1. Populate from full_nutrients using NUTRIENT_MAP
    for (const nutrient of fullNutrients) {
      const mapEntry = NUTRIENT_MAP[nutrient.attr_id];
      if (mapEntry?.key) {
        controls[mapEntry.key] = nutrient.value;
      }
    }

    // 2. Fallbacks from flat fields
    const FLAT_FIELD_MAP: Record<string, keyof NutritionixParsedFood> = {
      calories: 'nf_calories',
      protein: 'nf_protein',
      fat: 'nf_total_fat',
      carbs: 'nf_total_carbohydrate',
      sugar: 'nf_sugars',
      addedSugar: 'nf_added_sugars',
      fiber: 'nf_dietary_fiber',
      sodium: 'nf_sodium',
      cholesterol: 'nf_cholesterol',
      potassium: 'nf_potassium',
      vitaminD: 'nf_vitamin_d_mcg',
      calcium: 'nf_calcium_mg',
      iron: 'nf_iron_mg',
    };

    for (const [formKey, flatKey] of Object.entries(FLAT_FIELD_MAP)) {
      if (controls[formKey] === undefined && food[flatKey] !== undefined) {
        controls[formKey] = food[flatKey];
      }
    }

    // 3. Guarantee all required keys exist in form group
    const requiredKeys = Object.keys(FLAT_FIELD_MAP);
    for (const key of requiredKeys) {
      if (!(key in controls)) {
        controls[key] = null;
      }
    }

    this.foods.push(this.fb.group(controls));
  }
}
