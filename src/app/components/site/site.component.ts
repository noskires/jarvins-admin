import { AfterViewInit, Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../shared/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective,  } from 'angular-datatables';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeesService } from '../employees/employees.service';
import { SiteService } from './site.service';
import { TokenService } from "../../shared/token.service";
import { Select2OptionData } from 'ng-select2';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';

declare let $: any;

export interface Options {
  theme: string,
  width:string,
  multiple: boolean,
  closeOnSelect: boolean,
  ajax: object,
  placeholder: string,
  value: string,
  language: object,
 
}

export interface OptionsStatus {
  theme: string,
  width:string, 
  closeOnSelect: boolean,
  placeholder: string,
}

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {

  public defaultValue!: Array<Select2OptionData>;

  @ViewChild(DataTableDirective, {static: false})

  dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  site: any[]= [];
  status: any[]= [];
  
  siteForm!: FormGroup;

  public options!: Options;
  public optionsStatus!: OptionsStatus;
  public optionsSiteCategory!: Options;
  public optionsBuilding!: Options;
  public optionsExchange!: Options;
  public optionsElectricCompany!: Options;
  public optionsPssOwner!: Options;

  defaultValueSiteCategory!: any;
  defaultValueBuilding!: any;
  defaultValueExchange!: any;
  defaultValueElectricCompany!: any;
  defaultValuePssOwner!: any;

  dataRegions!: any[];
  dataProvinces!:any[];
  dataTowns!:any[];
  dataBarangays!: any[];

  params!: any;
  select2Params!: any;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public siteService: SiteService,
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
        this.siteService.list(dataTablesParameters).subscribe(resp => {
          this.site = resp.data;
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
        { data: 'status' },
        { data: 'category_name' },
        { data: 'cabinet_type' },
        { data: 'address' },
        // { data: 'region' },
        // { data: 'province' },
        // { data: 'city_municipality' },
        // { data: 'barangay' },
        // { data: 'street' },
        { data: 'building_name' },
        { data: 'exchange_name' },
        { data: 'electric_company_name' },
        { data: 'electric_company_sin' },
        { data: 'electric_company_meter' },
        { data: 'pss_owner_name' },
        { data: null, title: "Actions", width: "10%", className: "dt-body-center", orderable: false, searchable: false},
      ]
    };

    this.siteForm = this.fb.group({
      id: ['', Validators.required],
      code: ['', Validators.required],
      name: ['', Validators.required],
      status: ['', Validators.required],
      category_code: ['', Validators.required],
      category_name: ['', Validators.required],
      cabinet_type: ['', Validators.required],
      region: ['', Validators.required],
      province: ['', Validators.required],
      city_municipality: ['', Validators.required],
      brgy: ['', Validators.required],
      street: ['', Validators.required],
      lot_no: ['', Validators.required],
      longitude: ['', Validators.required],
      latitude: ['', Validators.required],
      building_code: ['', Validators.required],
      building_name: ['', Validators.required],
      exchange_code: ['', Validators.required],
      exchange_name: ['', Validators.required],
      electric_company_code: ['', Validators.required],
      electric_company_name: ['', Validators.required],
      electric_company_sin: ['', Validators.required],
      electric_company_meter: ['', Validators.required],
      pss_owner_code: ['', Validators.required],
      pss_owner_name: ['', Validators.required],
    });

  }

  onChange($event: any) {
    let value = this.siteForm.get("category_code")?.value
    console.log(value);
  }

  onClick($event: any) {
    let value = this.siteForm.get("category_code")?.value
    console.log(value);
  }

  onChangeRegion($event: any) {

    let value = this.siteForm.get("region")?.value

    this.dataProvinces = [];
    this.dataTowns = [];
    this.dataBarangays = [];

    this.employeeService.provinces({region_code:value}).subscribe(async resp => {
      this.dataProvinces = await resp.results;
      console.log(resp)
    });

    this.siteForm.controls['province'].setValue(null);
    this.siteForm.controls['city_municipality'].setValue(null);
    this.siteForm.controls['brgy'].setValue(null);
 
  }

  onChangeProvince($event: any) {
    let value = this.siteForm.get("province")?.value

    this.employeeService.towns({province_code:value}).subscribe(async resp => {
      this.dataTowns = await resp.results;
      console.log(resp)
    });

    this.siteForm.controls['city_municipality'].setValue(null);
    this.siteForm.controls['brgy'].setValue(null);

    this.dataBarangays = [];

  }

  onChangeCityMunicipality($event: any) {
    let value = this.siteForm.get("city_municipality")?.value
    console.log(value);

    this.employeeService.brgy({town_code:value}).subscribe(async resp => {
      this.dataBarangays = await resp.results;
      console.log(resp)
    });

    this.siteForm.controls['brgy'].setValue(null);

  }

  add(targetModal:any) {
  
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      fullscreen: true,
      keyboard: true,
      size: 'xl',
    });

    this.status = [
      {
        id: 'Active',
        text: 'Active'
      },
      {
        id: 'Inactive',
        text: 'Inactive'
      }];

    //select2 status
    this.optionsStatus = {
      theme: "bootstrap",
      closeOnSelect: true,
      width: '100%',
      placeholder: 'Search Status',
    };

    this.optionsSiteCategory = this.siteService.select2data("bootstrap", false, true, "100%", environment.API_URL+"api/v1/site-category/select2", this.tokenService.getToken(), "", "Search Site Category");
    this.optionsBuilding = this.siteService.select2data("bootstrap", false, true, "100%", environment.API_URL+"api/v1/building/select2", this.tokenService.getToken(), "", "Search Building");
    this.optionsExchange = this.siteService.select2data("bootstrap", false, true, "100%", environment.API_URL+"api/v1/exchange/select2", this.tokenService.getToken(), "", "Search Exchange");
    this.optionsElectricCompany = this.siteService.select2data("bootstrap", false, true, "100%", environment.API_URL+"api/v1/electric-company/select2", this.tokenService.getToken(), "", "Search Electric Company");
    this.optionsPssOwner = this.siteService.select2data("bootstrap", false, true, "100%", environment.API_URL+"api/v1/pss-owner/select2", this.tokenService.getToken(), "", "Search PSS Owner");

    this.siteForm = this.fb.group({
      id: [''],
      code: [''],
      name: [''],
      status: [''],
      category_code: [''],
      category_name: [''],
      cabinet_type: [''],
      region: [''],
      province: [''],
      city_municipality: [''],
      brgy: [''],
      street: [''],
      lot_no: [''],
      longitude: [''],
      latitude: [''],
      building_code: [''],
      building_name: [''],
      exchange_code: [''],
      exchange_name: [''],
      electric_company_code: [''],
      electric_company_name: [''],
      electric_company_sin: [''],
      electric_company_meter: [''],
      pss_owner_code: [''],
      pss_owner_name: [''],
    });

    this.employeeService.regions({code:null}).subscribe( async resp => {
      this.dataRegions = await resp.results;
      console.log(resp)
    });

    this.employeeService.provinces({region_code:999999999}).subscribe(async resp => {
      this.dataProvinces = await resp.results;
      
      console.log(resp)
    });

    this.employeeService.towns({province_code:999999999}).subscribe(async resp => {
      this.dataTowns = await resp.results;
      console.log(resp)
    });

    this.employeeService.brgy({town_code:999999999}).subscribe(async resp => {
      this.dataBarangays = await resp.results;
      console.log(resp)
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

    this.status = [
      {
        id: 'Active',
        text: 'Active'
      },
      {
        id: 'Inactive',
        text: 'Inactive'
      }];

    //select2 status
    this.optionsStatus = {
      theme: "bootstrap",
      closeOnSelect: true,
      width: '100%',
      placeholder: 'Search Status',
    };

    if(raw.category_code) {
      this.defaultValueSiteCategory = [
        {
          id: raw.category_code,
          text: raw.category_name,
        }
      ];
    }
    
    if(raw.building_code){ //check if building_code is not null
      this.defaultValueBuilding = [
        {
          id: raw.building_code,
          text: raw.building_name,
        }
      ];
    }
    
    if(raw.exchange_code){ //check if exchange_code is not null
      this.defaultValueExchange = [
        {
          id: raw.exchange_code,
          text: raw.exchange_name,
        }
      ];
    }

    if(raw.electric_company_code){ //check if electric_company_code is not null
      this.defaultValueElectricCompany = [
        {
          id: raw.electric_company_code,
          text: raw.electric_company_name,
        }
      ];
    }


    if(raw.pss_owner_code){ //check if pss_owner_code is not null
      this.defaultValuePssOwner = [
        {
          id: raw.pss_owner_code,
          text: raw.pss_owner_name,
        }
      ];
    }

    this.optionsSiteCategory = this.siteService.select2data("bootstrap", false, true, "100%", environment.API_URL+"api/v1/site-category/select2", this.tokenService.getToken(), "", "Search Site Category");
    this.optionsBuilding = this.siteService.select2data("bootstrap", false, true, "100%", environment.API_URL+"api/v1/building/select2", this.tokenService.getToken(), "", "Search Building");
    this.optionsExchange = this.siteService.select2data("bootstrap", false, true, "100%", environment.API_URL+"api/v1/exchange/select2", this.tokenService.getToken(), "", "Search Exchange");
    this.optionsElectricCompany = this.siteService.select2data("bootstrap", false, true, "100%", environment.API_URL+"api/v1/electric-company/select2", this.tokenService.getToken(), "", "Search Electric Company");
    this.optionsPssOwner = this.siteService.select2data("bootstrap", false, true, "100%", environment.API_URL+"api/v1/pss-owner/select2", this.tokenService.getToken(), "", "Search PSS Owner");

    this.siteForm.patchValue({
      id: raw.id,
      code: raw.code,
      site_id: raw.site_id,
      name: raw.name,
      status: raw.status,
      category_code: raw.category_code,
      category_name: raw.category_name,
      cabinet_type: raw.cabinet_type,
      region: raw.region_code,
      province: raw.province_code,
      city_municipality: raw.city_municipality_code,
      brgy: raw.brgy_code,
      street: raw.street,
      lot_no: raw.lot_no,
      longitude: raw.longitude,
      latitude: raw.latitude,
      building_code: raw.building_code,
      exchange_code: raw.exchange_code,
      electric_company_code: raw.electric_company_code,
      electric_company_name: raw.electric_company_name,
      electric_company_sin: raw.electric_company_sin,
      electric_company_meter: raw.electric_company_meter,
      pss_owner_code: raw.pss_owner_code,

    });

    this.employeeService.regions({code:null}).subscribe( async resp => {
      this.dataRegions = await resp.results;
      console.log(resp)
    });

    this.employeeService.provinces({region_code:raw.region_code}).subscribe(async resp => {
      this.dataProvinces = await resp.results;
      
      console.log(resp)
    });

    this.employeeService.towns({province_code:raw.province_code}).subscribe(async resp => {
      this.dataTowns = await resp.results;
      console.log(resp)
    });

    this.employeeService.brgy({town_code:raw.city_municipality_code}).subscribe(async resp => {
      this.dataBarangays = await resp.results;
      console.log(resp)
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

        this.siteService.delete(raw).subscribe((data: any) => {

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
    
    const raw = this.siteForm.getRawValue();
    console.log(raw)

    await this.siteService.save(raw).subscribe((data: any) => {

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
    
    const raw = this.siteForm.getRawValue();
    console.log(raw)

    await this.siteService.update(raw).subscribe((data: any) => {

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
