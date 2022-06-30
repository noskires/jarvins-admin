import { AfterViewInit, Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../shared/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective,  } from 'angular-datatables';
import { Router, ActivatedRoute } from '@angular/router';
import { ElectricCompanyService } from './electric-company.service';
import { TokenService } from "../../shared/token.service";
import { Select2OptionData } from 'ng-select2';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-electric-company',
  templateUrl: './electric-company.component.html',
  styleUrls: ['./electric-company.component.css']
})
export class ElectricCompanyComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})

  dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  electricCompany: any[]= [];
  status: any[]= [];
  
  electricCompanyForm!: FormGroup;


  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public electricCompanyService: ElectricCompanyService,
    public tokenService: TokenService
  ) { }

  ngOnInit(): void {

    this.dtOptions = {
      destroy: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
     
      ajax: (dataTablesParameters: any, callback) => {
       
        console.log(dataTablesParameters)
        this.electricCompanyService.list(dataTablesParameters).subscribe(resp => {
          this.electricCompany = resp.data;
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
        { data: 'sin' },
        { data: 'meter' },
        { data: 'address' },
        { data: 'concat_no' },
        { data: null, title: "Actions", width: "10%", className: "dt-body-center", orderable: false, searchable: false},
      ]
    };

    this.electricCompanyForm = this.fb.group({
      id: ['', Validators.required],
      code: ['', Validators.required],
      name: ['', Validators.required],
      sin: ['', Validators.required],
      meter: ['', Validators.required],
      address: ['', Validators.required],
      contact_no: ['', Validators.required],
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

    this.electricCompanyForm = this.fb.group({
      id: [''],
      code: [''],
      name: [''],
      sin: [''],
      meter: [''],
      address: [''],
      contact_no: [''],
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

    this.electricCompanyForm.patchValue({
      id: raw.id,
      code: raw.code,
      name: raw.name,
      sin: raw.sin,
      meter: raw.meter,
      address: raw.address,
      contact_no: raw.contact_no,
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

        this.electricCompanyService.delete(raw).subscribe((data: any) => {

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
    
    const raw = this.electricCompanyForm.getRawValue();
    console.log(raw)

    await this.electricCompanyService.save(raw).subscribe((data: any) => {

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
    
    const raw = this.electricCompanyForm.getRawValue();
    console.log(raw)

    await this.electricCompanyService.update(raw).subscribe((data: any) => {

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
