import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthCallbackComponent } from './auth-callback.component';
import { FoodJournalComponent } from './food-journal/food-journal.component';
import { GlucoseJournalComponent } from './glucose-journal/glucose-journal.component';
import { DataInsightsComponent } from './data-insights/data-insights.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './guard/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'food-journal',
    component: FoodJournalComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'glucose-journal',
    component: GlucoseJournalComponent,
    canActivate: [AuthGuard],
  },
  { path: 'auth-callback', component: AuthCallbackComponent },
  {
    path: 'insights',
    component: DataInsightsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' },
];
