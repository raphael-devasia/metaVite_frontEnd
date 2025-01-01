import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() buttonTexts: string[] = ['hello'];
  @Output() buttonClick = new EventEmitter<string>();

  onButtonClick(text: string) {
    this.buttonClick.emit(text);
  }
}
