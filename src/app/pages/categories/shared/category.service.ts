import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError,  map, Observable, throwError } from 'rxjs';
import { Category } from '../shared/category.model';



@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiPath: string = "http://localhost:3000/categories"
  constructor(
    private http: HttpClient,


  ) { }

  getAll(): Observable<Category[]> {
    return this.http.get<Category>(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataCategories),
    )
  }

  getById(id:Number):Observable<Category>{

    const url = `${this.apiPath}/${id}`

    return this.http.get<Category>(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataCategory)
    )

  }
  create(category: Category): Observable<Category>{
    return this.http.post(this.apiPath, category).pipe(
      catchError(this.handleError),
      map(this.jsonDataCategory)
    )
  }
  update(category: Category): Observable<Category>{
    const url = `${this.apiPath}/${category.id}`
    return this.http.put(url, category).pipe(
      catchError(this.handleError),
      map(()=> category)
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

  jsonDataCategories(jsonDataCategories: any[]): Category[] {
    const categories: Category[] = []
    jsonDataCategories.forEach(item => categories.push(item as Category))
    return categories
  }
  jsonDataCategory(jsonData: any): Category {

    return jsonData as Category
  }

  handleError(error: any): Observable<any>{
    console.log('ERRO NA REQUISIÇÃO => '+ error)
    return throwError(error);

  }




}
