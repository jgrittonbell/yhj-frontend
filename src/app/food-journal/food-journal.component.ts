import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-food-journal',
  imports: [CommonModule, RouterModule],
  templateUrl: './food-journal.component.html',
  styleUrls: ['./food-journal.component.css'],
})
export class FoodJournalComponent {}
