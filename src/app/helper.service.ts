import { Injectable, OnInit } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({
  providedIn: 'root'
})

// const can = (permissions:any, can:any) => {
//   if (permissions) {
//       return permissions.some(r => can.includes(r))
//   }

//   return false; 
// };



export class HelperService {

  // r:any;

  constructor() { }
  
  testHelper(){
    console.log('hello');
    return 'Called, Hellper method.';

  }



}
