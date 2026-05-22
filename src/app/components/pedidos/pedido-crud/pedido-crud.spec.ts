import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoCrud } from './pedido-crud';

describe('PedidoCrud', () => {
  let component: PedidoCrud;
  let fixture: ComponentFixture<PedidoCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PedidoCrud],
    }).compileComponents();

    fixture = TestBed.createComponent(PedidoCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
