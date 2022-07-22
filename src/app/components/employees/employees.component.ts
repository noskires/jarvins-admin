import { AfterViewInit, Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './../../shared/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective,  } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeesService } from './employees.service';
import { TrainingHistoryService } from '../training/training-history.service';
import Swal from 'sweetalert2'
import { TteService } from '../tte/tte.service';
import { SvService } from '../sv/sv.service';
import { TokenService } from 'src/app/shared/token.service'; 
import { SiteService } from '../site/site.service';
// import { environment } 
import { environment } from '../../../environments/environment';

// require('dotenv').config();


// require('dotenv').config();

declare var angular: any;
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

export interface OptionsStatus {
  theme: string,
  closeOnSelect: boolean,
  width:string, 
  placeholder: string,
}

export interface OptionsFloor {
  theme: string,
  width:string, 
  closeOnSelect: boolean,
  placeholder: string,
}
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  

  @ViewChild(DataTableDirective, {static: false})
  dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtOptionsTrainingHistory: DataTables.Settings = {};
  dtOptionsTte: DataTables.Settings = {};

  users: any[]= [];
  user: any;

  trainingHistory: any[]= [];
  tte: any[]= [];
  sv: any[]= [];

  public options!: Options;
  public optionsBuilding!: Options;
  public optionsFloor!: OptionsFloor;

  defaultImmediateSupervisor!: any;
  defaultBuilding!: any;

  floors!: any;
 

  editProfileForm!: FormGroup;
  employeeForm!: FormGroup;

  public optionsRegions!: Options;
  public optionsProvinces!: OptionsStatus;
  public optionsTowns!: OptionsStatus;
  public optionsBarangays!: OptionsStatus;

  defaultValueRegion!: any;
  defaultValueProvince!: any;
  defaultValueCityMunicipality!: any;
  defaultValueBrgy!: any;
 
  dataRegions!: any[];
  dataProvinces!:any[];
  dataTowns!:any[];
  dataBarangays!: any[];

  dataCenters!: any[];
  dataDivisions!: any[];
  dataSections!: any[];

  region!: any;
  province!: any;
  town!: any;
  
  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public employeeService: EmployeesService,
    public trainingHistoryService: TrainingHistoryService,
    public tteService: TteService,
    public svService: SvService,
    public siteService: SiteService,
    public tokenService: TokenService
  ) {

    
   }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      var id = params.get('id');
      console.log(id);
    });

    // process.env.SECRET_KEY;

    // alert(environment.API_KEY);
