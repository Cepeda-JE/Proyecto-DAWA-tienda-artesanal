import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpinionesLista } from './opiniones-lista';

describe('OpinionesLista', () => {
  let component: OpinionesLista;
  let fixture: ComponentFixture<OpinionesLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpinionesLista],
    }).compileComponents();

    fixture = TestBed.createComponent(OpinionesLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
