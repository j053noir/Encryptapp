import { saveAs } from 'file-saver';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UtilsService } from 'src/app/shared/services/utils.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss'],
})
export class SignComponent implements OnInit, OnDestroy {
  signatureForm: FormGroup;

  submitting = false;

  fileName = 'Cargar archivo...';
  formSign: FormData;

  signSubscription: Subscription;

  constructor(private utilsService: UtilsService) {}

  ngOnInit() {
    this.signatureForm = new FormGroup({
      file: new FormControl(null, Validators.required),
    });
    this.formSign = new FormData();
  }

  ngOnDestroy() {
    if (this.signSubscription) {
      this.signSubscription.unsubscribe();
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.formSign.append('archivo', file, file.name);
      this.fileName = file.name;
    } else {
      this.fileName = 'Cargar archivo...';
    }
  }

  onSubmit() {
    if (!this.signatureForm.valid) {
      return;
    }

    console.log(this.signatureForm.value);
    console.log(this.formSign);

    this.submitting = true;

    this.signSubscription = this.utilsService.sign(this.formSign).subscribe(
      (res: any) => {
        const blob = new Blob([res.data], {
          type: 'text/plain;charset=utf-8',
        });
        saveAs(blob, 'firma.txt');
        this.submitting = false;
      },
      err => {
        const message = err.message || 'Error al cargar el archivo';
        alert(message);
        this.submitting = false;
      }
    );

    this.formSign = new FormData();
    this.fileName = 'Cargar archivo...';
    this.signatureForm.reset();
  }
}
