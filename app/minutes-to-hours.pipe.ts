import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'minutesToHours', standalone:false })
export class MinutesToHoursPipe implements PipeTransform {
 transform(value: string | number): string {
  const minutes = typeof value === 'string' ? parseInt(value, 10) : value;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

}
