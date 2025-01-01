import { Component, Input, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { BaseChartDirective } from 'ng2-charts';

import { TableComponent } from '../table/table.component';
import { DashboardTableComponent } from '../dashboard-table/dashboard-table.component';
import { ChartData, ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrier-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    DashboardTableComponent,
    BaseChartDirective,
    CommonModule,
  ],
  templateUrl: './carrier-dashboard.component.html',
  styleUrl: './carrier-dashboard.component.css',
})
export class CarrierDashboardComponent {
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
  @Input() fullData: any[] = [];
  statsCalculated: boolean = false; // Flag to prevent recalculation

  carrierStats: {
    carrierId: string;
    loads: number;
    amount: number;
    name: string;
  }[] = [];
  totalCarriers = 0;
  totalLoadsDelivered = 0;
  totalAmountPaid = 0;

  totalShippers = 0;
  totalLoadsFromShippers = 0;
  totalAmountReceived = 0;
  shipperStats: {
    shipperId: string;
    loads: number;
    amount: number;
    name: string;
  }[] = [];
  highestPaidShipper: {
    name: string;
    shipperId: string;
    loads: number;
    amount: number;
  } | null = null;
  topShippers!: {
    name: string;
    loads: number;
    amount: number;
    shipperId: string;
  }[];
  highestPayingShipper!:any

  highestPaidCarrier: {
    name: string;
    carrierId: string;
    loads: number;
    amount: number;
  } | null = null;
  topCarriers!: {
    name: string;
    loads: number;
    amount: number;
    carrierId: string;
  }[];

  // Chart Properties
  statusChartData!: ChartData<'doughnut'>;
  statusChartOptions!: ChartOptions;
  paymentsChartData!: ChartData<'bar'>;
  paymentsChartOptions!: ChartOptions;
  barChartData!: ChartData<'bar'>;
  barChartOptions!: ChartOptions;

  calculateStats() {
    console.log('Full Data:', this.fullData);

    if (!this.fullData || this.fullData.length === 0) {
      console.error('No data available to calculate stats.');
      return;
    }

    const carrierMap: {
      [key: string]: { loads: number; amount: number; name: string };
    } = {};

    const monthlyPayments: { [key: string]: number } = {};
    // Aggregate stats
    this.fullData.forEach((entry: any) => {
      console.log('Processing entry:', entry);

      const carrierId = entry.shipperId;
      let amount = parseInt(entry.amount, 10);

      // Adjust the amount (e.g., divide by 100 if the scale is incorrect)
      amount = amount / 100;
      const loadStatus = entry.loadDetails?.status || '';
      const carrierName =
        entry.shipperDetails?.companyDetails?.companyName || 'Unknown Shipper';
      const dispatchDateTime = entry.loadDetails?.dispatchDateTime;

      // Only count amounts for "Assigned" loads
      if (loadStatus !== 'Delivered') {
        console.log('Skipping entry with load status:', loadStatus);
        return;
      }

      // Check if carrierId and amount are valid
      if (!carrierId || isNaN(amount)) {
        console.error('Invalid entry data:', entry);
        return;
      }

      if (carrierMap[carrierId]) {
        carrierMap[carrierId].loads += 1;
        carrierMap[carrierId].amount += amount;
      } else {
        carrierMap[carrierId] = { loads: 1, amount, name: carrierName };
      }

      this.totalLoadsDelivered += 1;
      this.totalAmountPaid += amount;

      // Aggregate monthly payments using dispatchDateTime
      if (dispatchDateTime) {
        const dispatchDate = new Date(dispatchDateTime);
        const month = dispatchDate.toLocaleString('default', {
          month: 'short',
        }); // Short month name
        const year = dispatchDate.getFullYear();
        const monthKey = `${month} ${year}`; // Format as 'Jan 2024'

        monthlyPayments[monthKey] = (monthlyPayments[monthKey] || 0) + amount;
      }
    });

    console.log('Carrier Map:', carrierMap);

    // Map carrier stats
    this.carrierStats = Object.entries(carrierMap).map(
      ([carrierId, stats]) => ({
        carrierId,
        loads: stats.loads,
        amount: stats.amount,
        name: stats.name, // Added name property here
      })
    );

    console.log('Carrier Stats:', this.carrierStats);
    this.carrierStats.sort((a, b) => b.amount - a.amount);
    const top3Carriers = this.carrierStats.slice(0, 3);
    console.log('Top 3 Carriers:', top3Carriers);
    this.topCarriers = top3Carriers;
    // Calculate total carriers
    this.totalCarriers = this.carrierStats.length;
    console.log('Total Carriers:', this.totalCarriers);
    this.highestPaidCarrier = this.carrierStats.reduce(
      (prev, current) => (current.amount > prev.amount ? current : prev),
      { carrierId: '', loads: 0, amount: 0, name: '' } // Added name here
    );

    console.log('Highest Paid Carrier:', this.highestPaidCarrier);
    console.log('Total Loads Delivered:', this.totalLoadsDelivered);
    console.log('Total Amount Paid:', this.totalAmountPaid);

    this.preparePaymentChartData(monthlyPayments);

    // Sort carrier stats by amount and loads to get top 5 carriers
    const top5Carriers = this.carrierStats
      .sort((a, b) => b.amount - a.amount) // Sort by total amount
      .slice(0, 5); // Get the top 5 carriers

    console.log('Top 5 Carriers:', top5Carriers);

    // Prepare data for the bar chart
    const carrierNames = top5Carriers.map((carrier) => carrier.name);
    const loadsDelivered = top5Carriers.map((carrier) => carrier.loads);
    const totalAmountPaid = top5Carriers.map(
      (carrier) => carrier.amount / 1000
    ); // Convert to K$

    // Create the bar chart data
    this.barChartData = {
      labels: carrierNames,
      datasets: [
        {
          label: 'Loads Delivered',
          data: loadsDelivered,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Total Amount Paid (K$)',
          data: totalAmountPaid,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
    console.log('Bar Chart Data:', this.barChartData);
  }
 

  preparePaymentChartData(monthlyPayments: { [key: string]: number }) {
    // Get the current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Get current month (0-11)
    const currentYear = currentDate.getFullYear();

    // Calculate the months for the last 6 months
    const labels = [];
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const month = (currentMonth - i + 12) % 12; // Adjust for negative values
      const year = currentYear - Math.floor((currentMonth - i) / 12); // Adjust the year
      const monthName = new Date(year, month).toLocaleString('default', {
        month: 'short',
      });
      labels.push(monthName + ' ' + year);

      // Find the amount for this month from the monthlyPayments
      const monthKey = monthName + ' ' + year;
      data.push(monthlyPayments[monthKey] || 0); // If no data found, use 0
    }

    // Set the chart data with the dynamically calculated values
    this.paymentsChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Total Payments to Carriers',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          borderRadius: 5,
          barThickness: 30,
        },
      ],
    };

