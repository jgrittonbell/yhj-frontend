export interface NutritionixPhoto {
  thumb: string;
  highres?: string;
  is_user_uploaded?: boolean;
}

export interface CommonFood {
  food_name: string;
  serving_unit: string;
  serving_qty: number;
  tag_name: string;
  common_type: string | null;
  photo?: NutritionixPhoto;
}

export interface BrandedFood {
  food_name: string;
  brand_name_item_name: string;
  nix_brand_id: string;
  serving_unit: string;
  serving_qty: number;
  photo?: NutritionixPhoto;
}

export interface NutritionixSearchResponse {
  common: CommonFood[];
  branded: BrandedFood[];
}
