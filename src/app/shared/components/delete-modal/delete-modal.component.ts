import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css',
})
export class DeleteModalComponent {
  @Input() userId!: string;
  @Input() action!: string;
  @Output() closeModal = new EventEmitter<void>();
  @Input() deleteItem!: (userId: string, target: string) => void;
 
  onclose() {
    this.closeModal.emit();
  }
  onDelete() {
    console.log(this.userId);
    console.log(this.action);

    console.log('delete clicked');

    this.deleteItem(this.userId, this.action);
    this.onclose();
  }
}
