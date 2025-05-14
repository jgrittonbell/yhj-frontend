import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GlucoseReading } from '../interfaces/glucose-reading';
import { GlucoseService } from '../services/glucose.service';

@Component({
  standalone: true,
  selector: 'app-glucose-journal',
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './glucose-journal.component.html',
  styleUrls: ['./glucose-journal.component.css'],
})
export class GlucoseJournalComponent implements OnInit {
  glucoseForm: FormGroup;
  readings: GlucoseReading[] = [];

  readingSaved = false;
  readingUpdated = false;
  readingDeleted = false;
  showForm = false;
  editingReading: GlucoseReading | null = null;

  filterText: string = '';

  sortColumn: string = 'measurementTime';
  sortDirection: 'asc' | 'desc' = 'desc';

  constructor(private fb: FormBuilder, private glucoseService: GlucoseService) {
    this.glucoseForm = this.fb.group({
      readingValue: [null, [Validators.required, Validators.min(0)]],
      readingTime: [null, Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    this.sortColumn = 'measurementTime';
    this.sortDirection = 'desc';
    this.loadReadings();
  }

  /**
   * Loads all glucose readings for the current user.
   */
  loadReadings(): void {
    this.glucoseService.getAllReadings().subscribe({
      next: (readings) => (this.readings = readings),
      error: (err) => console.error('Failed to fetch readings:', err),
    });
  }

  /**
   * Begins creation of a new glucose reading.
   */
  startNewReading(): void {
    this.showForm = true;
    this.readingSaved = false;
    this.readingUpdated = false;
    this.editingReading = null;
    this.glucoseForm.reset();
  }

  /**
   * Cancels the form and resets state.
   */
  cancelForm(): void {
    this.showForm = false;
    this.editingReading = null;
    this.glucoseForm.reset();
  }

  /**
   * Submits the glucose form to either create or update a reading.
   */
  onSubmit(): void {
    if (this.glucoseForm.valid) {
      // Map frontend fields to backend DTO
      const form = this.glucoseForm.value;
      const readingData: GlucoseReading = {
        glucoseLevel: form.readingValue,
        measurementTime: form.readingTime,
        notes: form.notes ?? null,
        measurementSource: 'Manual',
      };

      const request$ = this.editingReading
        ? this.glucoseService.updateReading(
            this.editingReading.id!,
            readingData
          )
        : this.glucoseService.saveReading(readingData);

      request$.subscribe({
        next: () => {
          this.showForm = false;
          this.loadReadings();
          this.readingSaved = !this.editingReading;
          this.readingUpdated = !!this.editingReading;
          setTimeout(() => {
            this.readingSaved = false;
            this.readingUpdated = false;
          }, 4000);
        },
        error: (err) => console.error('Error saving reading:', err),
      });
    }
  }

  /**
   * Loads a reading into the form for editing.
   *
   * @param reading The glucose reading to edit.
   */
  editReading(reading: GlucoseReading): void {
    this.editingReading = reading;
    this.showForm = true;

    this.glucoseForm.patchValue({
      readingValue: reading.glucoseLevel,
      readingTime: reading.measurementTime,
      notes: reading.notes ?? '',
    });
  }

  /**
   * Deletes a glucose reading by ID after user confirmation.
   *
   * @param id The unique ID of the reading to delete.
   */
  deleteReading(id: number): void {
    if (!confirm('Are you sure you want to delete this reading?')) return;

    this.glucoseService.deleteReading(id).subscribe({
      next: () => {
        this.readingDeleted = true;
        this.loadReadings();
        setTimeout(() => (this.readingDeleted = false), 4000);
      },
      error: (err) => console.error('Failed to delete reading:', err),
    });
  }

  /**
   * Filters readings by user-entered search text across
   * notes, glucose level, and measurement time.
   *
   * @returns Filtered glucose readings.
   */
  get filteredReadings(): GlucoseReading[] {
    if (!this.filterText.trim()) {
      return this.readings;
    }

    const search = this.filterText.toLowerCase();

    return this.readings.filter(
      (reading) =>
        reading.notes?.toLowerCase().includes(search) ||
        reading.glucoseLevel.toString().includes(search) ||
        reading.measurementTime.toLowerCase().includes(search)
    );
  }

  /**
   * Returns a sorted and filtered list of readings,
   * applying both the current search filter and sort column/direction.
   *
   * @returns Filtered and sorted glucose readings.
   */
  get displayedReadings(): GlucoseReading[] {
    const filtered = this.filterText.trim()
      ? this.readings.filter(
          (r) =>
            r.notes?.toLowerCase().includes(this.filterText.toLowerCase()) ||
            r.glucoseLevel.toString().includes(this.filterText) ||
            r.measurementTime
              .toLowerCase()
              .includes(this.filterText.toLowerCase())
        )
      : this.readings;

    return [...filtered].sort((a, b) => {
      const valA = (a as any)[this.sortColumn];
      const valB = (b as any)[this.sortColumn];

      if (this.sortDirection === 'asc') {
        return valA > valB ? 1 : valA < valB ? -1 : 0;
      } else {
        return valA < valB ? 1 : valA > valB ? -1 : 0;
      }
    });
  }

  /**
   * Updates the column and direction used to sort readings.
   *
   * @param column The name of the column to sort by.
   */
  setSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }
}
