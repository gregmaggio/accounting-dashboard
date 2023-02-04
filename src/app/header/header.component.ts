import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    constructor() {

    }

    ngOnInit() {
        var path:string = window.location.pathname;
        if (path.startsWith("/")) {
            path = path.substring(1);
        }
        if (path.length > 0) {
            window.setTimeout(function() {
                var a:HTMLAnchorElement = <HTMLAnchorElement>document.getElementById(path);
                if (a) {
                    a.className += ' active';
                }
            }, 250);
        }
    }
}
