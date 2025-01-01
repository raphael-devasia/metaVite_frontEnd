import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-edit-delete-view',
  standalone: true,
  imports: [],
  templateUrl: './edit-delete-view.component.html',
  styleUrls: ['./edit-delete-view.component.css'],
})
export class EditDeleteViewComponent {
  @Output() selectedAction = new EventEmitter<string>();
  @Input() id?: string;
  @Input() item?: string;
  constructor(@Inject(DataService) private dataService: DataService) {}

  selectAction(action: string) {
    this.dataService.sendData({ action, id: this.id ,item:this.item});
  }
}
