import { Injectable } from '@angular/core';
import {catchError, map, Observable, of, tap} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as responseData from '../assets/files/demo_response.json';

@Injectable({
    providedIn: 'root'
})
export class AnswerService {

    constructor(
        private http: HttpClient,
    ) { }

    /**
     * Gets a list of incident areas
     * @returns
     */
    public getAnswer(question: any): Observable<any> {
        return of(responseData)
            .pipe(
                catchError(error => {
                    return [];
                })
            );
    }

}