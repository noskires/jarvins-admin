import { AfterViewInit, Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../shared/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataTableDirective,  } from 'angular-datatables';
import { Router, ActivatedRoute } from '@angular/router';
import { AuditsService } from './audits.service';
import { TokenService } from "../../shared/token.service";
import { Select2OptionData } from 'ng-select2';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.css']
})
export class AuditsComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})

  dtElement!: DataTableDirective;

  dtOptions: DataTables.Settings = {};
  audit: any[]= [];
  status: any[]= [];
  
  buildingForm!: FormGroup;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public auditService: AuditsService,
    public tokenService: TokenService
  ) { }

  ngOnInit(): void {

    this.dtOptions = {
      // destroy: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      // processing: true,
      // responsive: true,
      scrollX: true,
      ajax: (dataTablesParameters: any, callback) => {
       
        console.log(dataTablesParameters)
        this.auditService.list(dataTablesParameters).subscribe(resp => {
          this.audit = resp.data;
          console.log(resp)

          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
        
      },
      columns: [
        { data: 'id' },
        { data: 'user_type' },
        { data: 'email' },
        { data: 'auditable_id' },
        { data: 'auditable_type' },
        { data: 'url' },
        { data: 'ip_address' },
        { data: 'old_values' },
        { data: 'new_values'},


        
      ]
    };

    this.buildingForm = this.fb.group({
      id: ['', Validators.required],
      code: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
    });

  }

}
