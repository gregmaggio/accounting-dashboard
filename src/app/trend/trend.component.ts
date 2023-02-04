import { formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { DateAdapter } from "@angular/material/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { BaseComponent } from "app/base.component";
import { AccountingService, EventName, Trend } from "app/service/accounting.service";
import { AppDateAdapter } from "app/util/appdateadapter.component";

@Component({
    selector: 'app-trend',
    templateUrl: './trend.component.html',
    styleUrls: ['./trend.component.css'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter }
    ]
})
export class TrendComponent extends BaseComponent {
    title:string = 'NOAA Weather Widget Trend';

    startDate: Date = null;
    endDate: Date = null;
    eventNames:EventName[] = [];
    loadingData:Boolean[] = [];
    data: any[] = [];
    view: any[] = [700, 400];

    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    xAxisLabel = 'Date';
    showYAxisLabel = true;
    yAxisLabel = 'Events';

    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

    // line, area
    autoScale = true;

    constructor(protected override http:HttpClient) {
        super(http);
    }

    override ngOnInit() {
        super.ngOnInit();
        this.startDate = new Date();
        this.endDate = new Date();
        this.startDate.setMonth(this.startDate.getMonth() - 1);
        this.loadMaxDate();
    }

    startDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
        this.startDate = event.value;
        this.loadData();
    }

    endDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
        this.endDate = event.value;
        this.loadData();
    }
    
    loadMaxDate() {
        this.setLoading(true);
        var service = new AccountingService(this.http);        
        service.max().subscribe(
            (data:string) => {
                var matches:RegExpMatchArray = data.match(/(\d+)-(\d+)-(\d+)/);
                if (matches && (matches.length == 4)) {
                    var year:number = parseInt(matches[1], 10);
                    var month:number = parseInt(matches[2], 10); // months are 0-11
                    var day:number = parseInt(matches[3], 10);
                    this.startDate = new Date(year, month - 1, 1);
                    this.endDate = new Date(year, month - 1, day);
                    this.startDate.setMonth(this.startDate.getMonth() - 1);
                }
                var startDate:HTMLInputElement = <HTMLInputElement>document.getElementById('startDate');
                startDate.value = formatDate(this.startDate, 'yyyy-MM-dd', 'en-US');
                var endDate:HTMLInputElement = <HTMLInputElement>document.getElementById('endDate');
                endDate.value = formatDate(this.endDate, 'yyyy-MM-dd', 'en-US');
                this.loadEventNames();
            }
        );
    }

    loadEventNames() {
        this.setLoading(true);
        var service = new AccountingService(this.http);        
        service.eventNames().subscribe(
            (data:EventName[]) => {
                this.eventNames = data;
                this.loadData();
            }
        );
    }

    checkLoadingData() {
        var loading:boolean = false;
        for (var ii:number = 0; ii < this.loadingData.length; ii++) {
            if (this.loadingData[ii]) {
                loading = true;
            }
        }
        this.setLoading(loading);
    }

    loadData() {
        this.setLoading(true);
        var service = new AccountingService(this.http);        
        this.loadingData = [];
        for (var ii:number = 0; ii < this.eventNames.length; ii++) {
            this.loadingData[ii] = true;
        }
        var chartData: any[] = [];
        for (var ii:number = 0; ii < this.eventNames.length; ii++) {            
            service.trend(this.startDate.getFullYear(), this.startDate.getMonth() + 1, this.startDate.getDate(), this.endDate.getFullYear(), this.endDate.getMonth() + 1, this.endDate.getDate(), this.eventNames[ii].eventName, this.eventNames[ii].eventMessage).subscribe(
                (data: Trend) => {
                    var index:number = -1;
                    for (var jj:number = 0; jj < this.eventNames.length; jj++) {
                        if ((this.eventNames[jj].eventName.toLowerCase() == data.eventName.toLowerCase()) &&
                            (this.eventNames[jj].eventMessage.toLowerCase() == data.eventMessage.toLowerCase())) {
                            index = jj;
                            break;
                        }
                    }
                    if (index > -1) {
                        if ((data.series) && (data.series.length > 0)) {
                            var series = {
                                "name": data.eventName + "." + data.eventMessage,
                                "series": []
                            };
                            for (var jj:number = 0; jj < data.series.length; jj++) {
                                var year:string = data.series[jj].year.toString();
                                var month:string = data.series[jj].month.toString();
                                var day:string = data.series[jj].day.toString();
                                series.series[jj] = {
                                    "name" : year + "-" + month + "-" + day,
                                    "value" : data.series[jj].count
                                };
                            }
                            chartData[index] = series;
                        }
                        this.loadingData[index] = false;
                        this.checkLoadingData();
                        if (!this.isLoading()) {
                            var newChartData:any[] = [];
                            for (var jj:number = 0; jj < chartData.length; jj++) {
                                if (chartData[jj]) {
                                    newChartData[newChartData.length] = chartData[jj];
                                }
                            }
                            this.data = newChartData;
                        }
                    }
                }
            );
        }  
    }
}
