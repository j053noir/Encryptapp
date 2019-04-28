import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { validatePassword } from 'src/app/shared/validators/password.validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, OnDestroy {
  signUpForm: FormGroup;
  submitting = false;

  signUpSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.signUpForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      firstname: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      lastname: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
        validatePassword,
      ]),
    });
  }

  ngOnDestroy() {
    if (this.signUpSubscription) {
      this.signUpSubscription.unsubscribe();
    }
  }

  onSubmit() {
    if (!this.signUpForm.valid) {
      return;
    }

    this.submitting = true;

    const { firstname, lastname, username, password } = this.signUpForm.value;

    this.signUpSubscription = this.authService
      .signUp(firstname, lastname, username, password)
      .subscribe(
        (res: any) => {
          const message = res.message || 'Cuenta creada';
          alert(message);
          this.router.navigate(['/signin']);
        },
        err => {
          console.log(err);
          const message = err.message || 'Error al crear cuenta';
          alert(message);
        }
      );
  }
}
