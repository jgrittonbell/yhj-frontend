/**
 * Represents a glucose reading entry associated with a user.
 */
export interface GlucoseReading {
  id?: number;
  glucoseLevel: number;
  measurementTime: string;
  measurementSource: string;
  notes?: string;
}
