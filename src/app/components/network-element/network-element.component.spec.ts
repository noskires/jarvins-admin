import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkElementComponent } from './network-element.component';

describe('NetworkElementComponent', () => {
  let component: NetworkElementComponent;
  let fixture: ComponentFixture<NetworkElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
