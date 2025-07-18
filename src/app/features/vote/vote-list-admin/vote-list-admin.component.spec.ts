import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteListAdminComponent } from './vote-list-admin.component';

describe('VoteListAdminComponent', () => {
  let component: VoteListAdminComponent;
  let fixture: ComponentFixture<VoteListAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteListAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoteListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
