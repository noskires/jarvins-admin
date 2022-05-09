import { AfterViewInit, Component, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../shared/auth.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DataTableDirective,  } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexTooltip,
  ApexXAxis,
  ApexLegend,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexYAxis
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  markers: any; //ApexMarkers;
  stroke: any; //ApexStroke;
  yaxis: ApexYAxis | ApexYAxis[];
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
};


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  loader = true;
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions!: Partial<ChartOptions>;



    constructor(
      private http: HttpClient,
      public authService: AuthService,
      private modalService: NgbModal,
      private fb: FormBuilder,
      private router: Router
      ) {
  
    }
  

  ngOnInit(): void {

    this.chartOptions = {
      series: [
        {
          name: "NODE MTTR",
          type: "column",
          data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6, 5.1, 6.2, 7.1, 8.2, 5.1]
        },
        {
          name: "FOC MTTR",
          type: "column",
          data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5, 9.2, 10.2, 11.3, 12.5, 8.1]
        },
        {
          name: "NET. AVA",
          type: "line",
          data: [20, 29, 37, 36, 44, 45, 50, 58, 60, 70, 80, 90, 60]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        stacked: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [1, 1, 4]
      },
      title: {
        text: "Jan - Dec 2021",
        align: "left",
        offsetX: 110
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "YTD"]
      },
      yaxis: [
        {
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#008FFB"
          },
          labels: {
            style: {
              // color: "#008FFB"
            }
          },
          title: {
            text: "NODE MTTR",
            style: {
              color: "#008FFB"
            }
          },
          tooltip: {
            enabled: true
          }
        },
        {
          seriesName: "Income",
          opposite: true,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#00E396"
          },
          labels: {
            style: {
              // color: "#00E396"
            }
          },
          title: {
            text: "FOC MTTR",
            style: {
              color: "#00E396"
            }
          }
        },
        {
          seriesName: "Revenue",
          opposite: true,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#FEB019"
          },
          labels: {
            style: {
              // color: "#FEB019"
            }
          },
          title: {
            text: "NET AVA",
            style: {
              color: "#FEB019"
            }
          }
        }
      ],
      tooltip: {
        fixed: {
          enabled: false,
          position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60
        }
      },
      legend: {
        horizontalAlign: "center",
        // offsetX: 40
      }
    };

    // this.loader = false;

    this.authService.me().subscribe(resp=> {
      console.log(resp)
      // if(resp.message!="Authorized"){
      //   this.router.navigate(['login']);
      // }
      
    }, error => {
      alert(error.error.error)
      console.log(error.error.error)
      this.router.navigate(['login']);
    })

  }

 

}
