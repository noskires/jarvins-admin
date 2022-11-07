import { Component } from '@angular/core';
import { HelperService } from './helper.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { UserPermissionService } from './components/permission/UserPermissionService';
// import { NgxPermissionsService } from 'ngx-permissions/lib';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'admin';

  params!: any;
  perms!: any;

  constructor(
    public helper: HelperService,
    private ngxPermissionsService: NgxPermissionsService,
    private userPermissionService: UserPermissionService
  ) {

    this.helper.testHelper();
    // this.ngxPermissionsService.loadPermissions(['DEVELOPER']);

    this.userPermissionService.list(this.params).subscribe(async resp=> {
      console.log(resp)
      // this.perms = await resp;
      this.ngxPermissionsService.loadPermissions(await resp);
    })

  }

  
}
