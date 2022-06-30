import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PssOwnerComponent } from './pss-owner.component';

describe('PssOwnerComponent', () => {
  let component: PssOwnerComponent;
  let fixture: ComponentFixture<PssOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PssOwnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PssOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
