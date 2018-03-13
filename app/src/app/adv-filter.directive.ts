import { Directive, ViewContainerRef, TemplateRef, Input } from '@angular/core';

@Directive({
  selector: 'advfilters',
})
export class AdvFilters {
 
  constructor( private templateRef: TemplateRef<any>,
    public viewContainer: ViewContainerRef) { }

    clearView(){
      this.viewContainer.clear();
    }
     
    
}