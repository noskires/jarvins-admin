import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricCompanyComponent } from './electric-company.component';

describe('ElectricCompanyComponent', () => {
  let component: ElectricCompanyComponent;
  let fixture: ComponentFixture<ElectricCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectricCompanyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
