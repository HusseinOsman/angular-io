import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Dummy } from './dummy';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class DummiesService {
  dummiesUrl = 'http://localhost:3000/dummies';  // URL to web api
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('DummiesService');
  }

  /** GET dummies from the server */
  getDummies (): Observable<Dummy[]> {
    return this.http.get<Dummy[]>(this.dummiesUrl)
      .pipe(
        catchError(this.handleError('getDummies', []))
      );
  }

  /* GET dummies whose name contains search term */
  searchDummies(term: string): Observable<Dummy[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
     { params: new HttpParams().set('name', term) } : {};

    return this.http.get<Dummy[]>(this.dummiesUrl, options)
      .pipe(
        catchError(this.handleError<Dummy[]>('searchDummies', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new dummy to the database */
  addDummy (dummy: Dummy): Observable<Dummy> {
    return this.http.post<Dummy>(this.dummiesUrl, dummy, httpOptions)
      .pipe(
        catchError(this.handleError('addDummy', dummy))
      );
  }

  /** DELETE: delete the dummy from the server */
  deleteDummy (id: number): Observable<{}> {
    const url = `${this.dummiesUrl}/${id}`; // DELETE api/dummies/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteDummy'))
      );
  }

  /** PUT: update the dummy on the server. Returns the updated dummy upon success. */
  updateDummy (dummy: Dummy): Observable<Dummy> {
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<Dummy>(this.dummiesUrl, dummy, httpOptions)
      .pipe(
        catchError(this.handleError('updateDummy', dummy))
      );
  }
}
