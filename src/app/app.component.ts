import { Component, OnInit } from '@angular/core';
import { RegisterComponent } from './features/auth/register/register.component';

import { CommonModule } from '@angular/common';
import { HomePageComponent } from './features/home-page/home-page.component';
import { RouterOutlet } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SocketioService } from './core/services/socketio.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatDialogModule, MatButtonModule],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
 
  ngOnInit(): void {
    
  }
  
}
