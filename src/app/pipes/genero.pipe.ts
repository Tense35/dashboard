import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'genero'
})
export class GeneroPipe implements PipeTransform 
{

  transform( value: string ): string
  {
    if ( value.toLowerCase() === 'm')
    {
      return 'fa fa-male';
    }
    else if ( value.toLowerCase() === 'f')
    {
      return 'fa fa-female';
    }
    else 
    {
      return 'fa fa-times'
    }
  }

}
