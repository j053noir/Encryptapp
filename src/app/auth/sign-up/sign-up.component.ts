import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { validatePassword } from 'src/app/shared/validators/password.validator';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  submitting = false;

  constructor() {}

  ngOnInit() {
    this.signUpForm = new FormGroup({
      username: new FormControl('', Validators.required),
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, validatePassword]),
    });
  }

  onSubmit() {
    if (!this.signUpForm.valid) {
      return;
    }

    this.submitting = true;

    console.log(this.signUpForm.value);
  }
}
