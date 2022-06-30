import { AfterViewInit, Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../shared/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective,  } from 'angular-datatables';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeesService } from '../employees/employees.service';
import { TrainingService } from './training.service';
import { TrainingHistoryService } from './training-history.service';
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
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
 
  public defaultValue!: Array<Select2OptionData>;
  
  @ViewChild(DataTableDirective, {static: false})
  
  
  dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  dtOptionsTrainingHistory: DataTables.Settings = {};
  trainings: any[]= [];
  trainingHistory: any[]= [];
  
  trainingForm!: FormGroup;
  trainingHistoryForm!: FormGroup;

  public options!: Options;

  params!: any;
  select2Params!: any;
  title!: any;
  selected2Value!: any;
  editTrainingModal!: any
  value1!: any

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public employeeService: EmployeesService,
    public trainingService: TrainingService,
    public trainingHistoryService: TrainingHistoryService,
    public tokenService: TokenService
  ) { }

  ngOnInit(): void {
    
    this.loadTrainings();

  }

  loadTrainings() {

    this.dtOptions = {
      destroy: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      scrollX: true,
      ajax: (dataTablesParameters: any, callback) => {
       
        console.log(dataTablesParameters)
        this.trainingService.list(dataTablesParameters).subscribe(resp => {
          this.trainings = resp.data;
          console.log(resp)

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: resp.data
          });
        });

      },
      columns: [
        { data: 'code', width: "30%"  }, 
        { data: 'title' },
        { data: null, defaultContent:'asdf', title: "Actions", width: "10%", className: "dt-body-center", orderable: false},
      ]
    };

    this.trainingForm = this.fb.group({
      id: ['', Validators.required],
      code: ['', Validators.required],
      title: ['', Validators.required],
    });

  }

  add(targetModal:any) {
  
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      fullscreen: true,
      keyboard: true,
      // size: 'xl',
    });

    this.trainingForm = this.fb.group({
      id: [''],
      code: [''],
      title: ['']
    });

  }

  edit(targetModal:any, raw:any) {

    console.log(raw)

    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      fullscreen: true,
      keyboard: true,
      // size: 'xl',
    });

    this.trainingForm.patchValue({
      id: raw.id,
      code: raw.code,
      title: raw.title,
    });

  }

  view(targetModal:any, raw:any) {

    this.title = raw.title;

    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      fullscreen: true,
      keyboard: true,
      size: 'xl',
    });

    // dtables
    this.dtOptionsTrainingHistory = {
      destroy: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      stateSave: true,
      scrollX: true,
      ajax: (dataTablesParameters: any, callback) => {
       
        dataTablesParameters['training_code'] = raw.code;
        console.log(dataTablesParameters)
        this.trainingHistory = [];
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
        { data: 'employee_id', width:'6%'}, 
        { data: 'employee_name', width: '20%'}, 
        { data: 'certification', width: '30%'}, 
        { data: 'start_date', width: '14%'}, 
        { data: 'end_date', width: '14%'}, 
        { data: 'title_validity_date', title: "Validity Date", width: '11%'}, 
        { data: null, title: 'Actions', width: '5%', orderable:false},      
      ],

    };

    //select2
    this.options = {
      theme: "bootstrap",
      multiple: true,
      closeOnSelect: false,
      width: '100%',
      ajax: {
        headers: {
          "Authorization" : "Bearer "+this.tokenService.getToken(),
          "Content-Type" : "application/json",
        },
        url: "http://localhost/laravel-jwt-auth/backend/api/v1/employee/select2",
        data: function (params:any) {

          params['training_code'] = raw.code;
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

    console.log(raw)
    this.trainingHistoryForm = this.fb.group({
      id: [''],
      training_code: raw.code,
      employee_id: [''],
      certification: [''],
      start_date: [''],
      end_date: [''],
      title_validity_date: [''],
    });

  }

  editTraining(targetModal:any, raw:any) {
 
    console.log(raw)

    this.editTrainingModal = this.modalService.open(targetModal, {
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

    this.value1 = raw.employee_id;
   


    
// select2
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
          url: "http://localhost/laravel-jwt-auth/backend/api/v1/employee/select2",
          data: function (params:any) {

            params['training_code'] = raw.training_code;
            console.log(params)
            var query = {
              search: params.term,
              page: params.page || 1,
              training_code: params.training_code
            }
            // Query parameters will be ?search=[term]&type=public
            console.log(query)
            return query;
          },
          type: "get",
          dataType: 'json',
          delay: 100,
          cache: true,
          pagination: {
            more: true
          }
      },
      value: "",
      placeholder: 'Search employee',
      language: {
        noResults: function () {
            return "No records found!";
        }
    },
      
    };

  
      
    this.trainingHistoryForm.patchValue({
      id: raw.id,
      code: raw.code,
      training_code: raw.training_code,
      employee_id: raw.employee_id,
      certification: raw.certification,
      start_date: raw.training_history.start_date,
      end_date: raw.training_history.end_date,
      title_validity_date: raw.title_validity_date,
    });


  }

   removeTraining(raw: any) {
    
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

        this.trainingHistoryService.delete(raw).subscribe((data: any) => {

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

  async onSubmitSave(): Promise<any> {
    
    const raw = this.trainingForm.getRawValue();
    console.log(raw)

    await this.trainingService.save(raw).subscribe((data: any) => {

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
    
    const raw = this.trainingForm.getRawValue();
    console.log(raw)

    await this.trainingService.update(raw).subscribe((data: any) => {

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

  async onSubmitTrainingHistory(): Promise<any> {
    
    const raw = this.trainingHistoryForm.getRawValue();
    console.log(raw)

    await this.trainingHistoryService.save(raw).subscribe((data: any) => {

      console.log(data)
      $('#dt1').DataTable().ajax.reload();

      Swal.fire({
        // position: 'top-end',
        icon: 'success',
        title: 'Successfully save!',
        showConfirmButton: false,
        timer: 1500
      })

      this.trainingHistoryForm = this.fb.group({
        id: [''],
        training_code: raw.training_code,
        employee_id: [''],
        certification: [''],
        start_date: [''],
        end_date: [''],
        title_validity_date: [''],
      });
      
    });

  }

  async onUpdateTrainingHistory(): Promise<any> {
    
    const raw = this.trainingHistoryForm.getRawValue();
    console.log(raw)

    await this.trainingHistoryService.update(raw).subscribe((data: any) => {

      console.log(data)
      $('#dt1').DataTable().ajax.reload();

      Swal.fire({
        // position: 'top-end',
        icon: 'success',
        title: 'Successfully save!',
        showConfirmButton: false,
        timer: 1500
      })

      this.trainingHistoryForm = this.fb.group({
        id: [''],
        training_code: raw.training_code,
        employee_id: [''],
        certification: [''],
        start_date: [''],
        end_date: [''],
        title_validity_date: [''],
      });

      this.editTrainingModal.dismiss();
      
    });

  }

}
