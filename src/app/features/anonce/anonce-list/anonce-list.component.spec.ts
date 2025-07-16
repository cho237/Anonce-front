import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonceListComponent } from './anonce-list.component';

describe('AnonceListComponent', () => {
  let component: AnonceListComponent;
  let fixture: ComponentFixture<AnonceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnonceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnonceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
