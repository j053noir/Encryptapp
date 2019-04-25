import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  tokenName = 'current_user';

  constructor(private helper: JwtHelperService) {
    this.helper = new JwtHelperService();
  }

  DecodeToken() {
    return this.helper.decodeToken(this.GetToken());
  }

  GetCurrentUser() {
    return JSON.parse(localStorage.getItem(this.tokenName));
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
