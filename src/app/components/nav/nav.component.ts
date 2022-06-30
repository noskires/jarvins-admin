import { Component, OnInit } from '@angular/core';
import { Select2OptionData } from 'ng-select2';
import { TokenService } from 'src/app/shared/token.service';

export interface Options {
  minimumInputLength: number,
  minimumResultsForSearch: number,
  theme: string,
  width:string,
  multiple: boolean,
  closeOnSelect: boolean,
  ajax: object,
  placeholder: string,
  value: string,
  language: object,
 
}
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public options!: Options;

  constructor(
    public tokenService: TokenService
  ) { }

  ngOnInit(): void {

    this.options = {
      minimumInputLength: 1,
      minimumResultsForSearch: 10,
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

            console.log(params)
            var query = {
              search: params.term,
              page: params.page || 1,
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


  }

}