    console.log('Payments Chart Data:', this.paymentsChartData);
  }

  getChartValues() {
    // Status Chart Configuration
    this.statusChartData = {
      labels: ['Open Loads', 'In-Transit Loads', 'Completed Loads'],
      datasets: [
        {
          data: [10, 20, 40],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#E7E9ED'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#E7E9ED'],
        },
      ],
    };

    this.statusChartOptions = {
      responsive: true,
      plugins: {
        tooltip: {
          enabled: true,
        },
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
      },
    };

    this.paymentsChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Carrier Payments Overview',
          font: {
            size: 16,
          },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(context.parsed.y);
              }
              return label;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          title: {
            display: true,
            text: 'Month',
          },
        },
        y: {
          beginAtZero: true,
          grid: {},
          title: {
            display: true,
            text: 'Payment Amount ($)',
          },
          ticks: {
            callback: function (value) {
              return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value as number);
            },
          },
        },
      },
    };

    // Bar Chart Configuration
    // this.barChartData = {
    //   labels: [
    //     'Swift Transport',
    //     'Road Kings',
    //     'Elite Carriers',
    //     'Prime Logistics',
    //     'Fast Track',
    //   ],
    //   datasets: [
    //     {
    //       label: 'Loads Delivered',
    //       data: [150, 120, 140, 110, 130],
    //       backgroundColor: 'rgba(54, 162, 235, 0.7)',
    //       borderColor: 'rgba(54, 162, 235, 1)',
    //       borderWidth: 1,
    //     },
    //     {
    //       label: 'Avg Delivery Time (Hours)',
    //       data: [48, 52, 45, 50, 47],
    //       backgroundColor: 'rgba(255, 99, 132, 0.7)',
    //       borderColor: 'rgba(255, 99, 132, 1)',
    //       borderWidth: 1,
    //     },
    //     {
    //       label: 'Total Amount Paid (K$)',
    //       data: [75, 62, 68, 55, 65],
    //       backgroundColor: 'rgba(75, 192, 192, 0.7)',
    //       borderColor: 'rgba(75, 192, 192, 1)',
    //       borderWidth: 1,
    //     },
    //   ],
    // };

    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45,
          },
        },
        y: {
          beginAtZero: true,
          grid: {},
        },
      },
    };
  }

  ngOnInit() {
    this.getChartValues();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if 'fullData' has changed
    if (
      changes['fullData'] &&
      !this.statsCalculated &&
      this.fullData &&
      this.fullData.length > 0
    ) {
      console.log('Full data received:', this.fullData);
      this.calculateStats(); // Call the calculation method
      this.statsCalculated = true;
    }
  }
}
