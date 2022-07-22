import { AfterViewInit, Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective,  } from 'angular-datatables';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeesService } from '../../employees/employees.service';
import { TokenService } from 'src/app/shared/token.service';
import { BatteryService } from './battery.service';
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
  language: object,
 
}

@Component({
  selector: 'app-battery',
  templateUrl: './battery.component.html',
  styleUrls: ['./battery.component.css']
})
export class BatteryComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})

  dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  battery: any[]= [];
  status: any[]= [];
  
  batteryForm!: FormGroup;

  public options!: Options;
  public optionsNe!: Options;

  defaultNe!: any;
  
  params!: any;
  select2Params!: any;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public batteryService: BatteryService,
    public employeeService: EmployeesService,
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
        this.batteryService.list(dataTablesParameters).subscribe(resp => {
          this.battery = resp.data;
          console.log(resp)

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });

      },
      columns: [
        { data: 'code' },
        { data: 'manufacturer' },
        { data: 'index_no' },
        { data: 'model' },
        { data: 'maintainer' },
        { data: 'status' },
        { data: 'date_installed' },
        { data: 'date_accepted' },
        { data: null, title: "Actions", width: "10%", className: "dt-body-center", orderable: false, searchable: false},
      ]
    };

    this.batteryForm = this.fb.group({
      id: ['', Validators.required],
      code: ['', Validators.required],
      network_element_code: ['', Validators.required],
      manufacturer: ['', Validators.required],
      index_no: ['', Validators.required],
      model: ['', Validators.required],
      maintainer: ['', Validators.required],
      status: ['', Validators.required],
      date_installed: ['', Validators.required],
      date_accepted: ['', Validators.required],
      capacity: ['', Validators.required],
      type: ['', Validators.required],
      brand: ['', Validators.required],
      no_of_cells: ['', Validators.required],
      cell_status: ['', Validators.required],
      cable_size: ['', Validators.required],
      backup_time: ['', Validators.required],
      float_voltage_requirement: ['', Validators.required],
      remarks: ['', Validators.required],
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

    this.batteryForm = this.fb.group({
      id: [''],
      code: [''],
      network_element_code: [''],
      manufacturer: [''],
      index_no: [''],
      model: [''],
      maintainer: [''],
      status: [''],
      date_installed: [''],
      date_accepted: [''],
      capacity: [''],
      type: [''],
      brand: [''],
      no_of_cells: [''],
      cell_status: [''],
      cable_size: [''],
      backup_time: [''],
      float_voltage_requirement: [''],
      remarks: [''],

    });

    this.optionsNe = {
      theme: "bootstrap",
      multiple: false,
      closeOnSelect: true,
      width: '100%',
      ajax: {
        headers: {
          "Authorization" : "Bearer "+this.tokenService.getToken(),
          "Content-Type" : "application/json",
        },
        url: "http://localhost/laravel-jwt-auth/backend/api/v1/ne/select2",
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
      placeholder: 'Search NE',
      language: {
          noResults: function () {
              return "No records found!";
          }
      },
    };

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
  
    this.batteryForm.patchValue({
      id: raw.id,
      code: raw.code,
      network_element_code:raw.network_element_code,
      manufacturer: raw.manufacturer,
      index_no: raw.index_no,
      model: raw.model,
      maintainer: raw.maintainer,
      status: raw.status,
      date_installed: raw.date_installed,
      date_accepted: raw.date_accepted,
      capacity: raw.capacity,
      type: raw.type,
      brand: raw.brand,
      no_of_cells: raw.no_of_cells,
      cell_status: raw.cell_status,
      cable_size: raw.cable_size,
      backup_time: raw.backup_time,
      float_voltage_requirement: raw.float_voltage_requirement,
      remarks: raw.remarks,

    });
 
    this.optionsNe = {
      theme: "bootstrap",
      multiple: false,
      closeOnSelect: true,
      width: '100%',
      ajax: {
        headers: {
          "Authorization" : "Bearer "+this.tokenService.getToken(),
          "Content-Type" : "application/json",
        },
        url: "http://localhost/laravel-jwt-auth/backend/api/v1/ne/select2",
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
      placeholder: 'Search NE',
      language: {
          noResults: function () {
              return "No records found!";
          }
      },
    };

    this.defaultNe = [
      {
        id: raw.network_element_code,
        text: raw.network_element_name
      }
    ];

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

        this.batteryService.delete(raw).subscribe((data: any) => {

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
    
    const raw = this.batteryForm.getRawValue();
    console.log(raw)

    await this.batteryService.save(raw).subscribe((data: any) => {

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
    
    const raw = this.batteryForm.getRawValue();
    console.log(raw)

    await this.batteryService.update(raw).subscribe((data: any) => {

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
