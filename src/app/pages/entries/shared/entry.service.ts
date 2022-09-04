import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError,  map, Observable, throwError } from 'rxjs';
import { Entry } from '../shared/entry.model';


@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = "http://localhost:3000/entries"
  constructor(
    private http: HttpClient,
    
  ) { }

  getAll(): Observable<Entry[]> {
    return this.http.get<Entry>(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataEntries),            
    )
  }

  getById(id:Number):Observable<Entry>{

    const url = `${this.apiPath}/${id}`
    return this.http.get<Entry>(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataEntry)
    )
    
  }
  create(entry: Entry): Observable<Entry>{
    return this.http.post(this.apiPath, entry).pipe(
      catchError(this.handleError),
      map(this.jsonDataEntry)
    )
  }
  update(entry: Entry): Observable<Entry>{
    const url = `${this.apiPath}/${entry.id}`
    return this.http.put(url, entry).pipe(
      catchError(this.handleError),
      map(()=> entry)
    )
  }
  delete(id: Number): Observable<any>{
    const url = `${this.apiPath}/${id}`
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }

  //METHODS PRIVATE

  jsonDataEntries(jsonDataEntries: any[]): Entry[] {
    console.log(Object.assign(new Entry, jsonDataEntries[0]))
    const entries: Entry[] = []
    jsonDataEntries.forEach(item =>{
      const entry = Object.assign(new Entry, item)
      entries.push(item)
    } )
    return entries
  }
  jsonDataEntry(jsonData: any): Entry {
    
    return Object.assign(new Entry, jsonData)
  }

  handleError(error: any): Observable<any>{
    console.log('ERRO NA REQUISIÇÃO => '+ error)
    return throwError(error);
      }
}
