import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Anonce, ReadAnonces } from '../../../core/models/anonce.model';
import {
  VoteListRes,
  VoteCandidate,
  Vote,
} from '../../../core/models/vote.model';
import { AnonceService } from '../../../core/services/anonce.service';
import { VoteService } from '../../../core/services/vote.service';
import { AuthService } from '../../user/auth/auth.service';
import { User } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { CommonModule, DatePipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-home-user',
  imports: [
    ModalComponent,
    CommonModule,
    MatProgressSpinner,
    FormsModule,
    MatIcon,
    HeaderComponent,
  ],
  templateUrl: './home-user.component.html',
  styleUrl: './home-user.component.scss',
})
export class HomeUserComponent implements OnInit, OnDestroy {
  [x: string]: any;
  user = signal<User | null>(null);
  isVoteModalOpen = signal(false);
  isAnnoncementModalOpen = signal(false);
  router = inject(Router);
  visiblePass = signal(false);
  loading = signal(false);
  loadingVotes = signal(false);
  loadingAnoncements = signal(false);
  voting = signal(false);
  toaster = inject(ToastrService);
  subs = new Subscription();
  authService = inject(AuthService);
  userService = inject(UserService);
  annoncement = signal<Anonce[]>([]);
  annoncementRead = signal<ReadAnonces[]>([]);
  votes = signal<VoteListRes[]>([]);
  voteService = inject(VoteService);
  annonceService = inject(AnonceService);
  detailAnonce = signal<Anonce | null>(null);
  detailVote = signal<VoteListRes | null>(null);
  selectedCanditate = signal<VoteCandidate | null>(null);
  password = '';
  newComment = '';
  dialog = inject(MatDialog);
  editMode = signal(false);
  readonly votedCount = computed(
    () => this.votes().filter((v) => v.userVote != null).length
  );
  anonce: Anonce = {
    title: '',
    content: '',
  };
  savingAnnonce = signal(false);
  isAnonceModalOpen = signal(false);

  confirmVoteDialogRef?: MatDialogRef<any, any>;
  @ViewChild('confirmVoteDialog') confirmVoteDialog: any;

  openVoteModal(vote: VoteListRes) {
    this.detailVote.set(vote);
    this.isVoteModalOpen.set(true);
  }

  confirmVote() {
    this.closeConfirmVoteModal();
    this.castVote(this.selectedCanditate()!.id!);
  }

  viewPass() {
    this.visiblePass.set(!this.visiblePass());
  }

  closeAnoncementModal() {
    this.isAnonceModalOpen.set(false);
  }

  markAnoncementAsRead(id: string) {
    this.annonceService.markAsRead(id).subscribe({
      next: (res) => {
        this.annoncementRead.set(res);
      },
    });
  }

  getAnoncementDetails(id: string) {
    this.annonceService.details(id).subscribe({
      next: (data) => {
        this.detailAnonce.set(data);
        this.isAnnoncementModalOpen.set(true);
      },
      error: (err) => {
        this.toaster.error("Erreur lors de la récupération de l'annonce.");
      },
    });
  }

  openNewAnonceModal(editMode: boolean, anonce?: Anonce) {
    if (!editMode) this.emptyAnonce();
    if (anonce) this.anonce = anonce!;
    this.editMode.set(editMode);
    this.isAnonceModalOpen.set(true);
  }

  hasVoted(voteId: string): boolean {
    return this.votes().some(
      (vote) => vote.voteData.id === voteId && vote.userVote
    );
  }

  emptyAnonce() {
    this.anonce = {
      title: '',
      content: '',
    };
  }

  submitAnonce() {
    this.savingAnnonce.set(true);
    this.subs.add(
      this.annonceService.add(this.anonce).subscribe({
        next: (data) => {
          this.toaster.success('Annonce créée avec succès');
          this.annoncement.set(data);
          this.savingAnnonce.set(false);
          this.isAnonceModalOpen.set(false);
          this.emptyAnonce();
        },
        error: (err) => {
          this.toaster.error("Erreur lors de la création de l'annonce");
          this.savingAnnonce.set(false);
        },
      })
    );
  }

