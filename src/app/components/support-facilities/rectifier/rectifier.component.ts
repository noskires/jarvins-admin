import { AfterViewInit, Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/shared/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective,  } from 'angular-datatables';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeesService } from '../../employees/employees.service';
import { TokenService } from 'src/app/shared/token.service';
import { RectifierService } from './rectifier.service';
import { RectifierItemService } from './rectifier-item.service';
import { Select2OptionData } from 'ng-select2';
import { NetworkElementService } from '../../network-element/network-element.service';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';

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
  selector: 'app-rectifier',
  templateUrl: './rectifier.component.html',
  styleUrls: ['./rectifier.component.css']
})
export class RectifierComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})

  dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  rectifier: any[]= [];
  status: any[]= [];
  
  rectifierForm!: FormGroup;

  public options!: Options;
  public optionsNe!: Options;
  public optionsBattery!: Options;

  defaultNe!: any;
  defaultNeCodes: any = [];
  defaultBattery!: any;
  defaultBatteryCodes: any = [];
  
  params!: any;
  select2Params!: any;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public rectifierService: RectifierService,
    public rectifierItemService: RectifierItemService,
    public employeeService: EmployeesService,
    public tokenService: TokenService,
    public networkElementService: NetworkElementService
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
        this.rectifierService.list(dataTablesParameters).subscribe(async resp => {
          this.rectifier = await resp.data;
          console.log(resp)

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });

      },
      columns: [
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

    this.rectifierForm = this.fb.group({
      id: ['', Validators.required],
      code: ['', Validators.required],
      network_element_code: ['', Validators.required],
      battery_code: ['', Validators.required],
      manufacturer: ['', Validators.required],
      serial_no: ['', Validators.required],
      index_no: ['', Validators.required],
      model: ['', Validators.required],
      maintainer: ['', Validators.required],
      status: ['', Validators.required],
      date_installed: ['', Validators.required],
      date_accepted: ['', Validators.required],
      rectifier_system_naming: ['', Validators.required],
      type: ['', Validators.required],
      brand: ['', Validators.required],
      no_of_existing_module: ['', Validators.required],
      no_of_slots: ['', Validators.required],
      capacity_per_module: ['', Validators.required],
      full_capacity: ['', Validators.required],
      dc_voltage: ['', Validators.required],
      total_actual_load: ['', Validators.required],
      percent_utilization: ['', Validators.required],
      external_alarm_activation: ['', Validators.required],
      no_of_runs_and_cable_size: ['', Validators.required],
      tvss_brand_rating: ['', Validators.required],
      rectifier_dc_breaker_brand: ['', Validators.required],
      rectifier_battery_slot: ['', Validators.required],
      dcpdb_equipment_load_assignment: ['', Validators.required],
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

    this.rectifierForm = this.fb.group({
      id: [''],
      code: [''],
      network_element_code: [''],
      battery_code: [''],
      manufacturer: [''],
      serial_no: [''],
      index_no: [''],
      model: [''],
      maintainer: [''],
      status: [''],
      date_installed: [''],
      date_accepted: [''],
      rectifier_system_naming: [''],
      type: [''],
      brand: [''],
      no_of_existing_module: [''],
      no_of_slots: [''],
      capacity_per_module: [''],
      full_capacity: [''],
      dc_voltage: [''],
      total_actual_load: [''],
      percent_utilization: [''],
      external_alarm_activation: [''],
      no_of_runs_and_cable_size: [''],
      tvss_brand_rating: [''],
      rectifier_dc_breaker_brand: [''],
      rectifier_battery_slot: [''],
      dcpdb_equipment_load_assignment: [''],
      remarks: [''],
      

    });

    this.optionsNe = {
      theme: "bootstrap",
      multiple: true,
      closeOnSelect: true,
      width: '100%',
      ajax: {
        headers: {
          "Authorization" : "Bearer "+this.tokenService.getToken(),
          "Content-Type" : "application/json",
        },
        url: environment.API_URL+"api/v1/ne/select2",
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

    this.optionsBattery = {
      theme: "bootstrap",
      multiple: true,
      closeOnSelect: true,
      width: '100%',
      ajax: {
        headers: {
          "Authorization" : "Bearer "+this.tokenService.getToken(),
          "Content-Type" : "application/json",
        },
        url: environment.API_URL+"api/v1/battery/select2",
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
      placeholder: 'Search Battery',
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

    
    this.rectifierItemService.select2({item_type:'Network Element', rectifier_code:raw.code}).subscribe(async resp => {
      this.defaultNe = await resp.results;

      this.defaultNe.forEach((val: any, key:any) => { this.defaultNeCodes.push(val.id) });

      console.log(this.defaultNe)
      console.log(this.defaultNeCodes)

    });

    this.rectifierItemService.select2({item_type:"Battery", rectifier_code:raw.code}).subscribe(async resp => {
      this.defaultBattery = await resp.results;

      this.defaultBattery.forEach((val: any, key:any) => { this.defaultBatteryCodes.push(val.id) });

      console.log(this.defaultBattery)
      console.log(this.defaultBatteryCodes)
    });
  
    this.rectifierForm.patchValue({

      id: raw.id,
      code: raw.code,
      network_element_code:this.defaultNeCodes,
      battery_code:this.defaultBatteryCodes,
      manufacturer: raw.manufacturer,
      serial_no: raw.serial_no,
      index_no: raw.index_no,
      model: raw.model,
      maintainer: raw.maintainer,
      status: raw.status,
      date_installed: raw.date_installed,
      date_accepted: raw.date_accepted,
      rectifier_system_naming: raw.rectifier_system_naming,
      type: raw.type,
      brand: raw.brand,
      no_of_existing_module: raw.no_of_existing_module,
      no_of_slots: raw.no_of_slots,
      capacity_per_module: raw.capacity_per_module,
      full_capacity: raw.full_capacity,
      dc_voltage: raw.dc_voltage,
      total_actual_load: raw.total_actual_load,
      percent_utilization: raw.percent_utilization,
      external_alarm_activation: raw.external_alarm_activation,
      no_of_runs_and_cable_size: raw.no_of_runs_and_cable_size,
      tvss_brand_rating: raw.tvss_brand_rating,
      rectifier_dc_breaker_brand: raw.rectifier_dc_breaker_brand,
      rectifier_battery_slot: raw.rectifier_battery_slot,
      dcpdb_equipment_load_assignment: raw.dcpdb_equipment_load_assignment,
      remarks: raw.remarks,

    });
 
    this.optionsNe = {
      theme: "bootstrap",
      multiple: true,
      closeOnSelect: true,
      width: '100%',
      ajax: {
        headers: {
          "Authorization" : "Bearer "+this.tokenService.getToken(),
          "Content-Type" : "application/json",
        },
        url: environment.API_URL+"api/v1/ne/select2",
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

    this.optionsBattery = {
      theme: "bootstrap",
      multiple: true,
      closeOnSelect: true,
      width: '100%',
      ajax: {
        headers: {
          "Authorization" : "Bearer "+this.tokenService.getToken(),
          "Content-Type" : "application/json",
        },
        url: environment.API_URL+"api/v1/battery/select2",
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
      placeholder: 'Search Battery',
      language: {
          noResults: function () {
              return "No records found!";
          }
      },
    };

    

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

        this.rectifierService.delete(raw).subscribe(async (data: any) => {

          await this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
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
    
    const raw = this.rectifierForm.getRawValue();
    console.log(raw)

    await this.rectifierService.save(raw).subscribe((data: any) => {

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
    
    const raw = this.rectifierForm.getRawValue();
    console.log(raw)
  


    await this.rectifierService.update(raw).subscribe((data: any) => {

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
