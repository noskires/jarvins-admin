import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery'
// import * as AdminLte from 'admin-lte';

declare const App: any;
// declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    App.initMainPage();
    // $('[data-widget="treeview"]').Treeview('init');
    // $(document).ready(() => {
    //   const trees: any = $('[data-widget="tree"]');
    //   trees.tree();
    // });
  }

  

}


