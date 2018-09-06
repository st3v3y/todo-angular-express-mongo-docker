import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { first } from 'rxjs/operators';
import { AlertService } from '../../services/alert.service';
import { UserRegister } from '../../models/user';
import { PasswordValidator } from '../../helpers/password.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  registerForm = this.formBuilder.group({
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      updateOn: 'blur'
    }),
    username: new FormControl('', {
      validators: [Validators.required],
      updateOn: 'blur'
    }),
    matching_passwords: new FormGroup({
      password: new FormControl('', {
        validators:  Validators.compose([
          Validators.minLength(5),
          Validators.required,
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
          ]),
        updateOn: 'blur'
      }),
      confirm_password: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'blur'
      })
    }, (formGroup: FormGroup) => {
      return PasswordValidator.areEqual(formGroup);
    })
  });

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private formBuilder: FormBuilder,
      private userService: UserService,
      private alertService: AlertService) {}

  ngOnInit() {
      // reset login status
      this.userService.logout();

      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  registerClick() {
    this.submitted = true;

    const emailField = this.registerForm.get('email');
    const usernameField = this.registerForm.get('username');
    const passwordField = this.registerForm.get('matching_passwords').get('password');
    const passwordConfField = this.registerForm.get('matching_passwords').get('confirm_password');

    if (!emailField.valid || !usernameField.valid || !passwordField.valid || !passwordConfField.valid) {
      return false;
    }

    this.loading = true;

    const userRegister: UserRegister = {
      email: emailField.value,
      username: usernameField.value,
      password: passwordField.value,
      passwordConf: passwordConfField.value
    };

    this.userService.register(userRegister)
      .pipe(first())
      .subscribe(
          () => {
              this.router.navigate(['/login', { returnUrl: this.returnUrl }] );
          },
          error => {
              this.alertService.error(error.error);
              this.loading = false;
              passwordField.setValue('');
              passwordConfField.setValue('');
          });
  }
}
