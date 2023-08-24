import { Component, OnInit } from '@angular/core';
import { CategorieService } from '../categorie.service';
import { Category } from '../interfaces/category.interface';

@Component({
  selector: 'app-liste-categorie',
  templateUrl: './liste-categorie.component.html',
  styleUrls: ['./liste-categorie.component.css'],
})
export class ListeCategorieComponent implements OnInit {
  // Déclarations de variables utilisées dans le composant
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  pageNumbers: number[] = [];
  newCategoryLibelle: string = '';
  currentPage = 1;
  itemsPerPage = 5;
  error: string = '';
  successMessage: string = '';
  selectedCategories: Category[] = [];
  pageNotFoundError = false;
  searchTerm: string = '';
  searchResultsFound: boolean = true;
  editingMode = false;
  selectAllCategories: boolean = false;
  selectAllCategoriesInEditMode = false;
  isLibelleExisting: boolean = false;

  // Constructeur, injecte le service CategorieService
  constructor(private categorieService: CategorieService) {}

  // Méthode exécutée lors de l'initialisation du composant
  ngOnInit(): void {
    this.loadCategories();
  }

  // Charge les catégories depuis le service CategorieService
  loadCategories(): void {
    // Appel à la méthode getCategories du service
    this.categorieService.getCategories(this.currentPage).subscribe(
      (data: Category[]) => {
        this.categories = data;
        this.pageNotFoundError = false;
      },
      (error) => {
        if (error.status === 404) {
          this.pageNotFoundError = true;
          alert("La page demandée n'existe pas.");
        } else {
          this.error = "Une erreur s'est produite : " + error.message;
        }
        console.error("Une erreur s'est produite :", error);
      }
    );
  }

  // Méthode pour naviguer vers une page spécifique de catégories
  goToPage(page: number): void {
    if (page >= 1) {
      this.currentPage = page;
      this.loadCategories();
    } else {
      alert("La page demandée n'existe pas.");
    }
  }

  ajouterCategorie(): void {
    // Appel à la méthode ajouterCategorie du service
    this.categorieService
      .ajouterCategorie(this.newCategoryLibelle)
      .subscribe((response: Category) => {
        this.newCategoryLibelle = '';
        this.successMessage = 'La catégorie a été ajoutée avec succès.';
        this.loadCategories();
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      });
      
  }

