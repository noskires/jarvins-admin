import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApexchartsComponent } from './components/apexcharts/apexcharts.component';
import { DatatablesComponent } from './components/datatables/datatables.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SigninComponent } from './components/signin/signin.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: SigninComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'employees/:id', component: EmployeesComponent },

//   testing
  { path: 'datatables', component: DatatablesComponent },
  { path: 'apexcharts', component: ApexchartsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}