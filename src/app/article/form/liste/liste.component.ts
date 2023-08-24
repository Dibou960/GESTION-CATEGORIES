import { Component, Input, OnInit } from '@angular/core';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Article } from 'src/app/interfaces/article.interface';
import { ArticleService } from '../../article.service';
// import { FormComponent } from '../form.component';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css'],
})
export class ListeComponent implements OnInit {
  
  articles: Article[] = [];
  @Input() currentPage: number = 1;
  totalPages: number = 1;
  editingArticle: Article | null = null;
  editMode: boolean = false;
  articleId: number | null = null;
updatedArticle: Article | null = null;

 articleToUpdate: Article | null = null;

  constructor(
    private articleService: ArticleService,
    // private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles() {
    console.log("Chargement des articles...");
    this.articleService.getArticles(this.currentPage).subscribe(
      (data: any) => {
        console.log("Données des articles reçues :", data);
        this.articles = data.data;
        this.currentPage = data.current_page;
        this.totalPages = data.last_page;
      },
      (error) => {
        console.error("Erreur lors du chargement des articles :", error);
      }
    );
  }
  loadArticleToUpdate(article: Article) {
    this.articleToUpdate = { ...article };
  }

  

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadArticles();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadArticles();
    }
  }

  deleteArticle(article: Article) {
    if (
      confirm(
        `Voulez-vous vraiment supprimer l'article "${article.libeller}" ?`
      )
    ) {
      this.articleService.deleteArticle(article.id).subscribe(
        () => {
          console.log(`Article "${article.libeller}" supprimé avec succès.`);
          this.loadArticles();
        },
        (error) => {
          console.error(
            `Une erreur s'est produite lors de la suppression de l'article :`,
            error
          );
        }
      );
    }
  }
  editArticle(article: Article) {
    this.editingArticle = article;
  }
  
  updateArticle(article: Article): void {
    this.articleService.updateArticle(article).subscribe(
      (updatedArticle: Article) => {
        console.log('Article mis à jour avec succès :', updatedArticle);
        // Mettez à jour la liste des articles ou effectuez d'autres actions nécessaires
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de l\'article :', error);
        // Traitez l'erreur ici
      }
    );
  }
  
  
  
  


 

}