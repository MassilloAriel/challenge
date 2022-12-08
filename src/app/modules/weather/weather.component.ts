import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { monitor } from 'src/app/models/monitor';
import { IntervalsService } from 'src/app/services/intervals.service';
import { MonitorService } from 'src/app/services/monitor.service';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit, OnDestroy {

  monitorSub: Subscription = Subscription.EMPTY;
  intervalSub: Subscription = Subscription.EMPTY;
  monitors: monitor[] = [];

  alert: {show:boolean, message: string} = {show:false, message: ''};

  constructor(
    private monitorService: MonitorService, 
    private intervalService: IntervalsService,
    private weatherService: WeatherService
    ) { 
  }

  ngOnInit(): void {
    this.monitorSub = this.monitorService.monitors$.subscribe(data => {
      this.monitors = data;
    });

    this.intervalSub = this.intervalService.intervalNotification$.subscribe(notificationId => {
      if (notificationId) {
        let monitor = this.monitorService.getMonitorById(notificationId);
        if (monitor.length) {
          this.weatherService.getWeatherInformation(monitor[0].city, 'city').then(data => {
            if (data.cod && parseInt(data.cod) >= 400) {
              console.log('Not found');
            } else {
              if (data.name && data.main.temp) {
                this.monitorService.updateMonitorTemp(notificationId, data.main.temp, (done:boolean) => {
                  if (done) {
                    this.monitorService.checkMonitorCriteria(notificationId, (shouldAlert:boolean) => {
                      if (shouldAlert) {
                        
                        Object.assign(this.alert, {
                          show:true, 
                          message: `${monitor[0].city} temp ${monitor[0].alert_criteria === '=' ? 'is ' :  monitor[0].alert_criteria === '>' ? 'is greater than ' : 'is less than'} ${monitor[0].alert_temp} F°`});
                          
                        setTimeout(() => {
                          Object.assign(this.alert, {show:false});
                        }, 5000);

                      } else {
                        if (this.alert.show) this.alert.show = false;
                      }
                    });
                  }
                });
              }
            }
          }).catch(() => console.log('API error while fetching results...'))
        }
      }
    });
  }

  createMonitor(config: monitor) {
    this.monitorService.createMonitor(config);
  }

  updateMonitorConfig(id:string, config: any ) {
    this.monitorService.updateMonitorConfig(id, config);
  }

  ngOnDestroy(): void {
    if (this.monitorSub) this.monitorSub.unsubscribe();
    if (this.intervalSub) this.intervalSub.unsubscribe();
  }
}
