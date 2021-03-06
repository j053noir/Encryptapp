import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { CypherComponent } from './features/cypher/cypher.component';
import { SignatureComponent } from './features/signature/signature.component';
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
      { path: 'cypher', component: CypherComponent },
      { path: 'signature', component: SignatureComponent },
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
