import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit, OnDestroy {
  verifyForm: FormGroup;

  submitting = false;

  formVerify: FormData;

  verifySubscription: Subscription;

  fileName = 'Cargar archivo...';

  constructor(private utilsService: UtilsService) {}

  ngOnInit() {
    this.verifyForm = new FormGroup({
      signature: new FormControl(null, Validators.required),
      file: new FormControl(null, Validators.required),
    });
    this.formVerify = new FormData();
  }

  ngOnDestroy() {
    if (this.verifySubscription) {
      this.verifySubscription.unsubscribe();
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.formVerify.append('archivo', file, file.name);
      this.fileName = file.name;
    } else {
      this.fileName = 'Cargar archivo...';
    }
  }

  onSubmit() {
    if (!this.verifyForm.valid) {
      return;
    }

    this.submitting = true;

    this.formVerify.append('signature', this.verifyForm.value.signature);

    this.verifySubscription = this.utilsService
      .verify(this.formVerify)
      .subscribe(
        (res: any) => {
          if (res.data) {
            alert('Exito, la firma es valida.');
          } else {
            alert('Fallo, El archivo y la firma no concuerdan.');
          }
          this.submitting = false;
        },
        err => {
          const message = err.message || 'Error al cargar el archivo';
          alert(message);
          this.submitting = false;
        }
      );

    this.verifyForm.reset();
    this.formVerify = new FormData();
    this.fileName = 'Cargar archivo...';
  }
}
