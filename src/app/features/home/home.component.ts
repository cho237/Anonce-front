import {Component, inject, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {User} from "../user/user.model";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Subscription} from "rxjs";
import {AuthService} from "../user/auth/auth.service";
import {UserService} from "../user/user.service";
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Anonce, ReadAnonces} from "../anonce/anonce.model";
import {Vote} from "../vote/vote.model";
import {AnonceService} from "../anonce/anonce.service";
import {VoteService} from "../vote/vote.service";
import {DatePipe, NgClass} from "@angular/common";

@Component({
    selector: 'app-home',
    imports: [
        NgClass,
        DatePipe
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
    user = signal<User | null>(null);
    router = inject(Router);
    loading = signal(false);
    toaster = inject(ToastrService);
    subs = new Subscription();
    authService = inject(AuthService);
    userService = inject(UserService);
    annoncement = signal<Anonce[]>([])
    annoncementRead = signal<ReadAnonces[]>([])
    votes = signal<Vote[]>([])
    voteService = inject(VoteService)
    annonceService = inject(AnonceService);
    detailAnonce = signal<Anonce|null>(null)
    detailVote = signal<Vote|null>(null)

    voteDialogRef?: MatDialogRef<any, any>;
    @ViewChild('voteDialog') voteDialog: any;


    annonceDialogRef?: MatDialogRef<any, any>;
    @ViewChild('annoceDialog') annoceDialog: any;
    dialog = inject(MatDialog);

    openVoteModal(vote: Vote) {
        this.detailVote.set(vote);
        this.voteDialogRef = this.dialog.open(this.voteDialog, {
            // height: '90vh',
            width: '700px',
            maxWidth: '90vw',
            autoFocus: false,
            disableClose: true,
            panelClass: 'custom-modal-panel',
            backdropClass: 'custom-modal-backdrop',
        });
    }

    openAnonceModal(anonce: Anonce) {
        this.detailAnonce.set(anonce);
        this.annonceDialogRef = this.dialog.open(this.annoceDialog, {
            // height: '90vh',
            width: '600px',
            maxWidth: '90vw',
            autoFocus: false,
            disableClose: true,
        });
    }

    isRead(id:string):boolean {
     return  this.annoncementRead().some(item => item.anonce.id === id);
    }

    closeAnonceModal() {
        this.annonceDialogRef?.close();
    }

    closeVoteModal() {
        this.voteDialogRef?.close();
    }


    ngOnInit() {
        this.user.set(this.authService.currentUser())
        this.loading.set(true);
        this.subs.add(
            this.annonceService.getAll().subscribe({
                next: (data) => {
                    console.log(data);
                    this.annoncement.set(data);
                },
                error: (err) => this.loading.set(false)
            })
        )
        this.subs.add(
            this.voteService.getAll(true).subscribe({
                next: (data) => {
                    console.log(data.data);
                    this.votes.set(data.data!);
                    this.loading.set(false)
                },
                error: (err) => this.loading.set(false)
            })
        )
        this.subs.add(
            this.annonceService.readByUser().subscribe({
                next: (data) => {
                    console.log(data);
                    this.annoncementRead.set(data);
                    this.loading.set(false)
                },
                error: (err) => this.loading.set(false)
            })
        )
    }


    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
