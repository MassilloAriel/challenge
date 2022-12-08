# Challenge

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.2.

Run `npm install` to install dependencies
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Credentials

The site has a mock login.
Credentials:
username: admin
password: password

## Notes
The system uses a free plan of the OpenWeather API to get the latest information.
However, there are some limitations to this API.
When searching by city, the zip code is not returned, that is why the table doesn't show it.
When searching by zip code, both city and zip code are added to the table.

While running `ng serve` the console will output some logs. 
This is just for development. The logger service checks if the environment "production" flag is set to false.