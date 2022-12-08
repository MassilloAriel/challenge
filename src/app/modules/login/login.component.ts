import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) { }

  form = this.fb.group({
    username: this.fb.control('', Validators.required),
    password: this.fb.control('', Validators.required)
  });

  submitted: boolean = false;
  doShake: boolean = false;
  fadeout: boolean = false;
  fadein: boolean = true;

  ngOnInit(): void {
  }
  
  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      let login = this.auth.login(this.form.value);
      
      if (login.error) {
        alert('Invalid creds');
      } else {
        this.fadeout = true;
        localStorage.setItem('sid', login.token);

        this.router.navigate(['/', 'weather']);
      }
    } else {
      this.doShake = true;
      setTimeout(() => {
        this.doShake = false;
      }, 500)
    }
  }
}
