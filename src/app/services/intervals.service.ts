import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class IntervalsService {

  /*
    Intervals are created based on a monitor ID
    Every interval will trigger a notification via the intervalNotification$ observable
  */

  intervals = <any>{};
  
  intervalNotification = new Subject<string>();
  intervalNotification$ = this.intervalNotification.asObservable();

  constructor(private logger: LoggerService) { }

  createInterval(id:string, refresh_interval:number, restarted?:boolean) {
    
    this.logger.log(`Create interval for ${id}`);

    if (restarted) {
      this.logger.log(`Interval was deleted and created again ${id}`);
    }

    this.intervals[id] = setInterval(() => {
      this.intervalNotification.next(id);
    }, refresh_interval);
  }

  restartInterval(id:string, refresh_interval:number) {
    if (this.intervals[id]) {
      clearInterval(this.intervals[id]);
      delete this.intervals[id];
      this.createInterval(id, refresh_interval, true);
    }
  }

  deleteInterval(id:string) {
    if (this.intervals[id]) {
      clearInterval(this.intervals[id]);
      delete this.intervals[id];
      this.logger.log(`Delete interval ${id}`);
    }
  }

  getIntervalById(id:string) {
    return this.intervals[id];
  }
}
