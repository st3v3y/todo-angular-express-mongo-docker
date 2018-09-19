import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { first } from 'rxjs/operators';
import { AlertService } from '../../services/alert.service';
import { UserLogin } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  email = new FormControl('', [Validators.required]); // ,Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private authService: AuthenticationService,
      private alertService: AlertService) {}

  ngOnInit() {
      // reset login status
      this.authService.logout();

      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  loginClick() {
    this.submitted = true;

    if (!this.email.valid || !this.password.valid ) {
      return false;
    }

    this.loading = true;

    const userLogin: UserLogin = {
      email: this.email.value,
      password: this.password.value
    };

    this.authService.login(userLogin)
      .pipe(first())
      .subscribe(
        () => {
          this.router.navigate([this.returnUrl]);
          this.loading = false;
        },
        error => {
          this.alertService.error(error.message);
          this.loading = false;
          this.password.setValue('');
        });
  }
}
