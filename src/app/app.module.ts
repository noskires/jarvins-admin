import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.modules';

import { AppComponent } from './app.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DatatablesComponent } from './components/datatables/datatables.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { SigninComponent } from './components/signin/signin.component';
import { ApexchartsComponent } from './components/apexcharts/apexcharts.component';
import { TrainingComponent } from './components/training/training.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthInterceptor } from './shared/auth.interceptor';

import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from "ng-apexcharts";
import { NgSelect2Module } from 'ng-select2';
import { TteComponent } from './components/tte/tte.component';
import { SvComponent } from './components/sv/sv.component';
import { SiteComponent } from './components/site/site.component';
import { BuildingComponent } from './components/building/building.component';
import { SiteCategoryComponent } from './components/site-category/site-category.component';
import { ElectricCompanyComponent } from './components/electric-company/electric-company.component';
import { ExchangeComponent } from './components/exchange/exchange.component';
import { PssOwnerComponent } from './components/pss-owner/pss-owner.component';
import { Select2AuroraModule } from 'select2-aurora';
import { NetworkElementComponent } from './components/network-element/network-element.component';
import { BatteryComponent } from './components/support-facilities/battery/battery.component';
import { RectifierComponent } from './components/support-facilities/rectifier/rectifier.component';




@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent,
    NavComponent,
    FooterComponent,
    SidebarComponent,
    DatatablesComponent,
    EmployeesComponent,
    SigninComponent,
    ApexchartsComponent,
    TrainingComponent,
    TteComponent,
    SvComponent,
    SiteComponent,
    BuildingComponent,
    SiteCategoryComponent,
    ElectricCompanyComponent,
    ExchangeComponent,
    PssOwnerComponent,
    NetworkElementComponent,
    BatteryComponent,
    RectifierComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    DataTablesModule,
    NgbModule,
    NgApexchartsModule,
    NgSelect2Module,
    Select2AuroraModule

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
