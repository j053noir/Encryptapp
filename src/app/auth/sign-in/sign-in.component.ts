import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
  signInForm: FormGroup;
  submitting = false;
  returnUrl: string;

  signInSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(qParams => {
      this.returnUrl = qParams.returnUrl;
    });
  }

  ngOnInit() {
    this.signInForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnDestroy() {
    if (this.signInSubscription) {
      this.signInSubscription.unsubscribe();
    }
  }

  onSubmit() {
    if (!this.signInForm.valid) {
      return;
    }

    this.submitting = true;
    const { username, password } = this.signInForm.value;

    this.signInSubscription = this.authService
      .signIn(username, password)
      .subscribe(
        data => {
          if (this.returnUrl) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.router.navigate(['/']);
          }
        },
        err => {
          const message = err.message || 'error al autenticar';
          alert(message);
        }
      );
  }
}
