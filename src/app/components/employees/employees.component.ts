import { AfterViewInit, Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../shared/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataTableDirective,  } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  users: any[]= [];

  // id = null; 

  editProfileForm!: FormGroup;
   
  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      var id = params.get('id');
      console.log(id);
    });

    this.authService.me().subscribe(resp=> {
      console.log(resp)
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

  edit(targetModal:any, user:any) {
 
    console.log(user)
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     fullscreen: true,
     keyboard: true,
    });
   
    this.editProfileForm.patchValue({
     id: user.id,
     name: user.name,
     email: user.email
    });

  }

  view(targetModal:any, user:any) {
 
    console.log(user)
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     fullscreen: true,
     keyboard: true,
     size: 'xl',
     
    });
   
    // this.editProfileForm.patchValue({
    //  id: user.id,
    //  name: user.name,
    //  email: user.email
    // });

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
