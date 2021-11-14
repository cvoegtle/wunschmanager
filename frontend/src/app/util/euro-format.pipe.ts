import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'euro'
})
export class EuroFormatPipe implements PipeTransform {

  transform(value: number, ...args: number[]): string {
    let digits: number = args != undefined ? args[0]  : 2;
    let formatted = "";
    if (Number.isInteger(value)) {
      formatted = value + "€";
    } else if (value != null) {
      formatted = value.toFixed(digits) + "€";
    }
    return formatted.replace("\.", ",");
  }

}
