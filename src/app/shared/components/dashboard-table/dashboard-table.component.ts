import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-table.component.html',
  styleUrl: './dashboard-table.component.css',
})
export class DashboardTableComponent implements OnInit {
  @Input() bidTableData: {
    title: string;
    button: string;
    statuses: string[];
    tableHeads: string[];
    tableData: any[];
  } = { title: '', button: '', statuses: [], tableHeads: [], tableData: [] };
  @Input() shipmentTableData: any = {};
  @Input() clientTableData: any = {};
  @Input() pickupTableData: any = {};
  ngOnInit(): void {
    console.log(this.bidTableData);
  }
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
