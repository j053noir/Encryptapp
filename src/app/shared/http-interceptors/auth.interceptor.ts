import {
  HttpErrorResponse,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse,
  HttpSentEvent,
  HttpUserEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { ICurrentSession } from '../models/auth.model';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<
    | HttpSentEvent
    | HttpHeaderResponse
    | HttpProgressEvent
    | HttpResponse<any>
    | HttpUserEvent<any>
    | any
  > {
    return next
      .handle(
        this.addAuthorizationHeaderToRequest(
          request,
          this.authService.getToken()
        )
      )
      .pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            switch ((err as HttpErrorResponse).status) {
              case 401:
                return this.handle401Error(request, next);
              default:
                return throwError(err);
            }
          } else {
            return throwError(err);
          }
        })
      );
  }

  private addAuthorizationHeaderToRequest(
    request: HttpRequest<any>,
    token: string
  ): HttpRequest<any> {
    if (!this.authService.hasSessionExpired(token)) {
      return request.clone({
        headers: request.headers.append('Authorization', token),
      });
    }
    return request;
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      this.tokenSubject.next(null);

      return this.authService.refreshSession().pipe(
        switchMap((response: ICurrentSession) => {
          if (response) {
            this.tokenSubject.next(response.access_token);
            this.authService.setToken(response);
            return next.handle(
              this.addAuthorizationHeaderToRequest(
                request,
                response.access_token
              )
            );
          }

          return this.authService.signOut() as any;
        }),
        catchError(() => {
          return this.authService.signOut() as any;
        }),
        finalize(() => {
          this.isRefreshingToken = false;
        })
      );
    } else {
      this.isRefreshingToken = false;

      return this.tokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token =>
          next.handle(this.addAuthorizationHeaderToRequest(request, token))
        )
      );
    }
  }
}
