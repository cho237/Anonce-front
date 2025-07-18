import {Component, computed, inject, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {User} from "../user/user.model";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Subscription} from "rxjs";
import {AuthService} from "../user/auth/auth.service";
import {UserService} from "../user/user.service";
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Anonce, ReadAnonces} from "../anonce/anonce.model";
import {VoteCandidate, VoteListRes} from "../vote/vote.model";
import {AnonceService} from "../anonce/anonce.service";
import {VoteService} from "../vote/vote.service";
import {DatePipe, NgClass} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-home',
    imports: [
        NgClass,
        DatePipe,
        FormsModule,
        MatIcon,
        MatProgressSpinner
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
    user = signal<User | null>(null);
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
    annoncement = signal<Anonce[]>([])
    annoncementRead = signal<ReadAnonces[]>([])
    votes = signal<VoteListRes[]>([])
    voteService = inject(VoteService)
    annonceService = inject(AnonceService);
    detailAnonce = signal<Anonce | null>(null)
    detailVote = signal<VoteListRes | null>(null)
    selectedCanditate = signal<VoteCandidate | null>(null)
    password = ''
    readonly votedCount = computed(() =>
        this.votes().filter(v => v.userVote != null).length
    );


    voteDialogRef?: MatDialogRef<any, any>;
    @ViewChild('voteDialog') voteDialog: any;

    confirmVoteDialogRef?: MatDialogRef<any, any>;
    @ViewChild('confirmVoteDialog') confirmVoteDialog: any;


    annonceDialogRef?: MatDialogRef<any, any>;
    @ViewChild('annoceDialog') annoceDialog: any;
    dialog = inject(MatDialog);

    openVoteModal(vote: VoteListRes) {
        this.detailVote.set(vote);
        this.voteDialogRef = this.dialog.open(this.voteDialog, {
            // height: '90vh',
            width: '700px',
            maxWidth: '90vw',
            autoFocus: false,
            disableClose: true,
        });
    }

    confirmVote() {
        this.closeConfirmVoteModal();
        this.castVote(this.selectedCanditate()!.id!)
    }

    viewPass() {
        this.visiblePass.set(!this.visiblePass());
    }

    markAnoncementAsRead(id: string) {
        this.annonceService.markAsRead(id).subscribe(
            {
                next: (res) => {
                    this.annoncementRead.set(res);
                }
            }
        )
    }


    openConfirmVoteDialog(candidate: VoteCandidate) {
        this.password = ""
        this.selectedCanditate.set(candidate);
        this.confirmVoteDialogRef = this.dialog.open(this.confirmVoteDialog, {
            // height: '90vh',
            width: '500px',
            maxWidth: '90vw',
            autoFocus: false,
            disableClose: true,
        });
    }

    openAnonceModal(anonce: Anonce) {
        if(!this.isRead(anonce.id!)) {
            this.markAnoncementAsRead(anonce.id!);
        }
        this.detailAnonce.set(anonce);
        this.annonceDialogRef = this.dialog.open(this.annoceDialog, {
            // height: '90vh',
            width: '600px',
            maxWidth: '90vw',
            autoFocus: false,
            disableClose: true,
        });
    }

    isRead(id: string): boolean {
        return this.annoncementRead().some(item => item.anonce!.id === id);
    }

    closeAnonceModal() {
        this.annonceDialogRef?.close();
    }

    closeVoteModal() {
        this.voteDialogRef?.close();
    }

    closeConfirmVoteModal() {
        this.confirmVoteDialogRef?.close();
    }


    castVote(candidateId: string): void {
        this.voting.set(true)
        const voteId = this.detailVote()?.voteData.id!
        this.voteService.cast(voteId, candidateId, this.password).subscribe({
            next: (data) => {
                this.voting.set(false);

                if (!data.success) {
                    const errMsg = Array.isArray(data.message)
                        ? data.message[0]
                        : data.message || 'An error occurred. Try again.';
                    this.toaster.error(errMsg);
                    return;
                }


                const updatedVotes = this.votes().map(vote => {
                    if (vote.voteData.id === voteId) {
                        return {
                            ...vote,
                            userVote: {candidateId}
                        };
                    }
                    return vote;
                });
                this.votes.set(updatedVotes);

                this.toaster.success("Vote successfully cast!");
                this.closeVoteModal();
            },
            error: () => {
                this.voting.set(false);
                this.toaster.error("An error occurred. Try again.");
            }
        })
    }


    ngOnInit() {
        this.getVotes()
        this.user.set(this.authService.currentUser())
        this.loading.set(true);
        this.getAnoncements();
    }
    getAnoncements(){
        this.loadingAnoncements.set(true)
        this.subs.add(
            this.annonceService.getAll().subscribe({
                next: (data) => {

                    this.annoncement.set(data);
                },
                error: (err) => this.loadingAnoncements.set(false)
            })
        )
        this.subs.add(
            this.annonceService.readByUser().subscribe({
                next: (data) => {

                    this.annoncementRead.set(data);
                    this.loadingAnoncements.set(false)
                },
                error: (err) => this.loadingAnoncements.set(false)
            })
        )
    }
    getVotes(){
        this.loadingVotes.set(true)
        this.subs.add(
            this.voteService.getAll(true).subscribe({
                next: (data) => {
                    console.log(data)
                    this.votes.set(data.data!);
                    this.loadingVotes.set(false)
                },
                error: (err) => this.loadingVotes.set(false)
            })
        )
    }


    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
