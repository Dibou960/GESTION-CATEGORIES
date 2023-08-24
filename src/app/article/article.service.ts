import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Article, PaginatedResponse } from '../interfaces/article.interface';
import { Observable } from 'rxjs';
import { Fournisseur } from '../interfaces/fournisseur.interface';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private apiUrl = 'http://127.0.0.1:8000/api/articles';
  private apiUrlFournisseurs = 'http://127.0.0.1:8000/api/fournisseur';
  private apiUrlAllLibellers = 'http://127.0.0.1:8000/api/all-libellers';

  constructor(private http: HttpClient) {}

  
  getArticles(page: number): Observable<PaginatedResponse> {
    return this.http.get<PaginatedResponse>(`${this.apiUrl}?page=${page}`);
  }

  storeArticle(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  getAllLibellers(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrlAllLibellers);
  }

  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateArticle(updatedArticle: Article): Observable<Article> {
    const url = `${this.apiUrl}/${updatedArticle.id}`;
    return this.http.put<Article>(url, updatedArticle);
  }
  

  searchFournisseur(term: string): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(`${this.apiUrlFournisseurs}/search?q=${term}`);
  }

  
  
}
