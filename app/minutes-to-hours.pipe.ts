import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'minutesToHours', standalone: false })
export class MinutesToHoursPipe implements PipeTransform {
  transform(value: string | number): string {
    const totalSeconds = typeof value === 'string' ? parseInt(value, 10) : value;
    const hours = Math.floor(totalSeconds / 3600); 
    const remainingSecondsAfterHours = totalSeconds % 3600;
    const minutes = Math.floor(remainingSecondsAfterHours / 60);
    const seconds = remainingSecondsAfterHours % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  }
}
