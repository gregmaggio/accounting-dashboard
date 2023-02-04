import { NativeDateAdapter } from '@angular/material/core';

export class AppDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    var day:string = date.getDate().toString();
    day = (day.length < 2) ? '0' + day : day;
    var month:string = (date.getMonth() + 1).toString();
    month = (month.length < 2) ? '0' + month : month;
    var year:string = date.getFullYear().toString();
    return year + '-' + month + '-' + day;
  }
}
