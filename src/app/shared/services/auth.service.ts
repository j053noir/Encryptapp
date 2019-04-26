import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ICurrentSession } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  tokenName = environment.tokenName;

  constructor(private http: HttpClient, private helper: JwtHelperService) {
    this.helper = new JwtHelperService();
  }

  decodeToken() {
    return this.helper.decodeToken(this.getToken());
  }

  getCurrentUser() {
    const currentUser = localStorage.getItem(this.tokenName);
    if (currentUser != null) {
      return JSON.parse(localStorage.getItem(this.tokenName));
    }
    return null;
  }

  getToken() {
    const currentUser: ICurrentSession = this.getCurrentUser();
    if (currentUser && currentUser.access_token) {
      return currentUser.access_token;
    }
    return '';
  }

  setToken(token: any) {
    localStorage.setItem(this.tokenName, JSON.stringify(token));
  }

  private getRefreshToken() {
    const currentUser: ICurrentSession = this.getCurrentUser();
    if (currentUser && currentUser.refresh_token) {
      return currentUser.refresh_token;
    }
    return '';
  }

  getTokenExpirationDate(token: string) {
    return this.helper.getTokenExpirationDate(token);
  }

  hasSessionExpired(token: string) {
    if (token) {
      return this.helper.isTokenExpired(token);
    }
    return true;
  }

  signIn(username: string, password: string) {
    return this.http
      .post(`//${environment.apiUrl}/auth`, { username, password })
      .pipe(
        map((response: ICurrentSession) => {
          if (response && response.access_token) {
            this.setToken(response);
          }
          return response as ICurrentSession;
        })
      );
  }

  signOut() {
    localStorage.removeItem(this.tokenName);
  }

  signUp(
    firstname: string,
    lastname: string,
    username: string,
    password: string
  ) {
    return this.http
      .post(`//${environment.apiUrl}/registro`, {
        username,
        password,
        nombre: firstname,
        apellido: lastname,
      })
      .pipe(map(response => response));
  }

  refreshSession() {
    return this.http
      .post(`//${environment.apiUrl}/auth/refresh`, {
        token: this.getRefreshToken(),
      })
      .pipe(
        map((response: ICurrentSession) => {
          if (response && response.access_token) {
            this.setToken(response);
          }
          return response as ICurrentSession;
        })
      );
  }
}
