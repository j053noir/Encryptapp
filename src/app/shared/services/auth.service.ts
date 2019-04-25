import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  tokenName = environment.tokenName;

  constructor(private helper: JwtHelperService) {
    this.helper = new JwtHelperService();
  }

  DecodeToken() {
    return this.helper.decodeToken(this.GetToken());
  }

  GetCurrentUser() {
    const currentUser = localStorage.getItem(this.tokenName);
    if (currentUser != null) {
      return JSON.parse(localStorage.getItem(this.tokenName));
    }
    return null;
  }

  GetToken() {
    const currentUser = this.GetCurrentUser();
    if (currentUser && currentUser.access_token) {
      return currentUser.access_token;
    }
    return '';
  }

  GetTokenExpirationDate(token: string) {
    return this.helper.getTokenExpirationDate(token);
  }

  HasSessionExpired(token: string) {
    return this.helper.isTokenExpired(token);
  }
}
