export interface NutrientMeta {
  name: string;
  unit: string;
  key?: string; // matches  formControlName, if any
  isMajor?: boolean; // used for auto-filling core fields
}

export const NUTRIENT_MAP: Record<number, NutrientMeta> = {
  208: { name: 'Calories', unit: 'kcal', key: 'calories', isMajor: true },
  203: { name: 'Protein', unit: 'g', key: 'protein', isMajor: true },
  204: { name: 'Total Fat', unit: 'g', key: 'fat', isMajor: true },
  205: { name: 'Carbohydrates', unit: 'g', key: 'carbs', isMajor: true },
  269: { name: 'Sugars', unit: 'g', key: 'sugar', isMajor: true },
  539: { name: 'Added Sugars', unit: 'g', key: 'addedSugar' },
  291: { name: 'Fiber', unit: 'g', key: 'fiber', isMajor: true },
  301: { name: 'Calcium', unit: 'mg', key: 'calcium' },
  303: { name: 'Iron', unit: 'mg', key: 'iron' },
  306: { name: 'Potassium', unit: 'mg', key: 'potassium' },
  307: { name: 'Sodium', unit: 'mg', key: 'sodium', isMajor: true },
  401: { name: 'Vitamin C', unit: 'mg' },
  328: { name: 'Vitamin D', unit: 'µg', key: 'vitaminD' },
  606: { name: 'Saturated Fat', unit: 'g' },
  605: { name: 'Trans Fat', unit: 'g' },
  304: { name: 'Magnesium', unit: 'mg' },
  305: { name: 'Phosphorus', unit: 'mg' },
  315: { name: 'Manganese', unit: 'mg' },
  309: { name: 'Zinc', unit: 'mg' },
  410: { name: 'Pantothenic Acid', unit: 'mg' },
  323: { name: 'Vitamin E', unit: 'mg' },
  418: { name: 'Vitamin B-12', unit: 'µg' },
  415: { name: 'Vitamin B-6', unit: 'mg' },
  404: { name: 'Thiamin (Vitamin B1)', unit: 'mg' },
  405: { name: 'Riboflavin (Vitamin B2)', unit: 'mg' },
  406: { name: 'Niacin (Vitamin B3)', unit: 'mg' },
  417: { name: 'Folate', unit: 'µg' },
  432: { name: 'Folate, food', unit: 'µg' },
  435: { name: 'Folate, DFE', unit: 'µg' },
  430: { name: 'Vitamin K', unit: 'µg' },
};