// console.log(process.env)
 

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
      responsive: true,
      // scrollX: true,
      
      ajax: (dataTablesParameters: any, callback) => {
       
        console.log(dataTablesParameters)
        this.employeeService.list(dataTablesParameters).subscribe(async resp => {
            that.users = await resp.data;
            console.log(resp)

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [
        { data: 'employees.entity_code', title: "Entity", width: '5%' }, 
        { data: 'employees.employee_id', title: "ID#", width: '5%' }, 
        { data: 'employee_name', title: "Name", width: '20%' },
        // { data: 'email_address' },
        { data: 'employees.date_hired' },
        { data: 'employees.employment_status' },
        { data: 'employees.employee_subgroup' },
        { data: 'employees.position' },
        { data: null, title:'Actions', width: '5%', searchable: false }, 
      ]
    };

    this.employeeForm = this.fb.group({
      id: ['', Validators.required],
      employee_id: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      middle_name: ['', Validators.required],
      affix: ['', Validators.required],
      gender: ['', Validators.required],
      region: ['', Validators.required],
      province: ['', Validators.required,],
      city_municipality: ['', Validators.required],
      brgy: ['', Validators.required],
      street: ['', Validators.required],
      lot_no: ['', Validators.required],
      civil_status: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      mobile_number: ['', Validators.required],
      employment_status: ['', Validators.required],
      employee_subgroup: ['', Validators.required],
      leadership_role: ['', Validators.required],
      entity_code: ['', Validators.required],
      position: ['', Validators.required],
      date_hired: ['', Validators.required],
      email_address: ['', Validators.required],
      office_floor: ['', Validators.required],
      office_building: ['', Validators.required],
      section: ['', Validators.required],
      division: ['', Validators.required],
      center: ['', Validators.required],
      action_type: ['', Validators.required],
      action_date: ['', Validators.required],
      remarks: ['', Validators.required],
      immediate_supervisor: ['', Validators.required]
    })

  }
  
  // ngAfterViewInit(): void {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     dtInstance.columns().every(function () {
  //       const that = this;
  //       $('input', this.footer()).on('keyup change', function () {
  //         if (that.search() !== this['value']) {
  //           that
  //             .search(this['value'])
  //             .draw();
  //         }
  //       });
  //     });
  //   });
  // }

  onChangeRegion($event: any) {

    let value = this.employeeForm.get("region")?.value

    this.dataProvinces = [];
    this.dataTowns = [];
    this.dataBarangays = [];

    this.employeeService.provinces({region_code:value}).subscribe(async resp => {
      this.dataProvinces = await resp.results;
      console.log(resp)
    });

    this.employeeForm.controls['province'].setValue(null);
    this.employeeForm.controls['city_municipality'].setValue(null);
    this.employeeForm.controls['brgy'].setValue(null);
    
    this.optionsProvinces= {
      theme: "bootstrap",
      closeOnSelect: true,
      width: '100%',
      placeholder: 'Search Province',
    };
 
  }

  onChangeProvince($event: any) {
    let value = this.employeeForm.get("province")?.value

    this.employeeService.towns({province_code:value}).subscribe(async resp => {
      this.dataTowns = await resp.results;
      console.log(resp)
    });

    this.employeeForm.controls['city_municipality'].setValue(null);
    this.employeeForm.controls['brgy'].setValue(null);
    
    this.optionsTowns= {
      theme: "bootstrap",
      closeOnSelect: true,
      width: '100%',
      placeholder: 'Search Town',
    };

    this.dataBarangays = [];

  }

  onChangeCityMunicipality($event: any) {
    let value = this.employeeForm.get("city_municipality")?.value
    console.log(value);

    this.employeeService.brgy({town_code:value}).subscribe(async resp => {
      this.dataBarangays = await resp.results;
      console.log(resp)
    });

    this.employeeForm.controls['brgy'].setValue(null);
    
    this.optionsBarangays= {
      theme: "bootstrap",
      closeOnSelect: true,
      width: '100%',
      placeholder: 'Search Brgy',
    };
  }

  onChangeBrgy($event: any) {
    let value = this.employeeForm.get("brgy")?.value
    console.log(value);

    this.optionsBarangays= {
      theme: "bootstrap",
      closeOnSelect: true,
      width: '100%',
      placeholder: 'Search Brgy2',
    };
  }

  onChangeCenter($event: any) {

    let value = this.employeeForm.get("center")?.value

    this.employeeService.divisions({center_code:value}).subscribe(async resp => {
      this.dataDivisions = await resp.results;
      console.log(resp)
    });


    this.employeeForm.controls['division'].setValue(null);
    this.employeeForm.controls['section'].setValue(null);
  
  }

  onChangeDivision($event: any) {

    let value = this.employeeForm.get("division")?.value

    this.employeeService.sections({division_code:value}).subscribe(async resp => {
      this.dataSections = await resp.results;
      console.log(resp)
    });

    // this.employeeForm.controls['section'].setValue(null);
    
  }
  
  add(targetModal:any) {
  
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      fullscreen: true,
      keyboard: true,
      size: 'xl',
    });

    this.employeeForm = this.fb.group({
      id: [''],
      employee_id: [''],
      first_name: [''],
      middle_name: [''],
      last_name: [''],
      affix: [''],
      gender: [null],
      region: [null],
      province: [null],
      city_municipality: [null],
      brgy: [null],
      street: [''],
      lot_no: [''],
      civil_status: [null],
      date_of_birth: [''],
      mobile_number: [''],
      employment_status: [null],
      employee_subgroup: [null],
      leadership_role: [''],
      entity_code: [null],
      position: [''],
      date_hired: [''],
      email_address: [''],
      office_floor: [''],
      office_building: [''],
      section: [null],
      division: [null],
      center: [null],
      action_type: [null],
      action_date: [''],
      remarks: [''],
      immediate_supervisor: [''],
    });

    // this.employeeForm.controls['region'].setValue(null);
    // this.employeeForm.controls['province'].setValue(null);
    // this.employeeForm.controls['city_municipality'].setValue(null);
    // this.employeeForm.controls['brgy'].setValue(null);

    this.employeeService.regions({code:null}).subscribe(async resp => {
      this.dataRegions = await resp.results;
      console.log(resp)
    });

    this.employeeService.provinces({region_code:99999999}).subscribe(async resp => {
      this.dataProvinces = await resp.results;
      console.log(resp)
    });

    this.employeeService.centers({code:null}).subscribe(async resp => {
      this.dataCenters = await resp.results;
      console.log(resp)
    });

    this.employeeService.divisions({center_code:99999999}).subscribe(async resp => {
      this.dataDivisions = await resp.results;
      console.log(resp)
    });

    this.employeeService.sections({division_code:99999999}).subscribe(async resp => {
      this.dataSections = await resp.results;
      console.log(resp)
    });

    //select2
    this.options = {
      theme: "bootstrap",
      multiple: false,
      closeOnSelect: true,
      width: '100%',
      ajax: {
        headers: {
          "Authorization" : "Bearer "+this.tokenService.getToken(),
          "Content-Type" : "application/json",
        },
        url: environment.API_URL+"api/v1/employee/select2",
        data: function (params:any) {

   
          console.log(params)
          var query = {
            search: params.term,
            training_code: params.training_code
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

    this.optionsBuilding = this.siteService.select2data("bootstrap", false, true, "100%", environment.API_URL+"api/v1/building/select2", this.tokenService.getToken(), "", "Search Building");

    this.floors = [
      { id: '1st', text: '1st' },
      { id: 'Mezzanine', text: 'Mezzanine' },
      { id: '2nd', text: '2nd' },
      { id: '3rd', text: '3rd' },
      { id: '4th', text: '4th' },
      { id: '5th', text: '5th' },
      { id: '6th', text: '6th' },
      { id: '7th', text: '7th' },
      { id: '8th', text: '8th' },
      { id: '9th', text: '9th' },
      { id: '10th', text: '10th' },
      { id: '11th', text: '1st' },
      { id: '12th', text: '12th' },
      { id: '13th', text: '13th' },
      { id: '14th', text: '14th' },
      { id: '15th', text: '15th' },
      { id: '16th', text: '16th' },
      { id: '17th', text: '17th' },
      { id: '18th', text: '18th' },
      { id: '19th', text: '19th' },
      { id: '20th', text: '20th' },
      { id: '21st', text: '21st' },
      { id: '22nd', text: '22nd' },
      { id: '23rd', text: '23rd' },
      { id: '24th', text: '24th' },
      { id: '25th', text: '25th' },
      { id: '26th', text: '26th' },
      { id: '27th', text: '27th' },
      { id: '28th', text: '28th' },
      { id: '29th', text: '29th' },
      { id: '30th', text: '30th' },
      { id: '31st', text: '31st' },
      { id: '32nd', text: '32nd' },
      { id: '33rd', text: '33rd' },
      { id: '34th', text: '34th' },
      { id: '35th', text: '35th' },
      { id: '36th', text: '36th' },
      { id: '37th', text: '37th' },
      { id: '38th', text: '38th' },
      { id: '39th', text: '39th' },
      { id: '40th', text: '40th' },
      { id: '41st', text: '41st' },
      { id: '42nd', text: '42nd' },
      { id: '43rd', text: '43rd' },
      { id: '44th', text: '44th' },
      { id: '45th', text: '45th' },
      { id: '46th', text: '46th' },
      { id: '47th', text: '47th' },
      { id: '48th', text: '48th' },
      { id: '49th', text: '49th' },
      { id: '50th', text: '50th' },
      { id: 'Roof top', text: 'Roof top' },
    ];

    //select2 status
    this.optionsFloor = {
      theme: "bootstrap",
      closeOnSelect: true,
      width: '100%',
      placeholder: 'Search Floor',
    };

  }
 
  edit(targetModal:any, raw:any) {
 
    console.log(raw)

    this.region = raw.region_code;

    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      fullscreen: true,
      keyboard: true,
      size: 'xl',
    });
   
    this.employeeForm.patchValue({
      id: raw.id,
      employee_id: raw.employee_id,
      first_name: raw.first_name,
      last_name: raw.last_name,
      middle_name: raw.middle_name,
      affix: raw.affix,
      gender: raw.gender,
      region: raw.region_code,
      province: raw.province_code,
      city_municipality: raw.city_municipality_code,
      brgy: raw.brgy_code,
      street: raw.street,
      lot_no: raw.lot_no,
      civil_status: raw.civil_status,
      date_of_birth: raw.date_of_birth,
      mobile_number: raw.mobile_number,
      employment_status: raw.employment_status,
      employee_subgroup: raw.employee_subgroup,
      leadership_role: raw.leadership_role,
      entity_code: raw.entity_code,
      position: raw.position,
      date_hired: raw.date_hired,
      email_address: raw.email_address,
      office_floor: raw.office_floor,
      office_building: raw.office_building,
      section: raw.section_code,
      division: raw.division_code,
      center: raw.center_code,
      action_type: raw.action_type,
      action_date: raw.action_date,
      remarks: raw.remarks,
      immediate_supervisor: raw.immediate_supervisor,
    });

    if(raw.region_code) {
      this.defaultValueRegion = [
        {
          id: raw.region_code,
          text: raw.region_name,
        }
      ];
    }

    // this.optionsRegions = this.employeeService.select2data("bootstrap", false, true, "100%", environment.API_URL+"api/v1/geo/regions/select2", this.tokenService.getToken(), "", "Search Region");
    // // this.optionsProvinces = this.employeeService.select2data("bootstrap", false, true, "100%", environment.API_URL+"api/v1/geo/nothing", this.tokenService.getToken(), "", "Search Province");
    // // this.optionsTowns = this.employeeService.select2data("bootstrap", false, true, "100%", environment.API_URL+"api/v1/geo/nothing", this.tokenService.getToken(), "", "Search Town");
    // // this.optionsBarangays = this.employeeService.select2data("bootstrap", false, true, "100%", environment.API_URL+"api/v1/geo/nothing", this.tokenService.getToken(), "", "Search Brgy");
   
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


    this.employeeService.centers({code:null}).subscribe(async resp => {
      this.dataCenters = await resp.results;
      console.log(resp)
    });

    this.employeeService.divisions({center_code:raw.center_code}).subscribe(async resp => {
      this.dataDivisions = await resp.results;
      console.log(resp)
    });

    this.employeeService.sections({division_code:raw.division_code}).subscribe(async resp => {
      this.dataSections = await resp.results;
      console.log(resp)
    });

    //select2
    this.options = {
      theme: "bootstrap",
      multiple: false,
      closeOnSelect: true,
      width: '100%',
      ajax: {
        headers: {
          "Authorization" : "Bearer "+this.tokenService.getToken(),
          "Content-Type" : "application/json",
        },
        url: environment.API_URL+"api/v1/employee/select2",
        data: function (params:any) {

   
          console.log(params)
          var query = {
            search: params.term,
            training_code: params.training_code
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

    this.defaultImmediateSupervisor = [
      {
        id: raw.immediate_supervisor,
        text: raw.immediate_supervisor_name
      }
    ];
    
    this.optionsBuilding = this.siteService.select2data("bootstrap", false, true, "100%", environment.API_URL+"api/v1/building/select2", this.tokenService.getToken(), "", "Search Building");

    this.defaultBuilding = [
      {
        id: raw.office_building,
        text: raw.office_building_name
      }
    ];

    this.floors = [
      { id: '1st', text: '1st' },
      { id: 'Mezzanine', text: 'Mezzanine' },
      { id: '2nd', text: '2nd' },
      { id: '3rd', text: '3rd' },
      { id: '4th', text: '4th' },
      { id: '5th', text: '5th' },
      { id: '6th', text: '6th' },
      { id: '7th', text: '7th' },
      { id: '8th', text: '8th' },
      { id: '9th', text: '9th' },
      { id: '10th', text: '10th' },
      { id: '11th', text: '1st' },
      { id: '12th', text: '12th' },
      { id: '13th', text: '13th' },
      { id: '14th', text: '14th' },
      { id: '15th', text: '15th' },
      { id: '16th', text: '16th' },
      { id: '17th', text: '17th' },
      { id: '18th', text: '18th' },
      { id: '19th', text: '19th' },
      { id: '20th', text: '20th' },
      { id: '21st', text: '21st' },
      { id: '22nd', text: '22nd' },
      { id: '23rd', text: '23rd' },
      { id: '24th', text: '24th' },
      { id: '25th', text: '25th' },
      { id: '26th', text: '26th' },
      { id: '27th', text: '27th' },
      { id: '28th', text: '28th' },
      { id: '29th', text: '29th' },
      { id: '30th', text: '30th' },
      { id: '31st', text: '31st' },
      { id: '32nd', text: '32nd' },
      { id: '33rd', text: '33rd' },
      { id: '34th', text: '34th' },
      { id: '35th', text: '35th' },
      { id: '36th', text: '36th' },
      { id: '37th', text: '37th' },
      { id: '38th', text: '38th' },
      { id: '39th', text: '39th' },
      { id: '40th', text: '40th' },
      { id: '41st', text: '41st' },
      { id: '42nd', text: '42nd' },
      { id: '43rd', text: '43rd' },
      { id: '44th', text: '44th' },
      { id: '45th', text: '45th' },
      { id: '46th', text: '46th' },
      { id: '47th', text: '47th' },
      { id: '48th', text: '48th' },
      { id: '49th', text: '49th' },
      { id: '50th', text: '50th' },
      { id: 'Roof top', text: 'Roof top' },
    ];

    //select2 status
    this.optionsFloor = {
      theme: "bootstrap",
      closeOnSelect: true,
      width: '100%',
      placeholder: 'Search Floor',
    };
  }

  remove(raw:any) {
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

        // this.trainingHistoryService.delete(raw).subscribe((data: any) => {

          $('#dt1').DataTable().ajax.reload();

          Swal.fire(
            'Deleted!',
            'Record has been deleted.',
            'success'
          )

        // });

      }
    })
  }

  view(targetModal:any, user:any) {
 
    console.log(user)

    this.user = user;

    this.modalService.open(targetModal, {
     centered: true,
     backdrop: 'static',
     fullscreen: true,
     keyboard: true,
     size: 'xl',
     
    });
   

    //trainings
    this.dtOptionsTrainingHistory = {
      destroy: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      stateSave: true,
      responsive: true,
      // scrollX: true,
      ajax: (dataTablesParameters: any, callback) => {

        dataTablesParameters['employee_id'] = user.employee_id;
        console.log(dataTablesParameters)

        this.trainingHistoryService.list(dataTablesParameters).subscribe(resp => {
          this.trainingHistory = resp.data;
          console.log(resp)

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });

        });
      },
      columns: [ 
        { data: 't.title', width: '30%'}, 
        { data: 'certification', width: '30%'}, 
        { data: 'start_date', width: '14%'}, 
        { data: 'end_date', width: '14%'}, 
        { data: 'title_validity_date', title: "Validity Date", width: '12%'} 
      ],

    };


    // tte
    this.dtOptionsTte = {
      destroy: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      // scrollX: true,
      ajax: (dataTablesParameters: any, callback) => {
       
        dataTablesParameters['employee_id'] = user.employee_id;
        console.log(dataTablesParameters)

        this.tteService.list(dataTablesParameters).subscribe(resp => {
          this.tte = resp.data;
          console.log(resp)

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });

      },
      columns: [
        { data: 'description' },
        { data: 'category' },
        { data: 'quantity' },
        { data: 'brand' },
        { data: 'serial_number' },
        { data: 'calibration_validity_date' },
        { data: 'date_received' },
        { data: 'tte_condition' }
      ]
    };

    // sv
    this.dtOptions = {
      destroy: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      // scrollX: true,
      ajax: (dataTablesParameters: any, callback) => {
       
        dataTablesParameters['employee_id'] = user.employee_id;
        console.log(dataTablesParameters)
        this.svService.list(dataTablesParameters).subscribe(resp => {
          this.sv = resp.data;
          console.log(resp)

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
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
        // { data: 'engine_serial_no' },
        // { data: 'chassis_serial_no' },
        // { data: 'body_serial_no' },
        // { data: 'or_no' },
        // { data: 'fleet_card_no' },
        // { data: 'fuel_allocation' }
      ]
    };

  }

  downloadFile(route: string, filename: string): void{

    const baseUrl = environment.API_URL+'api/v1/employee/export';
    const token = "Bearer "+this.tokenService.getToken();
    const headers = new HttpHeaders().set('Authorization', token);
    this.http.get(baseUrl,{headers, responseType: 'blob' as 'json'}).subscribe(
        (response: any) =>{
            let dataType = response.type;
            let binaryData = [];
            binaryData.push(response);
            let downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
            if (filename)
                downloadLink.setAttribute('download', filename);
            document.body.appendChild(downloadLink);
            downloadLink.click();
        }
    )
  }

  async onSubmitSave(): Promise<any> {
    
    
    const raw = this.employeeForm.getRawValue();
    console.log(raw)

    await this.employeeService.save(raw).subscribe((data: any) => {

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
    
    
    const raw = this.employeeForm.getRawValue();
    console.log(raw)

    await this.employeeService.update(raw).subscribe((data: any) => {

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

  // async onSubmit(): Promise<any> {
  //   this.modalService.dismissAll();
  //   const user = this.editProfileForm.getRawValue();

  //   await this.authService.update(user).subscribe((data: any) => {

  //     console.log(data)
  //     this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //       dtInstance.draw();
  //     });

  //   });

  // }

}