  openConfirmVoteDialog(candidate: VoteCandidate) {
    if (this.detailVote()!.userVote) return;
    this.password = '';
    this.selectedCanditate.set(candidate);
    this.isVoteModalOpen.set(false);
    this.confirmVoteDialogRef = this.dialog.open(this.confirmVoteDialog, {
      // height: '90vh',
      width: '400px',
      maxWidth: '90vw',
      autoFocus: false,
      disableClose: true,
    });
  }

  commentAnonce() {
    if (!this.detailAnonce()) return;
    if (!this.newComment.trim()) {
      this.toaster.error('Le contenu du commentaire ne peut pas être vide.');
      return;
    }
    this.annonceService
      .comment(this.detailAnonce()!.id!, this.newComment.trim())
      .subscribe({
        next: (data) => {
          this.toaster.success('Commentaire ajouté avec succès');
          // Only set the comments array from backend, do not append locally
          this.detailAnonce.set(data);
          this.newComment = '';
        },
        error: (err) => {
          this.toaster.error("Erreur lors de l'ajout du commentaire.");
        },
      });
  }

  openAnonceModal(anonce: Anonce) {
    if (!this.isRead(anonce.id!)) {
      this.markAnoncementAsRead(anonce.id!);
    }
    this.getAnoncementDetails(anonce.id!);
    this.isAnnoncementModalOpen.set(true);
  }

  isRead(id: string): boolean {
    return this.annoncementRead().some((item) => item.anonce!.id === id);
  }

  closeAnonceModal() {
    this.isAnnoncementModalOpen.set(false);
  }

  closeVoteModal() {
    this.isVoteModalOpen.set(false);
  }

  closeConfirmVoteModal() {
    this.confirmVoteDialogRef?.close();
    if (this.detailVote()) {
      this.isVoteModalOpen.set(true);
    }
  }

  castVote(candidateId: string): void {
    this.voting.set(true);
    const voteId = this.detailVote()?.voteData.id!;
    this.voteService.cast(voteId, candidateId, this.password).subscribe({
      next: (data) => {
        this.voting.set(false);

        if (!data.success) {
          const errMsg = Array.isArray(data.message)
            ? data.message[0]
            : data.message || 'Une erreur est survenue. Réessayez.';
          this.toaster.error(errMsg);
          return;
        }

        const updatedVotes = this.votes().map((vote) => {
          if (vote.voteData.id === voteId) {
            return {
              ...vote,
              userVote: { candidateId },
            };
          }
          return vote;
        });
        this.votes.set(updatedVotes);

        this.toaster.success('Vote enregistré avec succès !');
        this.closeVoteModal();
      },
      error: () => {
        this.voting.set(false);
        this.toaster.error('Une erreur est survenue. Réessayez.');
      },
    });
  }

  ngOnInit() {
    this.getVotes();
    this.user.set(this.authService.currentUser());
    this.loading.set(true);
    this.getAnoncements();
  }
  getAnoncements() {
    this.loadingAnoncements.set(true);
    this.subs.add(
      this.annonceService.getAll().subscribe({
        next: (data) => {
          this.annoncement.set(data);
        },
        error: (err) => this.loadingAnoncements.set(false),
      })
    );
    this.subs.add(
      this.annonceService.readByUser().subscribe({
        next: (data) => {
          this.annoncementRead.set(data);
          this.loadingAnoncements.set(false);
        },
        error: (err) => this.loadingAnoncements.set(false),
      })
    );
  }
  getVotes() {
    this.loadingVotes.set(true);
    this.subs.add(
      this.voteService.getAll(true).subscribe({
        next: (data) => {
          this.votes.set(data.data!);
          this.loadingVotes.set(false);
          if (!data.success) {
            const errMsg = Array.isArray(data.message)
              ? data.message[0]
              : data.message || 'Une erreur est survenue. Réessayez.';
            this.toaster.error(errMsg);
            return;
          }
        },
        error: (err) => this.loadingVotes.set(false),
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
