import { Directive, ViewContainerRef, TemplateRef, Input } from '@angular/core';

@Directive({
  selector: '[serv-detail]',
})
export class ServDetail {
  constructor(public viewContainerRef: ViewContainerRef) { }  
}