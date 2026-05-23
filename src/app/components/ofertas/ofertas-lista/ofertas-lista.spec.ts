import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertasLista } from './ofertas-lista';

describe('OfertasLista', () => {
  let component: OfertasLista;
  let fixture: ComponentFixture<OfertasLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfertasLista],
    }).compileComponents();

    fixture = TestBed.createComponent(OfertasLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
