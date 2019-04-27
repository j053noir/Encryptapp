import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private http: HttpClient) {}

  cypher(form: FormData) {
    return this.http
      .post(`//${environment.apiUrl}/cifrado`, form)
      .pipe(map(response => response));
  }

  decypher(form: FormData) {
    return this.http
      .put(`//${environment.apiUrl}/cifrado`, form)
      .pipe(map(response => response));
  }

  sign(form: FormData) {
    return this.http
      .post(`//${environment.apiUrl}/firma/firmar`, form)
      .pipe(map(response => response));
  }

  verify(form: FormData) {
    return this.http
      .put(`//${environment.apiUrl}/firma/validar`, form)
      .pipe(map(response => response));
  }
}
