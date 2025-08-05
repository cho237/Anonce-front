import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Subscription } from 'rxjs';
import { Vote, VoteListRes, VoteResult } from '../../../core/models/vote.model';
import { Anonce, AnonceReader } from '../../../core/models/anonce.model';
import { ToastrService } from 'ngx-toastr';
import { VoteService } from '../../../core/services/vote.service';
import { AnonceService } from '../../../core/services/anonce.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CommonModule, DatePipe } from '@angular/common';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { User } from '../../user/user.model';
import { AuthService } from '../../user/auth/auth.service';

@Component({
  selector: 'app-home-admin',
  imports: [
    MatTabsModule,
    MatProgressSpinner,
    CommonModule,
    ModalComponent,
    MatSlideToggleModule,
    FormsModule,
    HeaderComponent,
    MatProgressBarModule,
  ],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.scss',
})
export class HomeAdminComponent implements OnInit, OnDestroy {
  subs = new Subscription();
  loadingVotes = signal(false);
  loadingReaders = signal(false);
  publishingResults = signal(false);
  creatingVote = signal(false);
  loadingResults = signal(false);
  readers = signal<AnonceReader[]>([]);
  results = signal<VoteResult[]>([]);
  deleting = signal(false);
  votes = signal<VoteListRes[]>([]);
  user = signal<User | null>(null);
  anonce: Anonce = {
    title: '',
    content: '',
  };
  deleteData = {
    id: '',
    title: '',
    isAnonce: false,
  };
  annoncement = signal<Anonce[] | null>(null);
  vote: Vote = {
    id: '',
    title: '',
    description: '',
    candidates: [],
  };
  savingAnnonce = signal(false);
  isVoteModalOpen = signal(false);
  isReadersModalOpen = signal(false);
  isVoteResultsModalOpen = signal(false);
  isAnonceModalOpen = signal(false);
  isConfirmDeleteModalOpen = signal(false);
  toaster = inject(ToastrService);
  loadingAnoncements = signal(false);
  voteService = inject(VoteService);
  annonceService = inject(AnonceService);
  editMode = signal(false);
  editModeVote = signal(false);
  anonceId = signal<string | null>(null);
  voteData = signal<Vote | null>(null);
  authService = inject(AuthService);
  newVote: Vote = {
    title: '',
    description: '',
    candidates: [
      {
        name: '',
        description: '',
      },
    ],
  };

  ngOnInit(): void {
    this.getVotes();
    this.getAnoncements();
    this.user.set(this.authService.currentUser());
  }

  addCandidate() {
    this.newVote.candidates.push({ name: '', description: '' });
  }

  removeCandidate(index: number) {
    this.newVote.candidates.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }

  openVoteModal(editMode: boolean, vote?: Vote) {
    if (vote) this.newVote = vote!;
    if (!editMode) this.emptyVote();
    this.editModeVote.set(editMode);
    this.isVoteModalOpen.set(true);
  }

  loadReaders() {
    this.loadingReaders.set(true);
    this.subs.add(
      this.annonceService.readers(this.anonceId()!).subscribe({
        next: (data) => {
          this.readers.set(data);
          this.loadingReaders.set(false);
        },
        error: (err) => {
          this.toaster.error('Erreur lors du chargement des lecteurs');
          this.loadingReaders.set(false);
        },
      })
    );
  }

  loadResults() {
    this.loadingResults.set(true);
    this.subs.add(
      this.voteService.results(this.voteData()?.id!).subscribe({
        next: (data) => {
          this.results.set(data.data!);
          console.log(this.results());
          this.loadingResults.set(false);
        },
        error: (err) => {
          this.toaster.error('Erreur lors du chargement des résultats');
          this.loadingResults.set(false);
        },
      })
    );
  }

  votePercentage(votes: number): number {
    const totalVotes = this.results().reduce(
      (acc, result) => acc + result.count,
      0
    );
    const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
    return Math.round(percentage * 100) / 100; // Round to 2 decimal places
  }

  openConfirmDeleteModal(isAnonce: boolean, id: string, title: string) {
    this.isConfirmDeleteModalOpen.set(true);
    this.deleteData = {
      id,
      title,
      isAnonce,
    };
  }
  closeConfirmDeleteModal() {
    this.isConfirmDeleteModalOpen.set(false);
  }

  closeReadersModal() {
    this.isReadersModalOpen.set(false);
  }

