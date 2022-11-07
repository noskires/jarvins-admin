import { AfterViewInit, Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../shared/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataTableDirective,  } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as $ from 'jquery'
// import * as AdminLte from 'admin-lte';
import { PermissionService } from '../permission/permission.service';

declare const App: any;
// declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userInfo!: any;
  params!: any;
  perms!: any;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    public permissionService: PermissionService,
    ) {}

  ngOnInit(): void {
    App.initMainPage();
    // $('[data-widget="treeview"]').Treeview('init');
    // $(document).ready(() => {
    //   const trees: any = $('[data-widget="tree"]');
    //   trees.tree();
    // });


    // this.authService.me().subscribe(async resp=> {
    //   console.log(resp)
    //   this.userInfo = await resp.name;
    //   console.log(this.userInfo)
    // }, error => {
    //   alert(error.error.error)
    //   console.log(error.error.error)
    //   this.router.navigate(['login']);
    // })


    this.permissionService.list(this.params).subscribe(async resp=> {
      console.log(resp)
      this.perms = await resp;
    })

  }



  

}


