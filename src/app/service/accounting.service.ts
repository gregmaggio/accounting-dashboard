import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventName {
    eventName: string;
    eventMessage: string;
}

export interface Event {
    eventName: string;
    eventMessage: string;
    count: number;
}

export interface Trend {
    eventName: string;
    eventMessage: string;
    series:Series[];
}

export interface Series {
    year: number;
    month: number;
    day: number;
    count: number;
}

export class AccountingService {
    constructor(private http: HttpClient) {

    }

    min(): Observable<string> {
        var uri: string = "https://datamagic.ca/Accounting/api/min";
        return this.http.get<string>(uri);
    }

    max(): Observable<string> {
        var uri: string = "https://datamagic.ca/Accounting/api/max";
        return this.http.get<string>(uri);
    }

    eventNames(): Observable<EventName[]> {
        var uri: string = "https://datamagic.ca/Accounting/api/eventNames";
        return this.http.get<EventName[]>(uri);
    }

    events(startYear:number, startMonth:number, startDay:number, endYear:number, endMonth:number, endDay:number): Observable<Event[]> {
        var uri: string = "https://datamagic.ca/Accounting/api/stats/" + startYear.toString() + "/" + startMonth.toString() + "/" + startDay.toString() + "/" + endYear.toString() + "/" + endMonth.toString() + "/" + endDay.toString();
        return this.http.get<Event[]>(uri);
    }

    trend(startYear:number, startMonth:number, startDay:number, endYear:number, endMonth:number, endDay:number, eventName:string, eventMessage:string): Observable<Trend> {
        var uri: string = "https://datamagic.ca/Accounting/api/trend/" + startYear.toString() + "/" + startMonth.toString() + "/" + startDay.toString() + "/" + endYear.toString() + "/" + endMonth.toString() + "/" + endDay.toString() + "/" + eventName + "/" + eventMessage;
        return this.http.get<Trend>(uri);
    }
}
