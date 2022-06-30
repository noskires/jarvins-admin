import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TteComponent } from './tte.component';

describe('TteComponent', () => {
  let component: TteComponent;
  let fixture: ComponentFixture<TteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
