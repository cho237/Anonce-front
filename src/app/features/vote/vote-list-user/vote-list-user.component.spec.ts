import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteListUserComponent } from './vote-list-user.component';

describe('VoteListUserComponent', () => {
  let component: VoteListUserComponent;
  let fixture: ComponentFixture<VoteListUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteListUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoteListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
