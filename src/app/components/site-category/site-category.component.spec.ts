import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCategoryComponent } from './site-category.component';

describe('SiteCategoryComponent', () => {
  let component: SiteCategoryComponent;
  let fixture: ComponentFixture<SiteCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiteCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
