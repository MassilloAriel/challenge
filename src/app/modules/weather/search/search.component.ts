import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { searchResult } from 'src/app/models/monitor';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class FormComponent implements OnInit {

  searchForm = this.fb.group({
    search: this.fb.control('', Validators.required)
  })

  message:string = '';
  @Output('save') save = new EventEmitter();
  match: searchResult = {city: '', temp: '', zip: null};

  constructor(private fb: FormBuilder, private weatherService: WeatherService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.searchForm.valid) {
      const query = this.searchForm.controls.search.value || '';
      this.message = 'Loading...';
      
      let searchType = parseInt(query) ? 'zip' : 'city';
        
      this.weatherService.getWeatherInformation(query,searchType).then(data => {
        //API 4xx error
        if (data.cod && parseInt(data.cod) >= 400) {
          this.message = `${query} was not found`;
          this.match = {city: '', temp: '', zip: 0};
        } else {
          this.message = `${data.name} was found.`;
          this.searchForm.patchValue({search: ''});
          this.match = {city: data.name, temp: data.main.temp, zip: searchType === 'zip' ? parseInt(query) : null};
        }
      })
      .catch(() => this.message = 'API error while fetching results...')
    } else {
      this.message = 'Please provide a valid search';
    }
  }

  onMonitorAdd() {
    this.save.emit(this.match);
    this.message = '';
    this.match = {city: '', temp: '', zip: null};
  }

}
