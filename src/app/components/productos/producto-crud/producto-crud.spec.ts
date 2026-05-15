import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductoCrud } from './producto-crud';

describe('ProductoCrud', () => {
  let component: ProductoCrud;
  let fixture: ComponentFixture<ProductoCrud>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductoCrud]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductoCrud);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
