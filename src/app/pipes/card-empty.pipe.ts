import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardEmpty'
})
export class CardEmptyPipe implements PipeTransform 
{

  transform(value: string, def: string = " "): string 
  {
    return ( value.length === 0 )? def : value;
  }

}
