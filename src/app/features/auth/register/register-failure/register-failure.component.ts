import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-register-failure',
  standalone: true,
  imports: [],
  templateUrl: './register-failure.component.html',
  styleUrl: './register-failure.component.css',
})
export class RegisterFailureComponent {
  @Input() name: string = '';
  @Input() message: string = 'Error!';
}
