import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(){}

  async getWeatherInformation(query: string, searchType:string) {
    let url = ''
    let searchTypes = ['zip', 'city'];

    if (searchType && searchTypes.includes(searchType)) {
      url = searchType === 'zip' ? 
            `https://api.openweathermap.org/data/2.5/weather?zip=${query},us&appid=${environment.OPEN_WEATHER_API_KEY}` : 
            `https://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=${environment.OPEN_WEATHER_API_KEY}&units=imperial`;
    
            const req = await fetch(url);
            const res = await req.json();
            return res;
      } else {
        throw new Error(`Invalid search type ${searchType}`);
      }
  }
}