export interface Article {
  id: number;
  libeller: string;
  prix: number;
  stock: number;
  reference: string;
  categorie_libeller: string; // Ajoutez cette propriété
  fournisseur_nom: string; // Ajoutez cette propriété
  delete: boolean;
  photo: File;
}


// Ajoutez une interface pour représenter la réponse paginée
export interface PaginatedResponse {
  data: Article[];
  current_page: number;
  last_page: number;
}
