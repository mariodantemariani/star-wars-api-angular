import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'thousands',
  standalone: true,
})
export class ThousandsPipe implements PipeTransform {
  transform(value: string): string {
    const numberValue = Number(value);
    if (isNaN(numberValue)) {
      return value.toString();
    }

    const numberString = value.toString();

    const parts = numberString.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return parts.join('.');
  }
}
