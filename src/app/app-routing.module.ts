import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { UsersComponent } from './features/users/users.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { InSessionGuard } from './shared/guards/in-session.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'users', component: UsersComponent },
      { path: '', component: DashboardComponent, pathMatch: 'full' },
    ],
  },
  { path: 'signin', component: SignInComponent, canActivate: [InSessionGuard] },
  { path: 'signup', component: SignUpComponent, canActivate: [InSessionGuard] },
  { path: '**', redirectTo: 'signin' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
