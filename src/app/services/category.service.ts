import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/api/categorias'; // Cambia esto por la URL de tu API
  

  constructor(private http: HttpClient) { }

  // Método para obtener todas las categorías
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl)
      .pipe(
        tap(_ => console.log('Categorías obtenidas!')),
        catchError(this.handleError<string[]>('getCategories', []))
      );
  }

  // Manejo de errores
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      console.log(`${operation} falló: ${error.message}`);
      return of(result as T);
    };
  }
}
