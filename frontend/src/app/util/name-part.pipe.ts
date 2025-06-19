import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'name',
    standalone: false
})
export class NamePartPipe implements PipeTransform {

  transform(mailAdress: string, args?: any): any {
    let parts = mailAdress.split("@");
    return parts[0] ? parts[0] : mailAdress;
  }

}
