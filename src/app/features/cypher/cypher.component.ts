import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../shared/services/utils.service';

@Component({
  selector: 'app-cypher',
  templateUrl: './cypher.component.html',
  styleUrls: ['./cypher.component.scss'],
})
export class CypherComponent implements OnInit {
  cypherForm: FormGroup;
  submitting = false;

  form: FormData;

  cypherUpSubscription: Subscription;

  fileName = 'Cargar archivo...';

  constructor(private utilsService: UtilsService) {}

  ngOnInit() {
    this.cypherForm = new FormGroup({
      password: new FormControl('', Validators.required),
      file: new FormControl(null, Validators.required)
    });

    this.form = new FormData();
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.form.append('archivo', file, file.name);
      this.fileName = file.name;
    } else {
      this.fileName = 'Cargar archivo...';
    }
  }

  onCypher() {
    if (!this.cypherForm.valid) {
      return;
    }

    this.submitting = true;

    this.form.append('password', this.cypherForm.value.password);

    this.cypherUpSubscription = this.utilsService.cypher(this.form).subscribe(
      (res: any) => {
        const blob = new Blob([res.data], {
          type: 'text/plain;charset=utf-8',
        });
        saveAs(blob);
        this.submitting = false;
      },
      err => {
        const message = err.message || 'Error al cargar el archivo';
        alert(message);
        this.submitting = false;
      }
    );

    this.form = new FormData();
  }

  onDecypher() {
    if (!this.cypherForm.valid) {
      return;
    }

    this.submitting = true;

    this.form.append('password', this.cypherForm.value.password);

    this.cypherUpSubscription = this.utilsService.decypher(this.form).subscribe(
      (res: any) => {
        this.submitting = false;
        const blob = new Blob([res.data], {
          type: 'text/plain;charset=utf-8',
        });
        saveAs(blob);
      },
      err => {
        const message = err.message || 'Error al cargar el archivo';
        alert(message);
        this.submitting = false;
      }
    );

    this.form = new FormData();
    this.fileName = 'Cargar archivo...';
    this.cypherForm.reset();
  }
}
