import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { BehaviorSubject } from 'rxjs';
// import { Subject } from 'rxjs';
// import { ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private baseUrl = 'http://localhost:3000/users';
  addType: string = !localStorage.getItem("userId")? 'app': 'childs';
  
  private handleError(error: any) {
    return throwError(() => new Error(error.message || 'Server error'));
  }

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}?email=${email}`);
  }

  onCreateUser(obj: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, obj).pipe(catchError(this.handleError));
  }

  onGetUsers(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/users').pipe(catchError(this.handleError));
  }

  saveUpdatedChild(obj: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${obj.id}`, obj).pipe(catchError(this.handleError));
  }

  onDeleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:3000/users/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getUserById(userId: any): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/users/${userId}`).pipe(catchError(this.handleError))
  }

  loggin() {
    console.log("service")
    return JSON.parse(localStorage.getItem('authToken'))
  }
}
