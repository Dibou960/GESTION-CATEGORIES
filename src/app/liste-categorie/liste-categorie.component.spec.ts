import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeCategorieComponent } from './liste-categorie.component';

describe('ListeCategorieComponent', () => {
  let component: ListeCategorieComponent;
  let fixture: ComponentFixture<ListeCategorieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeCategorieComponent]
    });
    fixture = TestBed.createComponent(ListeCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
