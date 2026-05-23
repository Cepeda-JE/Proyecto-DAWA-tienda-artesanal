import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudOpinion } from './crud-opinion';

describe('CrudOpinion', () => {
  let component: CrudOpinion;
  let fixture: ComponentFixture<CrudOpinion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudOpinion],
    }).compileComponents();

    fixture = TestBed.createComponent(CrudOpinion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
