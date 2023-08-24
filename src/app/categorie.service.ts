import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategorieService {
  private apiUrl = 'http://127.0.0.1:8000/api/categories';

  constructor(private http: HttpClient) {}

  getCategories(page: number): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}?page=${page}`);
  }

  ajouterCategorie(libelle: string): Observable<any> {
    const formData = new FormData();
    formData.append('libeller', libelle);
    return this.http.post(this.apiUrl, formData);
  }

  supprimerCategorie(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }

  modifierCategorie(id: number, categorie: Category): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put(url, categorie);
  }

  searchCategories(searchTerm: string): Observable<Category[]> {
    const url = `${this.apiUrl}/search?q=${searchTerm}`;
    return this.http.get<Category[]>(url);
  }
}
