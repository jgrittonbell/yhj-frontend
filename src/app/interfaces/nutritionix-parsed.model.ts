export interface NutritionixAltMeasure {
  serving_weight: number;
  measure: string;
  seq: number | null;
  qty: number;
}

export interface NutritionixFullNutrient {
  attr_id: number;
  value: number;
}

export interface NutritionixPhoto {
  is_user_uploaded: boolean;
  thumb: string;
  highres: string;
}

export interface NutritionixParsedFood {
  food_name: string;
  note: string | null;
  nf_saturated_fat: number;
  metadata: Record<string, any>;
  nf_cholesterol: number;
  nix_brand_id: string | null;
  nf_potassium: number;
  nf_total_fat: number;
  nf_sugars: number;
  nf_ingredient_statement: string | null;
  nf_protein: number;
  source: number;
  nix_item_id: string | null;
  ndb_no: string | number;
  brick_code: string | null;
  serving_unit: string;
  updated_at: string | null;
  alt_measures: NutritionixAltMeasure[];
  tag_id: string | null;
  nf_p: number;
  nf_metric_qty: number;
  lat: number | null;
  lng: number | null;
  nix_item_name: string | null;
  photo: NutritionixPhoto;
  brand_name: string | null;
  serving_weight_grams: number;
  nf_total_carbohydrate: number;
  full_nutrients: NutritionixFullNutrient[];
  nix_brand_name: string | null;
  serving_qty: number;
  nf_calories: number;
  nf_metric_uom: string | null;
  nf_sodium: number;
  class_code: string | null;
  nf_dietary_fiber: number;
  nf_added_sugars?: number;
  nf_vitamin_d_mcg?: number;
  nf_calcium_mg?: number;
  nf_iron_mg?: number;
}

export type NutritionixNutrientsResponse = NutritionixParsedFood[];
