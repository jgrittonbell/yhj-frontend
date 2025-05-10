import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthCallbackComponent } from './auth-callback.component';
import { FoodJournalComponent } from './food-journal/food-journal.component';
import { GlucoseJournalComponent } from './glucose-journal/glucose-journal.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'food-journal', component: FoodJournalComponent },
  { path: 'glucose-journal', component: GlucoseJournalComponent },
  { path: 'auth-callback', component: AuthCallbackComponent },
  { path: '**', redirectTo: '' },
];
