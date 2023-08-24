import { Component, ViewChild } from '@angular/core';
import { Article } from 'src/app/interfaces/article.interface';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent {
  // ... autres propriétés ...
  articleToUpdate: any; 

  @ViewChild(FormComponent) formComponent!: FormComponent;

  editArticle(article: Article) {
    this.formComponent.articleToUpdate = article;
  }

  // ... autres méthodes ...
}
