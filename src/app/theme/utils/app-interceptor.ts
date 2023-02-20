import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
    constructor() {}
   /*   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      const token=localStorage.getItem('access_token')
      request = request.clone({
        withCredentials:true
      })
        request = request.clone({
          headers: request.headers.set('Content-Type', 'application/json')
        });
        request = request.clone({
          headers: request.headers.set('accept', 'application/json')
        });
       
      if (token) {
        request = request.clone({
          headers: request.headers.set('Authorization', 'Bearer ' + token)
        });
        return next.handle(request).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error && error.status === 401) {
              console.log("error unauthorized");
            }
            const err = error.error.message || error.statusText;
            return throwError(error)
          })
        )
      }
      else{
        return next.handle(request)
       }
    }} 
   */
 
 
    intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // console.log(`Request for ${req.urlWithParams} started...`);
        const token=localStorage.getItem('access_token')

        if (token) {
          req = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + token)
          });}
        return next.handle(req).pipe(map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              // console.log(`Request for ${req.urlWithParams} completed...`);
            }
            return event;
          }),
          
          catchError((error: HttpErrorResponse) => {
            const started = Date.now();            
            const elapsed = Date.now() - started;
          //  console.log(`Request for ${req.urlWithParams} failed after ${elapsed} ms.`);
           // debugger;
            return throwError(error);
          })
        );
      }  }
     
