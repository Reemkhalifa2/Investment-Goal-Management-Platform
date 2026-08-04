import { Routes } from '@angular/router';

import { Login } from './page/login/login';
import { Register } from './page/Register/Register';
import { UserDashboard } from './page/user-dashboard/user-dashboard';
import { FinancialProfile } from './page/financial-profile/financial-profile';
import { AdminDashboard } from './page/dashboard/dashboard';
import { MainLayout } from './layout/main-layout/main-layout';
<<<<<<< HEAD
import {AssetManagement} from './page/asset-management/asset-management';
import {investmentGoal} from './page/investmentGoal/investmentGoal';
=======
import { AssetManagement } from './page/asset-management/asset-management';
import { FinancialGoal } from './page/investment-goal/investment-goal';
import { authGuard } from './authGuard'; // <-- Add this

>>>>>>> c77d725ff7104984766e81c3ee35687b2364b2f3
export const routes: Routes = [
  {
    path: '',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },

  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard], // <-- Protect all child routes
    children: [
      {
        path: 'dashboard',
        component: UserDashboard
      },
      {
        path: 'financial-profile',
        component: FinancialProfile
      },
      {
        path: 'admin-dashboard',
        component: AdminDashboard
      },
      {
        path: 'assets',
        component: AssetManagement
      },

      {
        path: 'investmentGoal',
        component: investmentGoal
      },

      {
        path: 'financial-goal',
        component: FinancialGoal
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  {
    path: '**',
    redirectTo: ''
  }
];