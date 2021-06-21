import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'card'
})
export class CardPipe implements PipeTransform {

  transform(value: string): string
  {
    return ( value.length === 0 )? '#### #### #### ####' : value.replace(/\s/g, '').replace(/\D/g, '').replace(/([0-9]{4})/g, '$1 ').trim();
  }

}
