import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GlucoseReading } from '../interfaces/glucose-reading';
import { GlucoseService } from '../services/glucose.service';
import { AuthHeaderService } from '../auth-header.service';

@Component({
  standalone: true,
  selector: 'app-glucose-journal',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
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

  constructor(
    private fb: FormBuilder,
    private glucoseService: GlucoseService,
    private authHeaderService: AuthHeaderService
  ) {
    this.glucoseForm = this.fb.group({
      readingValue: [null, [Validators.required, Validators.min(0)]],
      readingTime: [null, Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    this.loadReadings();
  }

  loadReadings(): void {
    const headers = this.authHeaderService.getAuthHeaders();
    this.glucoseService.getAllReadings(headers).subscribe({
      next: (readings) => (this.readings = readings),
      error: (err) => console.error('Failed to fetch readings:', err),
    });
  }

  startNewReading(): void {
    this.showForm = true;
    this.readingSaved = false;
    this.readingUpdated = false;
    this.editingReading = null;
    this.glucoseForm.reset();
  }

  cancelForm(): void {
    this.showForm = false;
    this.editingReading = null;
    this.glucoseForm.reset();
  }

  onSubmit(): void {
    if (this.glucoseForm.valid) {
      const headers = this.authHeaderService.getAuthHeaders();

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
            readingData,
            headers
          )
        : this.glucoseService.saveReading(readingData, headers);

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

  editReading(reading: GlucoseReading): void {
    this.editingReading = reading;
    this.showForm = true;

    this.glucoseForm.patchValue({
      readingValue: reading.glucoseLevel,
      readingTime: reading.measurementTime,
      notes: reading.notes ?? '',
    });
  }

  deleteReading(id: number): void {
    if (!confirm('Are you sure you want to delete this reading?')) return;

    const headers = this.authHeaderService.getAuthHeaders();
    this.glucoseService.deleteReading(id, headers).subscribe({
      next: () => {
        this.readingDeleted = true;
        this.loadReadings();
        setTimeout(() => (this.readingDeleted = false), 4000);
      },
      error: (err) => console.error('Failed to delete reading:', err),
    });
  }
}
