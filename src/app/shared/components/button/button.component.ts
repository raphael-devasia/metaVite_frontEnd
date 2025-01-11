import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent implements OnInit{
  @Output() nextStageEvent = new EventEmitter<number>();
  @Input() label: string = 'Next';
  @Input() buttonStatus!: EventEmitter<boolean>;
  isButtonActive:boolean=false

  changeTheIndex() {
    this.nextStageEvent.emit(1);
  }
  ngOnInit(): void {
    this.buttonStatus.subscribe((data)=>{
     console.log(data);
     
      if(data===true){
        this.isButtonActive=true
      }else{
        this.isButtonActive = false;
      }
    })
  }
}
