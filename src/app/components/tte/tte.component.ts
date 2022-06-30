import { AfterViewInit, Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../shared/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective,  } from 'angular-datatables';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeesService } from '../employees/employees.service';
import { TteService } from './tte.service';
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
  selector: 'app-tte',
  templateUrl: './tte.component.html',
  styleUrls: ['./tte.component.css']
})
export class TteComponent implements OnInit {

  public defaultValue!: Array<Select2OptionData>;
  
  @ViewChild(DataTableDirective, {static: false})
  
  
  dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  tte: any[]= [];
  
  tteForm!: FormGroup;

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
    public tteService: TteService,
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
        this.tteService.list(dataTablesParameters).subscribe(resp => {
          this.tte = resp.data;
          console.log(resp)

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: resp.data
          });
        });

      },
      columns: [
        // { data: 'code', width: "30%"  }, 
        { data: 'description' },
        { data: 'category' },
        { data: 'quantity' },
        { data: 'brand' },
        { data: 'serial_number' },
        { data: 'calibration_validity_date' },
        { data: 'date_received' },
        { data: 'tte_condition' },
        { data: 'employee_name' },
        { data: null, title: "Actions", width: "10%", className: "dt-body-center", orderable: false, searchable: false},
      ]
    };

    this.tteForm = this.fb.group({
      id: ['', Validators.required],
      code: ['', Validators.required],
      employee_id: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      quantity: ['', Validators.required],
      brand: ['', Validators.required],
      serial_number: ['', Validators.required],
      calibration_validity_date: ['', Validators.required],
      date_received: ['', Validators.required],
      tte_condition: ['', Validators.required],
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

    this.tteForm = this.fb.group({
      id: [''],
      code: [''],
      employee_id: [''],
      description: [''],
      category: [''],
      quantity: [''],
      brand: [''],
      serial_number: [''],
      calibration_validity_date: [''],
      date_received: [''],
      tte_condition: [''],
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

    this.tteForm.patchValue({
      id: raw.id,
      code: raw.code,
      employee_id: raw.employee_id,
      description: raw.description,
      category: raw.category,
      quantity: raw.quantity,
      brand: raw.brand,
      serial_number: raw.serial_number,
      calibration_validity_date: raw.calibration_validity_date,
      date_received: raw.date_received,
      tte_condition: raw.tte_condition,
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

        

        this.tteService.delete(raw).subscribe((data: any) => {

         

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
    
    const raw = this.tteForm.getRawValue();
    console.log(raw)

    await this.tteService.save(raw).subscribe((data: any) => {

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
    
    const raw = this.tteForm.getRawValue();
    console.log(raw)

    await this.tteService.update(raw).subscribe((data: any) => {

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
