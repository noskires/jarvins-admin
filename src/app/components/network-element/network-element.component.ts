import { AfterViewInit, Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../shared/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective,  } from 'angular-datatables';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeesService } from '../employees/employees.service';
import { NetworkElementService } from './network-element.service';
import { TokenService } from "../../shared/token.service";
import { Select2OptionData } from 'ng-select2';
import { RectifierService } from '../support-facilities/rectifier/rectifier.service';
import { RectifierItemService } from '../support-facilities/rectifier/rectifier-item.service';
import { BatteryService } from '../support-facilities/battery/battery.service';
import { environment } from '../../../environments/environment';
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
  selector: 'app-network-element',
  templateUrl: './network-element.component.html',
  styleUrls: ['./network-element.component.css']
})
export class NetworkElementComponent implements OnInit {

  public defaultValue!: Array<Select2OptionData>;

  @ViewChild(DataTableDirective, {static: false})

  dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtOptionsRectifier: DataTables.Settings = {};
  dtOptionsBattery: DataTables.Settings = {};
  

  
  ne: any[]= [];
  rectifier: any[]= [];
  battery: any[]= [];
  status: any[]= [];
  
  neRaw!: any;
  neData!: any;

  neForm!: FormGroup;
  
  public options!: Options;
  public optionsSite!: Options;

  defaultSite!: any;
  params!: any;
  select2Params!: any;

  filtersLoaded!: Promise<boolean>;

  constructor(

    private http: HttpClient,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public networkElementService: NetworkElementService,
    public employeeService: EmployeesService,
    public tokenService: TokenService,
    public rectifierService: RectifierService,
    public rectifierItemService: RectifierItemService,
    public batteryService: BatteryService,

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
        this.networkElementService.list(dataTablesParameters).subscribe(resp => {
          this.ne = resp.data;
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
        { data: 'name' },
        { data: 'type' },
        { data: 'status' },
        { data: 'vendor' },
        { data: 'device_ip_address' },
        { data: 'software_version' },
        { data: null, title: "Actions", width: "10%", className: "dt-body-center", orderable: false, searchable: false},
      ]
    };

    this.neForm = this.fb.group({
      id: ['', Validators.required],
      site_id: ['', Validators.required],
      code: ['', Validators.required],
      name: ['', Validators.required],
      type: ['', Validators.required],
      status: ['', Validators.required],
      vendor: ['', Validators.required],
      device_ip_address: ['', Validators.required],
      software_version: ['', Validators.required],
      foc_assignment_uplink1: ['', Validators.required],
      foc_assignment_uplink2: ['', Validators.required],
      hon_assignment_uplink_port1: ['', Validators.required],
      hon_assignment_uplink_port2: ['', Validators.required],
      decom_date: ['', Validators.required],
      new_node_name: ['', Validators.required],
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

    this.neForm = this.fb.group({
      id: [''],
      site_id: [''],
      code: [''],
      name: [''],
      type: [''],
      status: [''],
      vendor: [''],
      device_ip_address: [''],
      software_version: [''],
      foc_assignment_uplink1: [''],
      foc_assignment_uplink2: [''],
      hon_assignment_uplink_port1: [''],
      hon_assignment_uplink_port2: [''],
      decom_date: [''],
      new_node_name: [''],

    });

    this.optionsSite = {
      theme: "bootstrap",
      multiple: false,
      closeOnSelect: true,
      width: '100%',
      ajax: {
        headers: {
          "Authorization" : "Bearer "+this.tokenService.getToken(),
          "Content-Type" : "application/json",
        },
        url: environment.API_URL+"api/v1/site/select2",
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
      placeholder: 'Search Site',
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
  
    this.neForm.patchValue({
      id: raw.id,
      site_id: raw.site_id,
      code: raw.code,
      name: raw.name,
      type: raw.type,
      status: raw.status,
      vendor: raw.vendor,
      device_ip_address: raw.device_ip_address,
      software_version: raw.software_version,
      foc_assignment_uplink1: raw.foc_assignment_uplink1,
      foc_assignment_uplink2: raw.foc_assignment_uplink2,
      hon_assignment_uplink_port1: raw.hon_assignment_uplink_port1,
      hon_assignment_uplink_port2: raw.hon_assignment_uplink_port2,
      decom_date: raw.decom_date,
      new_node_name: raw.new_node_name,

    });

    if(raw.site_id) {
      this.defaultSite = [
        {
          id: raw.site_id,
          text: raw.site_name
        }
      ];
    }

    console.log(this.defaultSite);

    this.optionsSite = {
      theme: "bootstrap",
      multiple: false,
      closeOnSelect: true,
      width: '100%',
      ajax: {
        headers: {
          "Authorization" : "Bearer "+this.tokenService.getToken(),
          "Content-Type" : "application/json",
        },
        url: environment.API_URL+"api/v1/site/select2",
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
      placeholder: 'Search Site',
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

        this.networkElementService.delete(raw).subscribe((data: any) => {

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

  view(targetModal:any, ne:any) {
 
    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     fullscreen: true,
     keyboard: true,
     size: 'xl',
     
    });

    console.log(ne)
    this.neRaw = ne;

    this.networkElementService.list2({ne_id:ne.id}).subscribe(async resp => {
      this.neData = await resp.network_element;
      console.log(this.neData)
      this.filtersLoaded = Promise.resolve(true);
    });

  
  }


  async onSubmitSave(): Promise<any> {
    
    const raw = this.neForm.getRawValue();
    console.log(raw)

    await this.networkElementService.save(raw).subscribe((data: any) => {

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
    
    const raw = this.neForm.getRawValue();
    console.log(raw)

    await this.networkElementService.update(raw).subscribe((data: any) => {

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
