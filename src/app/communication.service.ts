// article.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Article } from './interfaces/article.interface';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  private updateArticleSubject = new Subject<number>(); // Passer l'ID de l'article
  updateArticle$ = this.updateArticleSubject.asObservable();

  updateArticle(articleId: number) {
    this.updateArticleSubject.next(articleId);
  }
}
