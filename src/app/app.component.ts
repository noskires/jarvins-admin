import { Component } from '@angular/core';
import { HelperService } from './helper.service';
import { NgxPermissionsService } from 'ngx-permissions';
// import { NgxPermissionsService } from 'ngx-permissions/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'admin';

  constructor(
    public helper: HelperService,
    private ngxPermissionsService: NgxPermissionsService
  ) {

    this.helper.testHelper();
    this.ngxPermissionsService.loadPermissions(['DEVELOPER']);

  }

  
}
