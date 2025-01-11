import { CommonModule } from '@angular/common';
import { Component, Inject, inject, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { UserService } from '../../../core/services/user/user.service';
import { ShipperService } from '../../../core/services/shipper/shipper.service';
import { CarrierService } from '../../../features/carrier/services/carrier.service';
import { DriverService } from '../../../layouts/driver-layout/services/driver.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
interface LoadData {
  _id: string;
  status: string;
  dropoffs: number;
}

interface StepperStep {
  label: string;
  status: string;
  completed: boolean;
  current: boolean;
}

interface ActionButton {
  label: string;
  nextStatus: string;
  class: string;
}

@Component({
  selector: 'app-tracker',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './tracker.component.html',
  styleUrl: './tracker.component.css',
})
export class TrackerComponent {
  @Input() loadData!: LoadData;
  @Input() user!: { role: string };
  UserServices = inject(UserService);
  ShipperServices = inject(ShipperService);
  CarrierServices = inject(CarrierService);
  DriverServices = inject(DriverService);
  constructor(
    public dialog: MatDialog,
    @Inject(DataService) private dataService: DataService,
    private toastr: ToastrService
  ) {}

  getDriverActions(
    loadData: any
  ): { label: string; nextStatus: string; class: string }[] {
    const actions: any = [];
    if (!loadData) return actions;

    const { status, dropoffs } = loadData;

    const buttonClass =
      'bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded';

    if (status === 'Dispatched' && dropoffs === 1) {
      actions.push({
        label: 'Confirm Delivery',
        nextStatus: 'Delivered',
        class: buttonClass,
      });
    } else if (status === 'Dispatched' && dropoffs > 1) {
      actions.push({
        label: `Confirm Delivery 1`,
        nextStatus: 'Delivered1-Partial',
        class: buttonClass,
      });
    } else if (status === 'Delivered1' && dropoffs === 2) {
      actions.push({
        label: `Complete Delivery`,
        nextStatus: 'Delivered',
        class: buttonClass,
      });
    } else if (status === 'Delivered1' && dropoffs === 3) {
      actions.push({
        label: `Confirm Delivery 2`,
        nextStatus: 'Delivered2-Partial',
        class: buttonClass,
      });
    } else if (status === 'Delivered2' && dropoffs === 3) {
      actions.push({
        label: `Complete Delivery`,
        nextStatus: 'Delivered',
        class: buttonClass,
      });
    }

    return actions;
  }

  getShipperAction(
    loadData: any
  ): { label: string; nextStatus: string; class: string } | null {
    if (!loadData) return null;

    const { status, dropoffs } = loadData;

    const buttonClass =
      'bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded';

    if (status === 'Delivered' && dropoffs === 1) {
      return {
        label: 'Complete Delivery',
        nextStatus: 'Completed',
        class: buttonClass,
      };
    } else if (status === 'Delivered1-Partial' || status === 'Delivered1') {
      return {
        label: 'Confirm Delivery 1',
        nextStatus: 'Delivered1',
        class: buttonClass,
      };
    } else if (status === 'Delivered2-Partial') {
      return {
        label: 'Confirm Delivery 2',
        nextStatus: 'Delivered2',
        class: buttonClass,
      };
    } else if (status === 'Delivered' && dropoffs > 1) {
      return {
        label: 'Complete Delivery',
        nextStatus: 'Completed',
        class: buttonClass,
      };
    }

    return null;
  }

  isWaitingForDelivery(loadData: any): boolean {
    if (!loadData) return false;

    const waitingStatuses = [
      'Dispatched',
      'Delivered1-Partial',
      'Delivered2-Partial',
    ];
    return waitingStatuses.includes(loadData.status);
  }

  getDeliveryStep(status: string): string {
    const statusMapping: { [key: string]: string } = {
      Dispatched: '1',
      'Delivered1-Partial': '2',
      'Delivered2-Partial': '3',
    };

    return statusMapping[status] || '';
  }

  getProgressWidth(): string {
    const steps = this.getSteps();
    const currentIndex = steps.findIndex((step) => step.current);
    if (currentIndex === -1) return '0%';
    return `${(currentIndex / (steps.length - 1)) * 100}%`;
  }

  getSteps() {
    const baseSteps = [
      {
        label: 'Assigned',
        status: 'Assigned',
        completed: false,
        current: false,
      },
      { label: 'Picked', status: 'Picked', completed: false, current: false },
      {
        label: 'Dispatched',
        status: 'Dispatched',
        completed: false,
        current: false,
      },
    ];

    // if (this.loadData?.dropoffs > 0) {
    //   for (let i = 1; i <= this.loadData.dropoffs; i++) {
    //     baseSteps.push({
    //       label: `Delivery ${i}`,
    //       status: `Delivered${i}`,
    //       completed: false,
    //       current: false,
    //     });
    //   }
    // }
    
if (this.loadData?.dropoffs > 0) {
  for (let i = 1; i <= this.loadData.dropoffs; i++) {
    // For all deliveries except the last one
    if (i < this.loadData.dropoffs) {
      baseSteps.push({
        label: `Delivery ${i}`,
        status: `Delivered${i}`,
        completed: false,
        current: false,
      });
    } 
    // For the last delivery, add both Delivered and Delivery steps
    else {
      baseSteps.push({
        label: `Delivery ${i}`,
        status: `Delivered${i}`,
        completed: false,
        current: false,
      });
      baseSteps.push({
        label: 'Delivered',
        status: 'Delivered',
        completed: false,
        current: false,
      });
    }
  }
}

    baseSteps.push({
      label: 'Completed',
      status: 'Completed',
      completed: false,
      current: false,
    });

    const currentStatusIndex = this.getCurrentStatusIndex(baseSteps);
    return baseSteps.map((step, index) => ({
      ...step,
      completed: index < currentStatusIndex,
      current: index === currentStatusIndex,
    }));
  }

  getCurrentStatusIndex(steps: any[]): number {
    if (!this.loadData?.status) return 0;

    if (this.loadData.status.includes('-Partial')) {
      const baseStatus = this.loadData.status.split('-')[0];
      return steps.findIndex((step) => step.status === baseStatus);
    }

    return steps.findIndex((step) => step.status === this.loadData.status);
  }

  cancelShipment(id: string) {
    // Implement cancelShipment logic
  }

 

  updateStatus(id: string, status: string) {
    console.log('button clicked');

    if (this.user.role === 'driver') {
      this.DriverServices.updateLoadInfo(id, { id: status }).subscribe({
        next: (data: any) => {
          if (data.success) {
            this.toastr.success('Shipment updated successfully!', 'Success');
            this.dataService.sendData('Shipments');
          } else {
            this.toastr.error(data.message, 'Error');
          }
        },
        error: (err) => {
          console.error('Error updating shipment:', err);
          this.toastr.error(
            'Failed to update shipment. Please try again.',
            'Error'
          );
        },
      });
    }
    if (this.user.role === 'shipperAdmin') {
      this.ShipperServices.updateLoadInfo(id, { id: status }).subscribe({
        next: (data: any) => {
          if (data.success) {
            this.toastr.success('Shipment updated successfully!', 'Success');
            this.dataService.sendData('Shipments');
          } else {
            this.toastr.error(data.message, 'Error');
          }
        },
        error: (err) => {
          console.error('Error updating shipment:', err);
          this.toastr.error(
            'Failed to update shipment. Please try again.',
            'Error'
          );
        },
      });
    }
  }
  toggleExpand() {
    // Implement toggleExpand logic
  }
}
