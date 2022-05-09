import { AfterViewInit, Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../shared/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataTableDirective,  } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
declare let $: any;


@Component({
  selector: 'app-datatables',
  templateUrl: './datatables.component.html',
  styleUrls: ['./datatables.component.css']
})
export class DatatablesComponent implements OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  users: any[]= [];

  data = [];

  editProfileForm!: FormGroup;
   
  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {

    $('.js-example-basic-single').select2();

    this.authService.me().subscribe(resp=> {
      console.log(resp)
      // if(resp.message!="Authorized"){
      //   this.router.navigate(['login']);
      // }
      
    }, error => {
      console.log(error.status)
      // this.router.navigate(['login']);
    })

    this.authService.select2().subscribe(resp=> {
      console.log(resp)
      // this.data.push(resp);
      this.data = resp;
      // if(resp.message!="Authorized"){
      //   this.router.navigate(['login']);
      // }
      
    }, error => {
      console.log(error.status)
      // this.router.navigate(['login']);
    })

    const that = this;

    this.dtOptions = {
      destroy: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
       
        console.log(dataTablesParameters)
        this.authService.users2(dataTablesParameters).subscribe(resp => {
            that.users = resp.data;
            console.log(resp)

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 'id' }, { data: 'name' }, { data: 'email' }]
    };

    this.editProfileForm = this.fb.group({
      id: [''],
      name: [''],
      email: ['']
     });
  }

  // ngAfterViewInit(): void {
  //   this.dtTrigger.next();
  // }

  // ngOnDestroy(): void {
  //   // Do not forget to unsubscribe the event
  //   this.dtTrigger.unsubscribe();
  // }

  // rerender(): void {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     // Destroy the table first
  //     dtInstance.destroy();
  //     // Call the dtTrigger to rerender again
  //     this.dtTrigger.next();
  //   });
  // }

  open(targetModal:any, user:any) {

    console.log(user)
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static'
    });
   
    this.editProfileForm.patchValue({
     id: user.id,
     name: user.name,
     email: user.email
    });

  }

  async onSubmit(): Promise<any> {
    this.modalService.dismissAll();
    const user = this.editProfileForm.getRawValue();

    await this.authService.update(user).subscribe((data: any) => {

      console.log(data)
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();
      });

    });

  }

}
