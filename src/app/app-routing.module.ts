import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeCategorieComponent } from './liste-categorie/liste-categorie.component';
import { ArticleComponent } from './article/article.component';
  
const routes: Routes = [
  { path: '', component: ListeCategorieComponent }, 
  { path: 'article', component: ArticleComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
  
})
export class AppRoutingModule { }
