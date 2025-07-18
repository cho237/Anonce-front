import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonceListUserComponent } from './anonce-list-user.component';

describe('AnonceListUserComponent', () => {
  let component: AnonceListUserComponent;
  let fixture: ComponentFixture<AnonceListUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnonceListUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnonceListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
