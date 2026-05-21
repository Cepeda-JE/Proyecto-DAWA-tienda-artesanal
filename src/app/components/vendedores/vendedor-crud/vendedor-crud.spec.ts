import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendedorCrud } from './vendedor-crud';

describe('VendedorCrud', () => {
  let component: VendedorCrud;
  let fixture: ComponentFixture<VendedorCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendedorCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(VendedorCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
