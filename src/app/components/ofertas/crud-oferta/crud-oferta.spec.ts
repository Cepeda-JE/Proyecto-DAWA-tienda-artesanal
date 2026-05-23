import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudOferta } from './crud-oferta';

describe('CrudOferta', () => {
  let component: CrudOferta;
  let fixture: ComponentFixture<CrudOferta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudOferta],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudOferta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