  supprimerCategorie(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      // Appel à la méthode supprimerCategorie du service
      this.categorieService.supprimerCategorie(id).subscribe(
        (response: Category) => {
          this.loadCategories();
        },
        (error) => {
          console.error(
            'Erreur lors de la suppression de la catégorie :',
            error
          );
        }
      );
    }
  }

  // Méthode pour supprimer les catégories sélectionnées en lot
  supprimerCategoriesSelectionnees(): void {
    // Vérification s'il y a des catégories sélectionnées
    if (this.selectedCategories.length === 0) {
      return;
    }

    const confirmation = confirm(
      'Êtes-vous sûr de vouloir supprimer les catégories sélectionnées ?'
    );
    if (!confirmation) {
      return;
    }

    // Création d'un tableau de promesses pour la suppression en lot
    const deletionPromises = this.selectedCategories.map((cat) => {
      return this.categorieService.supprimerCategorie(cat.id).toPromise();
    });

    // Exécution des promesses simultanément
    Promise.all(deletionPromises)
      .then(() => {
        // Toutes les promesses ont été résolues avec succès
        this.selectedCategories = [];
        this.successMessage = 'Catégories supprimées avec succès.';
        this.reloadPage();
      })
      .catch((error) => {
        this.error =
          "Une erreur s'est produite lors de la suppression des catégories.";
        console.error('Erreur lors de la suppression des catégories :', error);
      });
  }

  // Recharge la page actuelle
  reloadPage(): void {
    window.location.reload();
  }

  // Active le mode d'édition pour une catégorie
  editCategory(categorie: Category) {
    if (this.editingMode) {
      this.selectedCategory = categorie;
      this.newCategoryLibelle = categorie.libeller;
    }
  }

  // Méthode pour vérifier si le libellé en édition est le même que l'ancien libellé
  isNewCategoryLibelleSame(): boolean {
    if (this.editingMode && this.selectedCategory) {
      return this.newCategoryLibelle === this.selectedCategory.libeller;
    }
    return false;
  }

  modifierCategorie() {
    if (
      this.selectedCategory &&
      this.newCategoryLibelle !== this.selectedCategory.libeller
    ) {
      this.selectedCategory.libeller = this.newCategoryLibelle;

      this.categorieService
        .modifierCategorie(this.selectedCategory.id, this.selectedCategory)
        .subscribe(
          (response) => {
            this.successMessage = 'Catégorie mise à jour avec succès.';
            this.loadCategories();

            this.newCategoryLibelle = '';
            this.selectedCategory = null;
          },
          (error) => {
            this.error =
              "Une erreur s'est produite lors de la mise à jour de la catégorie.";
          }
        );
    }
  }

  isSelected(categorie: Category): boolean {
    return this.selectedCategories.includes(categorie);
  }
  // Ajoute ou modifie une catégorie en fonction du mode d'édition
  ajouterOuModifierCategorie() {
    if (!this.editingMode) {
      this.ajouterCategorie();
    } else if (this.selectedCategory) {
      if (this.newCategoryLibelle !== this.selectedCategory.libeller) {
        this.modifierCategorie();
        
      }
    }
  }

  searchCategory() {
    this.categorieService.searchCategories(this.searchTerm).subscribe(
      (categories: Category[]) => {
        this.categories = categories;
        this.searchResultsFound = categories.length > 0;
      },
      (error: Category) => {
        console.error(error);
      }
    );
  }
  toggleCategorySelection(category: Category) {
    const index = this.selectedCategories.indexOf(category);

    if (index === -1) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories.splice(index, 1);
    }

    // Mise à jour de l'état de la case à cocher "Sélectionner tout"
    this.updateSelectAllCategoriesState();
  }
  
  toggleAllCategories() {
    if (this.selectAllCategories) {
      this.selectedCategories = this.categories.slice();
    } else {
      this.selectedCategories = [];
    }

    // Mise à jour de l'état de la case à cocher "Sélectionner tout" en mode édition
    if (this.editingMode) {
      this.selectAllCategoriesInEditMode = this.selectAllCategories;
    }
  }
  //mise à jour de l'état de la case à cocher "Sélectionner tout"
  updateSelectAllCategoriesState() {
    this.selectAllCategories =
      this.selectedCategories.length === this.categories.length;
  }

  toggleEditMode() {
    this.editingMode = !this.editingMode;
    if (!this.editingMode) {
      this.selectedCategories = [];
      this.selectAllCategories = false;
    }
  }

  // Méthode pour vérifier l'existence d'un libellé
  checkExistingLibelle() {
    if (this.newCategoryLibelle.length >= 3) {
      this.categorieService.searchCategories(this.newCategoryLibelle).subscribe(
        (categories: Category[]) => {
          this.isLibelleExisting = categories.some(
            (category) => category.libeller === this.newCategoryLibelle
          );
          this.setErrorMessage();
        },
        (error) => {
          console.error('Error searching categories:', error);
        }
      );
    } else {
      this.isLibelleExisting = false;
      this.error = ''; // Clear the error message when libelle length is less than 3
    }
  }

  setErrorMessage() {
    this.error = this.isLibelleExisting ? 'Ce libellé existe déjà.' : '';
  }

  // Méthode pour vérifier si le bouton "Enregistrer" est activé
  isButtonEnabled() {
    
    return this.newCategoryLibelle.length >= 3 && !this.isLibelleExisting;
   
  }
}
