import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApexchartsComponent } from './components/apexcharts/apexcharts.component';
import { AuditsComponent } from './components/audits/audits.component';
import { BuildingComponent } from './components/building/building.component';
import { DatatablesComponent } from './components/datatables/datatables.component';
import { ElectricCompanyComponent } from './components/electric-company/electric-company.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ExchangeComponent } from './components/exchange/exchange.component';
import { HomeComponent } from './components/home/home.component';
import { NetworkElementComponent } from './components/network-element/network-element.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PssOwnerComponent } from './components/pss-owner/pss-owner.component';
import { SigninComponent } from './components/signin/signin.component';
import { SiteCategoryComponent } from './components/site-category/site-category.component';
import { SiteComponent } from './components/site/site.component';
import { BatteryComponent } from './components/support-facilities/battery/battery.component';
import { RectifierComponent } from './components/support-facilities/rectifier/rectifier.component';
import { SvComponent } from './components/sv/sv.component';
import { TrainingComponent } from './components/training/training.component';
import { TteComponent } from './components/tte/tte.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: SigninComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'employees/:id', component: EmployeesComponent },
  { path: 'trainings', component: TrainingComponent },
  { path: 'tools-test-equipments', component: TteComponent },
  { path: 'service-vehicles', component: SvComponent },
  { path: 'site', component: SiteComponent },
  { path: 'building', component: BuildingComponent },
  { path: 'exchange', component: ExchangeComponent },
  { path: 'electric-company', component: ElectricCompanyComponent },
  { path: 'site-category', component: SiteCategoryComponent },
  { path: 'pss-owner', component: PssOwnerComponent },
  { path: 'network-element', component: NetworkElementComponent },
  { path: 'support-facility/battery', component: BatteryComponent },
  { path: 'support-facility/rectifier', component: RectifierComponent },
  { path: 'audit', component: AuditsComponent },
  
  
//   testing
  { path: 'datatables', component: DatatablesComponent },
  { path: 'apexcharts', component: ApexchartsComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}