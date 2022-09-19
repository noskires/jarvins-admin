import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcPanelComponent } from './dc-panel.component';

describe('DcPanelComponent', () => {
  let component: DcPanelComponent;
  let fixture: ComponentFixture<DcPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DcPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DcPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
