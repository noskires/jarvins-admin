import { AfterViewInit, Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective,  } from 'angular-datatables';
import { Router, ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/shared/token.service';
import { Select2OptionData } from 'ng-select2';
import Swal from 'sweetalert2';
import { UserService } from './user.service';
import { UserPermissionService } from '../permission/UserPermissionService';
// import { userItemService } from './dc-panel-item.service';
// import { RectifierService } from '../rectifier/rectifier.service';
import { environment } from '../../../environments/environment';

declare let $: any;

export interface Options {
  theme: string,
  width:string,
  multiple: boolean,
  closeOnSelect: boolean,
  ajax: object,
  placeholder: string,
  language: object,
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public defaultValue!: Array<Select2OptionData>;

  @ViewChild(DataTableDirective, {static: false})

  dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtOptionsUserItems: DataTables.Settings = {};
  

  user: any[]= [];
  userItems: any[]= [];
  status: any[]= [];
  
  userForm!: FormGroup;
  userItemForm!: FormGroup;

  editUserItemModal!: any;
  

  public options!: Options;
  public optionsPermission!: Options;
  // public optionsNe!: Options;
  // public optionsRectifier!: Options;
  // public optionsManufacturer!: Options;
  // public optionsSite!: Options;

  defaultNe!: any;
  defaultSite: any = [];
  defaultRectifier!: any;
  defaultManufacturer!: any;
  value1!: any;
  title!: any;
  
  params!: any;
  select2Params!: any;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public userService: UserService,
    public userItemService: UserPermissionService,
    // public rectifierService: RectifierService,
    public tokenService: TokenService
  ) { }

  ngOnInit(): void {

    this.dtOptions = {
      destroy: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      scrollX: true,
      ajax: (dataTablesParameters: any, callback) => {
       
        console.log(dataTablesParameters)
        this.userService.list(dataTablesParameters).subscribe(async resp => {
          this.user = await resp.data;
          console.log(resp)

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });

      },
      columns: [
        { data: 'name' },
        { data: 'email' },
        { data: null, title: "Actions", width: "10%", className: "dt-body-center", orderable: false, searchable: false},
      ]
    };

    this.userForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required],
      section_id: ['', Validators.required],
      is_admin: ['', Validators.required],
    });

  }


  add(targetModal:any) {
  
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      fullscreen: true,
      keyboard: true,
      size: 'sm',
    });

    this.userForm = this.fb.group({
      id: [''],
      name: [''],
      email: [''],
      password: [''],
      password_confirmation: [''],
      section_id: [''],
      is_admin: [''],
    });

  }

  edit(targetModal:any, raw:any) {

    console.log(raw)

    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      fullscreen: true,
      keyboard: true,
      size: 'sm',
    });

    if(raw.dc_panel_site_id){
      this.defaultSite = [
        {
          id: raw.dc_panel_site_id,
          text: raw.site_name
        }
      ];
    }
  
    this.userForm.patchValue({
      id: raw.id,
      name: raw.name,
      email: raw.email,
      password: raw.password,
      section: raw.section_id,
      is_admin: raw.is_admin,
    });

  }

  remove(raw: any) {
    
    Swal.fire({
      title: 'Are you sure you want to delete this record?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.userService.delete(raw).subscribe((data: any) => {

          this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.draw();
    
            Swal.fire(
              'Deleted!',
              'This record has been deleted.',
              'success'
            )
            
          });


        });

      }
    })
  }

  view(targetModal:any, raw:any) {

    console.log(raw)

    this.title = raw.email;

    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      fullscreen: true,
      keyboard: true,
      size: 'l',
    });

    this.optionsPermission = {
      theme: "bootstrap",
      multiple: false,
      closeOnSelect: true,
      width: '100%',
      ajax: {
        headers: {
          "Authorization" : "Bearer "+this.tokenService.getToken(),
          "Content-Type" : "application/json",
        },
        url: environment.API_URL+"api/v1/permission/select2",
        data: function (params:any) {

          params['user_id'] = raw.id;
          console.log(params)
          var query = {
            search: params.term,
            id: params.id,
            user_id: params.user_id
          }
 
          // Query parameters will be ?search=[term]&type=public
          console.log(query)
          return query;
        },
        type: "get",
        dataType: 'json',
        delay: 100,
        cache: true
      },
      placeholder: 'Search Permission',
      language: {
          noResults: function () {
              return "No records found!";
          }
      },
    };

    // dtables
    this.dtOptionsUserItems = {
      destroy: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      stateSave: true,
      scrollX: true,
      ajax: (dataTablesParameters: any, callback) => {
       
        dataTablesParameters['user_id'] = raw.id;
        console.log(dataTablesParameters)
        this.userItems = [];
        this.userItemService.list2(dataTablesParameters).subscribe(async resp => {
          this.userItems = await resp.data;
          console.log(resp)

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });

        });
      },
      columns: [
        // { data: 'code', width:'6%'}, 
        { data: 'feature', width: '20%'}, 
        { data: 'permission', width: '30%'}, 
        { data: null, title: 'Actions', width: '5%', orderable:false},      
      ],

    };

    this.userItemForm = this.fb.group({
      id: [''],
      user_id: raw.id,
      permission_id: [''],
    });

  }

  async onSubmitSave(): Promise<any> {
    
    const raw = this.userForm.getRawValue();
    console.log(raw)

    await this.userService.save(raw).subscribe((data: any) => {

      console.log(data)
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();

        Swal.fire({
          // position: 'top-end',
          icon: 'success',
          title: 'Successfully save!',
          showConfirmButton: false,
          timer: 1500
        })
      });

      this.modalService.dismissAll();

    });

  }

  async onSubmitUpdate(): Promise<any> {
    
    const raw = this.userForm.getRawValue();
    console.log(raw)

    await this.userService.update(raw).subscribe((data: any) => {

      console.log(data)
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.draw();

        Swal.fire({
          // position: 'top-end',
          icon: 'success',
          title: 'Successfully save!',
          showConfirmButton: false,
          timer: 1500
        })
      });

      this.modalService.dismissAll();

    });

  }

  editUserItem(targetModal:any, raw:any) {
 
    console.log(raw)
 
    this.editUserItemModal = this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      fullscreen: true,
      keyboard: true,
      size: 'sm',
    });
    
    // select2
    this.optionsPermission = {
      theme: "bootstrap",
      multiple: false,
      closeOnSelect: true,
      width: '100%',
      ajax: {
        headers: {
          "Authorization" : "Bearer "+this.tokenService.getToken(),
          "Content-Type" : "application/json",
        },
        url: environment.API_URL+"api/v1/permission/select2",
        data: function (params:any) {

          params['user_id'] = raw.user_id;
          console.log(params)
          var query = {
            search: params.term,
            // id: params.id,
            user_id: params.user_id
          }

          // Query parameters will be ?search=[term]&type=public
          console.log(query)
          return query;
        },
        type: "get",
        dataType: 'json',
        delay: 100,
        cache: true
      },
      placeholder: 'Search Permission2',
      language: {
        noResults: function () {
          return "No records found!";
        }
      },
    };

    this.defaultValue = [
      {
        id: raw.id,
        text: raw.permission
      }
    ];

    console.log(this.defaultValue)
    
    this.userItemForm = this.fb.group({
      id: raw.id,
      user_id: raw.user_id,
      permission_id: raw.permission_id,
    });


  }

  removeUserItem(raw: any) {
    
    Swal.fire({
      title: 'Are you sure you want to delete this record?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.userItemService.delete(raw).subscribe((data: any) => {

          $('#dt1').DataTable().ajax.reload();

          Swal.fire(
            'Deleted!',
            'This record has been deleted.',
            'success'
          )

        });

      }
    })
  }

  async onSubmitUserItem(): Promise<any> {
    
    const raw = this.userItemForm.getRawValue();
    console.log(raw)

    await this.userItemService.save(raw).subscribe((data: any) => {

      console.log(data)
      $('#dt1').DataTable().ajax.reload();

      Swal.fire({
        // position: 'top-end',
        icon: 'success',
        title: 'Successfully save!',
        showConfirmButton: false,
        timer: 1500
      })

      this.userItemForm = this.fb.group({
        id: [''],
        user_id: raw.user_id,
        permission_id: [''],
      });
      
    });

  }

  async onUpdateUserItem(): Promise<any> {
    
    const raw = this.userItemForm.getRawValue();
    console.log(raw)

    await this.userItemService.update(raw).subscribe((data: any) => {

      console.log(data)
      $('#dt1').DataTable().ajax.reload();

      Swal.fire({
        // position: 'top-end',
        icon: 'success',
        title: 'Successfully save!',
        showConfirmButton: false,
        timer: 1500
      })

      this.userItemForm = this.fb.group({
        id: [''],
        dc_panel_id: raw.dc_panel_id,
        code: [''],
        network_element_id: [''],
        breaker_no: [''],
        current: [''],
      });

      this.editUserItemModal.dismiss();
      
    });

  }

}
