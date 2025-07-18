import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonceListAdminComponent } from './anonce-list-admin.component';

describe('AnonceListAdminComponent', () => {
  let component: AnonceListAdminComponent;
  let fixture: ComponentFixture<AnonceListAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnonceListAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnonceListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
