import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  /*
    Simple logger. Logs to the console while environment is not production
  */

  constructor() { 
    
  }

  log(message: string) {
    if (!environment.production) {
      console.log(message);  
    }
  }
}
