import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-glucose-journal',
  imports: [CommonModule, RouterModule],
  templateUrl: './glucose-journal.component.html',
  styleUrl: './glucose-journal.component.css',
})
export class GlucoseJournalComponent {}
