import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { monitor } from '../models/monitor';
import * as uuid from 'uuid';
import { IntervalsService } from './intervals.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class MonitorService {

  monitors$ = new BehaviorSubject<monitor[]>([]);

  constructor(private intervalService: IntervalsService, private logger: LoggerService) { }

  createMonitor(config:any) {
    let cp = this.monitors$.value;
    Object.assign(config, { 
      id: uuid.v4(), 
      city: config.city, 
      last_temp_registered: config.temp, 
      refresh_interval: 5,
      refresh_interval_milliseconds: 5 * 60000,
      alert_temp: config.temp,
      alert_criteria: '>',
      notify: false,
      favorite: false
    })
    
    cp.push(config);
    this.monitors$.next(cp);
    this.logger.log(`Added new monitor ${this.monitors$.value}`);
  }

  getMonitorById(id:string) {
    return this.monitors$.value.filter(m => m.id === id);
  }

  updateMonitorConfig(id:string, config: any) {
    let cp = this.monitors$.value;
    let monitor = cp.filter(i => i.id === id);

    if (monitor.length) {
      //toggle notifications
      if (Object.keys(config).includes('notify')) {
        monitor[0].notify = config.notify;
        this.monitors$.next(cp);
        this.logger.log(`Notifications ${id} ${this.monitors$.value}`)
      }

      //update refresh interval
      if (Object.keys(config).includes('refresh_interval')) {
        if (config.refresh_interval >= 1) {
          monitor[0].refresh_interval = config.refresh_interval;
          monitor[0].refresh_interval_milliseconds = config.refresh_interval * 60000;
          this.monitors$.next(cp);
        } else {
          throw new Error ('Refresh interval invalid');
        }
      }

      if (Object.keys(config).includes('alert_temp')) {
        monitor[0].alert_temp = parseFloat(config.alert_temp);
        this.logger.log(`Alert temp ${this.monitors$.value}`);
        return;
      }

      if (Object.keys(config).includes('alert_criteria')) {
        monitor[0].alert_criteria = config.alert_criteria;
        this.logger.log(`Alert criteria ${id} ${config.alert_criteria}`);
        return;
      }

      if (Object.keys(config).includes('favorite')) {
        monitor[0].favorite = config.favorite;
        this.logger.log(`Favorite ${id} ${config.favorite}`);
        return;
      }


      //If it has notifications on
      if (monitor[0].notify) {
        //does it have an interval?
        if (typeof this.intervalService.getIntervalById(id) === 'undefined') {
          this.intervalService.createInterval(id, monitor[0].refresh_interval_milliseconds);
        } else {
          this.intervalService.restartInterval(id, monitor[0].refresh_interval_milliseconds);
        }
      } else {
        this.intervalService.deleteInterval(id);
      }
    }
  }

  updateMonitorTemp(id:string, temp:number, callback:Function) {
    let cp = this.monitors$.value;
    let monitor = cp.filter(i => i.id === id);
    
    if (monitor.length) {
      this.logger.log(`Update monitor temperature: ${id} \nFrom ${monitor[0].last_temp_registered} to ${temp}`);
      monitor[0].last_temp_registered = temp;
      this.monitors$.next(cp);
      //if the temperature changed
      callback(true);
    }
  }

  //Uses the criteria to callback and show a notification
  checkMonitorCriteria(id:string, callback:Function) {
    let monitor = this.monitors$.value.filter(i => i.id === id);
    
    this.logger.log(`Alert criteria ${monitor[0].last_temp_registered} ${monitor[0].alert_criteria} ${monitor[0].alert_temp}`);
    
    if (monitor.length) {
      switch(monitor[0].alert_criteria) {
        case '>': monitor[0].last_temp_registered > monitor[0].alert_temp ? callback(true) : callback(false);
        break;
        case '<': monitor[0].last_temp_registered < monitor[0].alert_temp ? callback(true) : callback(false);
        break;
        case '=': monitor[0].last_temp_registered == monitor[0].alert_temp ? callback(true) : callback(false);
        break;
        default: callback(false);
      }
    }
  }
}