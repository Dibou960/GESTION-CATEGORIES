import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  
  @Output() previousPageClicked = new EventEmitter<void>();
  @Output() nextPageClicked = new EventEmitter<void>();

  previousPage() {
    console.log('Bouton Précédent cliqué');
    this.previousPageClicked.emit();
  }

  nextPage() {
    console.log('Bouton Suivant cliqué');
    this.nextPageClicked.emit();
  }
}
