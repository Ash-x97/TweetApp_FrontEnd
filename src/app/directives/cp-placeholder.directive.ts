import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appCpPlaceholder]'
})
export class CpPlaceholderDirective {

  constructor(public viewContainerRef:ViewContainerRef) { }

}
