import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ProductPipe',
  pure: true
})
export class ProductPipe implements PipeTransform {

  transform(date: any): any {
    return new Date(date).toLocaleString([], { hour12: true})
  }
}