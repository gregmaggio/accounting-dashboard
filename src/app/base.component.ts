import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    template: ''
})
export class BaseComponent implements OnInit {
    private loading:boolean = false;

    constructor(protected http: HttpClient) {
    }

    ngOnInit(): void {
        
    }
    
    public isLoading():boolean {
        return this.loading;
    }

    public setLoading(newVal:boolean) {
        this.loading = newVal;
        var anchors: HTMLCollectionOf<HTMLAnchorElement> = document.getElementsByTagName("a");
        for (var ii:number = 0; ii < anchors.length; ii++) {
            if (this.loading) {
                anchors.item(ii).style.pointerEvents="none";
                anchors.item(ii).style.cursor="default";
            } else {
                anchors.item(ii).style.pointerEvents="auto";
                anchors.item(ii).style.cursor="pointer";
            }
        }
        var inputs: HTMLCollectionOf<HTMLInputElement> = document.getElementsByTagName("input");
        for (var ii:number = 0; ii < inputs.length; ii++) {
            inputs.item(ii).disabled = this.loading;
        }
        var buttons: HTMLCollectionOf<HTMLButtonElement> = document.getElementsByTagName("button");
        for (var ii:number = 0; ii < buttons.length; ii++) {
            buttons.item(ii).disabled = this.loading;
        }
    }
}