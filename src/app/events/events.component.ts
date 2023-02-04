import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountingService, Event } from '../service/accounting.service';
import { formatDate } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BaseComponent } from '../base.component';
import { DateAdapter } from '@angular/material/core';
import { AppDateAdapter } from '../util/appdateadapter.component';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html',
    styleUrls: ['./events.component.css'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter }
    ]
})
export class EventsComponent extends BaseComponent {
    title:string = 'NOAA Weather Widget Events';
    startDate: Date = null;
    endDate: Date = null;
    data: any[];
    view: any[] = [700, 400];

    // options
    showXAxis = true;
    showYAxis = true;
    gradient = true;
    showLegend = true;
    showXAxisLabel = true;
    xAxisLabel = 'Event';
    showYAxisLabel = true;
    yAxisLabel = 'Hits';
    colorScheme = {
        domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    };

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
                this.loadData();
            }
        );
    }

    loadData() {
        this.setLoading(true);
        var service = new AccountingService(this.http);
        service.events(this.startDate.getFullYear(), this.startDate.getMonth() + 1, this.startDate.getDate(), this.endDate.getFullYear(), this.endDate.getMonth() + 1, this.endDate.getDate()).subscribe(
            (data: Event[]) => {
                if (data && (data.length > 0)) {
                    this.data = [data.length];
                    for (var ii = 0; ii < data.length; ii++) {
                        this.data[ii] = {
                            "name" : data[ii].eventName + "." + data[ii].eventMessage,
                            "value" : data[ii].count
                        };
                    }
                } else {
                    this.data = [];
                }
                this.setLoading(false);
            }
        );
    }
}