  openVoteResultsModal(vote: Vote) {
    this.voteData.set(vote);
    this.isVoteResultsModalOpen.set(true);
    this.loadResults();
  }

  closeVoteResultsModal() {
    this.isVoteResultsModalOpen.set(false);
  }

  openReadersModal(id: string) {
    this.anonceId.set(id);
    this.isReadersModalOpen.set(true);
    this.loadReaders();
  }

  onToggleVote(event: MatSlideToggleChange, voteId: string) {
    const newValue = event.checked;

    this.subs.add(
      this.voteService.activate(voteId, newValue).subscribe({
        next: (data) => {
          this.toaster.success('Vote mis à jour avec succès');
          if (!data.success) {
            const errMsg = Array.isArray(data.message)
              ? data.message[0]
              : data.message || 'Une erreur est survenue. Réessayez.';
            this.toaster.error(errMsg);
            return;
          }
        },
        error: (err) => {
          this.toaster.error(
            'Erreur lors de la création de la mise à jour du vote'
          );
        },
      })
    );
  }

  delete() {
    this.deleting.set(true);
    if (this.deleteData.isAnonce) {
      this.subs.add(
        this.annonceService.delete(this.deleteData.id).subscribe({
          next: (data) => {
            this.toaster.success('Annonce supprimée avec succès');
            this.annoncement.set(data);
            this.closeConfirmDeleteModal();
            this.deleting.set(false);
          },
          error: (err) => {
            this.toaster.error("Erreur lors de la suppression de l'annonce");
            this.deleting.set(false);
          },
        })
      );
    } else {
      this.subs.add(
        this.voteService.delete(this.deleteData.id).subscribe({
          next: () => {
            this.toaster.success('Vote supprime avec succès');
            const updatedVotes = this.votes().filter(
              (vote) => vote.voteData.id !== this.deleteData.id
            );
            this.votes.set(updatedVotes);
            this.closeConfirmDeleteModal();
            this.deleting.set(false);
          },
          error: (err) => {
            this.toaster.error('Erreur lors de la suppression du vote');
            this.deleting.set(false);
          },
        })
      );
    }
  }

  openAnonceModal(editMode: boolean, anonce?: Anonce) {
    if (!editMode) this.emptyAnonce();
    if (anonce) this.anonce = anonce!;
    this.editMode.set(editMode);
    this.isAnonceModalOpen.set(true);
  }

  submitVote() {
    this.creatingVote.set(true);
    this.subs.add(
      this.voteService.add(this.newVote).subscribe({
        next: (data) => {
          if (!data.success) {
            const errMsg = Array.isArray(data.message)
              ? data.message[0]
              : data.message || 'Une erreur est survenue. Réessayez.';
            this.toaster.error(errMsg);
            return;
          }
          this.toaster.success('Vote ajouté avec succès');
          this.creatingVote.set(false);
          this.getVotes();
          this.closeVoteModal();
        },
        error: () => {
          this.creatingVote.set(false);
          this.toaster.error('Une erreur est survenue. Réessayez.');
        },
      })
    );
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
          if (this.isVoteResultsModalOpen()) this.closeVoteResultsModal();
          this.emptyAnonce();
        },
        error: (err) => {
          this.toaster.error("Erreur lors de la création de l'annonce");
          this.savingAnnonce.set(false);
        },
      })
    );
  }

  publishResults() {
    const content = this.results()
      .map(
        (result, index) =>
          `${result.name}: ${result.count} votes (${this.votePercentage(
            result.count
          )}%)${index === 0 ? '🏆 ' : ''}`
      )
      .join('\n');

    this.anonce = {
      title: 'Résultats du vote: ' + this.voteData()?.title,
      content: content,
    };

    this.submitAnonce();
  }

  emptyAnonce() {
    this.anonce = {
      title: '',
      content: '',
    };
  }
  emptyVote() {
    this.newVote = {
      title: '',
      description: '',
      candidates: [
        {
          name: '',
          description: '',
        },
      ],
    };
  }

  getAnoncements() {
    this.loadingAnoncements.set(true);
    this.subs.add(
      this.annonceService.getAll().subscribe({
        next: (data) => {
          this.annoncement.set(data);
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
        },
        error: (err) => this.loadingVotes.set(false),
      })
    );
  }
  closeVoteModal() {
    this.isVoteModalOpen.set(false);
  }

  closeAnoncementModal() {
    this.isAnonceModalOpen.set(false);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
