import { NgIf } from '@angular/common';
import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [NgIf],
  template: `
    <div
      style="
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    backdrop-filter: blur(5px);
}"
      class="flex items-center justify-center"
      *ngIf="open"
      (click)="onBackdrop($event)"
    >
      <div
        class="bg-white p-8 rounded-xl w-full max-w-xl max-h-[80vh] overflow-y-auto relative"
        (click)="$event.stopPropagation()"
      >
        <button
          class="absolute top-4 right-6 text-2xl text-gray-400 hover:text-gray-700 cursor-pointer"
          (click)="close.emit()"
        >
          &times;
        </button>
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class ModalComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  onBackdrop(event: MouseEvent) {
    this.close.emit();
  }
}
