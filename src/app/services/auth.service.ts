import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  /*
    Mock login service
      username: admin
      password: password
  */

  login(credentials:any):{error:boolean, token: string} {

    if (credentials.username === 'admin' && credentials.password === 'password') {
      return {error: false, token: 'sid12345'}
    }
    return {error:true, token: ''};
  }

  checkLoginStatus() {
    if (localStorage.getItem('sid')) {
      return true;
    }
    return false;
  }
}
