import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArticleService } from '../article.service';
import { Article } from 'src/app/interfaces/article.interface';
import { Fournisseur } from 'src/app/interfaces/fournisseur.interface';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
// import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})

export class FormComponent implements OnInit,OnDestroy {
  @Input() articleToUpdate: Article | null = null;

  articleForm!: FormGroup;
  showAlert: boolean = false;
  alertType: string = 'success';
  alertMessage: string = '';
  libellers: string[] = [];
  selectedFile: File | undefined;
  subscription: any;
  

  constructor(
    private formBuilder: FormBuilder,
    private articleService: ArticleService
  ) {
    this.articleForm = this.formBuilder.group({
      libeller: ['', Validators.required],
      prix: ['', Validators.required],
      categorie: ['', Validators.required],
      stock: ['', Validators.required],
      fournisseur: ['', Validators.required],
      photo: [''], // Add the photo form control
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  ngOnInit() {
    this.loadAllLibellers();
  }

  loadAllLibellers() {
    this.articleService.getAllLibellers().subscribe((data) => {
      this.libellers = data;
    });
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }

  onSubmit() {
    if (this.articleForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('libeller', this.articleForm.get('libeller')?.value);
      formData.append('prix', this.articleForm.get('prix')?.value);
      formData.append('categorie', this.articleForm.get('categorie')?.value);
      formData.append('stock', this.articleForm.get('stock')?.value);
      formData.append(
        'fournisseur',
        this.articleForm.get('fournisseur')?.value
      );
      formData.append('photo', this.selectedFile);

      this.articleService.storeArticle(formData).subscribe(
        () => {
          this.alertType = 'success';
          this.alertMessage = 'Article ajouté avec succès.';
          this.showAlert = true;
          this.articleForm.reset();
        },
        (error) => {
          this.alertType = 'danger';
          this.alertMessage = error.error.message || 'Une erreur est survenue.';
          this.showAlert = true;
        }
      );

      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
    }
  }
  suggestions: string[] = [];

  onFournisseurInput() {
    const fournisseur = this.articleForm.get('fournisseur')?.value;

    if (fournisseur) {
      this.articleService.searchFournisseur(fournisseur).subscribe(
        (fournisseurs: Fournisseur[]) => {
          if (fournisseurs && fournisseurs.length > 0) {
            this.suggestions = fournisseurs.map(
              (fournisseur) => fournisseur.nom
            );
          } else {
            if (!this.suggestions.includes(fournisseur)) {
              this.suggestions.push(fournisseur);
            }
          }
        },
        (error: any) => {
          console.error('Erreur lors de la recherche de fournisseurs :', error);
        }
      );
    } else {
      this.suggestions = [];
    }
  }
  selectSuggestion(suggestion: string) {
    this.articleForm.get('fournisseur')?.setValue(suggestion);
    this.suggestions = []; // Réinitialiser les suggestions après la sélection
  }

  chargerRef() {
    const libeller = this.articleForm.get('libeller')?.value;
    const categorie = this.articleForm.get('categorie')?.value;
  
    console.log('Libellé:', libeller);
    console.log('Catégorie:', categorie);
  
    if (libeller && categorie) {
      const reference = `REF-${libeller.substring(0, 3).toUpperCase()}-${categorie.substring(0, 3).toUpperCase()}`;
      console.log('Référence:', reference);
  
      // Mettre à jour le champ de référence avec la valeur générée
      this.articleForm.get('Reference')?.setValue(reference);
    } else {
      console.log('Aucun libellé ou catégorie, la référence est effacée.');
      this.articleForm.get('Reference')?.setValue('');
    }
  }  
  updateArticle() {
    if (this.articleToUpdate) {
      this.articleService.updateArticle(this.articleToUpdate).subscribe(
        (updatedArticle: Article) => {
          console.log('Article mis à jour avec succès :', updatedArticle);
          // Autres actions après la mise à jour réussie
        },
        (error) => {
          console.error('Erreur lors de la mise à jour de l\'article :', error);
          // Traitez l'erreur ici
        }
      );
    }
  }
  
}


// onSubmit() {
//   if (this.articleForm.valid && this.selectedFile) {
//     const formData = this.articleForm.value;
//     formData.photo = this.selectedFile;

//     const formDataArray = Object.entries(formData);
//     console.log('Form Data:', formDataArray);

//     this.articleService.storeArticle(formData).subscribe(
//       () => {
//         this.alertType = 'success';
//         this.alertMessage = 'Article ajouté avec succès.';
//         this.showAlert = true;
//         this.articleForm.reset();
//       },
//       (error) => {
//         this.alertType = 'danger';
//         this.alertMessage = error.error.message || 'Une erreur est survenue.';
//         this.showAlert = true;
//       }
//     );

//     setTimeout(() => {
//       this.showAlert = false;
//     }, 3000);
//   }
// }
