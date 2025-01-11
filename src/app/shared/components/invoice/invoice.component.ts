import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent {
  @ViewChild('invoiceContent') invoiceContent!: ElementRef;
  currentDate = new Date().toLocaleDateString();
  constructor(
    public dialogRef: MatDialogRef<InvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public invoiceData: any
   
    
  ) {}
  

  async downloadPDF() {
    // Show loading state
    const loadingElement = document.createElement('div');
    loadingElement.className =
      'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50';
    loadingElement.innerHTML =
      '<div class="text-white text-xl">Generating PDF...</div>';
    document.body.appendChild(loadingElement);

    try {
      // Get the invoice element
      const invoice = this.invoiceContent.nativeElement;

      // Create canvas from the invoice element
      const canvas = await html2canvas(invoice, {
        logging: false,
        useCORS: true,
      });

      // Canvas dimensions
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add new pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename
      const fileName = `Invoice_${this.invoiceData.receipt}_${
        new Date().toISOString().split('T')[0]
      }.pdf`;

      // Save the PDF
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      // Remove loading element
      document.body.removeChild(loadingElement);
    }
  }
}
