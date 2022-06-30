import { AfterViewInit, Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../shared/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective,  } from 'angular-datatables';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeesService } from '../employees/employees.service';
import { SvService } from './sv.service';
import { TokenService } from "../../shared/token.service";
import { Select2OptionData } from 'ng-select2';
import Swal from 'sweetalert2'

declare let $: any;

export interface Options {
  theme: string,
  width:string,
  multiple: boolean,
  closeOnSelect: boolean,
  ajax: object,
  placeholder: string,
  value: string,
  language: object
}

@Component({
  selector: 'app-sv',
  templateUrl: './sv.component.html',
  styleUrls: ['./sv.component.css']
})
export class SvComponent implements OnInit {

  public defaultValue!: Array<Select2OptionData>;

  @ViewChild(DataTableDirective, {static: false})

  dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  sv: any[]= [];
  
  svForm!: FormGroup;

  public options!: Options;

  params!: any;
  select2Params!: any;


  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public employeeService: EmployeesService,
    public svService: SvService,
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
        this.svService.list(dataTablesParameters).subscribe(resp => {
          this.sv = resp.data;
          console.log(resp)

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: resp.data
          });
        });

      },
      columns: [
        { data: 'fleet_no' },
        { data: 'plate_no' },
        { data: 'manufacturer' },
        { data: 'make' },
        { data: 'production_year' },
        { data: 'sv_status' },
        { data: 'engine_serial_no' },
        { data: 'chassis_serial_no' },
        { data: 'body_serial_no' },
        { data: 'or_no' },
        { data: 'fleet_card_no' },
        { data: 'fuel_allocation' },
        { data: 'employee_name' },
        { data: null, title: "Actions", width: "10%", className: "dt-body-center", orderable: false, searchable: false},
      ]
    };

    this.svForm = this.fb.group({
      id: ['', Validators.required],
      code: ['', Validators.required],
      employee_id: ['', Validators.required],
      fleet_no: ['', Validators.required],
      plate_no: ['', Validators.required],
      manufacturer: ['', Validators.required],
      make: ['', Validators.required],
      production_year: ['', Validators.required],
      sv_status: ['', Validators.required],
      engine_serial_no: ['', Validators.required],
      chassis_serial_no: ['', Validators.required],
      body_serial_no: ['', Validators.required],
      or_no: ['', Validators.required],
      fleet_card_no: ['', Validators.required],
      fuel_allocation: ['', Validators.required],
    });

  }


  add(targetModal:any) {
  
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      fullscreen: true,
      keyboard: true,
      size: 'xl',
    });

    //select2
    this.options = {
      theme: "bootstrap",
      multiple: false,
      closeOnSelect: false,
      width: '265',
      ajax: {
        headers: {
          "Authorization" : "Bearer "+this.tokenService.getToken(),
          "Content-Type" : "application/json",
        },
        url: "http://localhost/laravel-jwt-auth/backend/api/v1/employee/select2",
        data: function (params:any) {

          params['filter'] = null;
          console.log(params)
          
          var query = {
            search: params.term,
            filter: params.filter
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
      value: "7",
      placeholder: 'Search employee',
      language: {
          noResults: function () {
              return "No records found!";
          }
      },
    };

    this.svForm = this.fb.group({
      id: [''],
      code: [''],
      employee_id: [''],
      fleet_no: [''],
      plate_no: [''],
      manufacturer: [''],
      make: [''],
      production_year: [''],
      sv_status: [''],
      engine_serial_no: [''],
      chassis_serial_no: [''],
      body_serial_no: [''],
      or_no: [''],
      fleet_card_no: [''],
      fuel_allocation: [''],
    });

  }

  edit(targetModal:any, raw:any) {

    console.log(raw)

    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      fullscreen: true,
      keyboard: true,
      size: 'xl',
    });

    this.defaultValue = [
      {
        id: raw.employee_id,
        text: raw.employee_name
      }
    ];

    //select2
    this.options = {
      theme: "bootstrap",
      multiple: false,
      closeOnSelect: false,
      width: '265',
      ajax: {
        headers: {
          "Authorization" : "Bearer "+this.tokenService.getToken(),
          "Content-Type" : "application/json",
        },
        url: "http://localhost/laravel-jwt-auth/backend/api/v1/employee/select2",
        data: function (params:any) {

          console.log(params)
          var query = {
            search: params.term,
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
      value: "7",
      placeholder: 'Search employee',
      language: {
          noResults: function () {
              return "No records found!";
          }
      },
    };

    this.svForm.patchValue({
      id: raw.id,
      code: raw.code,
      employee_id: raw.employee_id,
      fleet_no: raw.fleet_no,
      plate_no: raw.plate_no,
      manufacturer: raw.manufacturer,
      make: raw.make,
      production_year: raw.production_year,
      sv_status: raw.sv_status,
      engine_serial_no: raw.engine_serial_no,
      chassis_serial_no: raw.chassis_serial_no,
      body_serial_no: raw.body_serial_no,
      or_no: raw.or_no,
      fleet_card_no: raw.fleet_card_no,
      fuel_allocation: raw.fuel_allocation,
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

        this.svService.delete(raw).subscribe((data: any) => {

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

  async onSubmitSave(): Promise<any> {
    
    const raw = this.svForm.getRawValue();
    console.log(raw)

    await this.svService.save(raw).subscribe((data: any) => {

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
    
    const raw = this.svForm.getRawValue();
    console.log(raw)

    await this.svService.update(raw).subscribe((data: any) => {

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

}
