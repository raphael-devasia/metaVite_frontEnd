// import { inject, Injectable } from '@angular/core';
// import { ShipperService } from './shipper/shipper.service';
// declare var Razorpay: any; 

// @Injectable({
//   providedIn: 'root',
// })
// export class RazorpayService {
//   ShipperServices = inject(ShipperService);
//   constructor() {}

//   loadRazorpayScript() {
//     return new Promise<void>((resolve, reject) => {
//       if (typeof Razorpay !== 'undefined') {
//         resolve();
//         return;
//       }

//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve();
//       script.onerror = (err) => reject('Failed to load Razorpay script');
//       document.head.appendChild(script);
//     });
//   }

//   async openPaymentModal(orderData: any): Promise<boolean> {
//     console.log(orderData);

//     try {
//       await this.loadRazorpayScript(); // Load the Razorpay script dynamically
//       const options = {
//         key: 'rzp_test_rPRBTE14c1zUpK', // Your Razorpay API key
//         amount: orderData.amount, // Amount in paise (orderData.amount is already in paise)
//         currency: 'INR',
//         order_id: orderData.receipt, // Use the order_id from the backend
//         handler: (response: any): Promise<boolean> => {
//           console.log('Payment Successful', response); // Log the payment response

//           // Prepare the data for payment verification
//           const paymentData = {
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_signature: response.razorpay_signature,
//             loadId: orderData.loadId,
//           };

//           // Return a Promise to resolve only after payment verification
//           return new Promise<boolean>((resolve, reject) => {
//             // Call backend to verify payment
//             this.ShipperServices.verifyPayment(paymentData).subscribe(
//               (verifyResponse) => {
//                 if (verifyResponse.success) {
//                   alert('Payment Successful!');
//                   resolve(true); // Resolve with true for success
//                 } else {
//                   alert('Payment Verification Failed!');
//                   resolve(false); // Resolve with false for failure
//                 }
//               },
//               (error) => {
//                 console.error('Error verifying payment:', error);
//                 resolve(false); // Resolve with false on error
//               }
//             );
//           });
//         },
//         prefill: {
//           name: 'John Doe',
//           email: 'john.doe@example.com',
//           contact: '9999999999',
//         },
//         theme: {
//           color: '#F37254',
//         },
//       };

//       const razorpayInstance = new Razorpay(options);
//       razorpayInstance.open();
//       razorpayInstance.on('payment.failed', (response: any) => {
//         // Handle failed payment
//         console.error('Payment Failed:', response);
//         alert('Payment Failed. Please try again.');
//         return Promise.resolve(false); // Return false if payment fails
//       });
//     } catch (error) {
//       console.error('Error loading Razorpay script:', error);
//       return Promise.resolve(false); // Return false on script loading error
//     }

//     return Promise.resolve(false); // Fallback return if payment handling fails
//   }
// }



import { inject, Injectable } from '@angular/core';
import { ShipperService } from './shipper/shipper.service';
import { firstValueFrom } from 'rxjs';

declare var Razorpay: any;

@Injectable({
  providedIn: 'root',
})
export class RazorpayService {
  ShipperServices = inject(ShipperService);

  constructor() {}

  loadRazorpayScript() {
    return new Promise<void>((resolve, reject) => {
      if (typeof Razorpay !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject('Failed to load Razorpay script');
      document.head.appendChild(script);
    });
  }

  async openPaymentModal(orderData: any): Promise<boolean> {
    console.log('Opening payment modal with order data:', orderData);

    try {
      await this.loadRazorpayScript();

      return new Promise<boolean>((resolve, reject) => {
        const options = {
          key: 'rzp_test_rPRBTE14c1zUpK',
          amount: orderData.amount,
          currency: 'INR',
          order_id: orderData.receipt,
          handler: async (response: any) => {
            console.log('Payment response received:', response);

            try {
              const paymentData = {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                loadId: orderData.loadId,
              };

              // Using firstValueFrom to convert Observable to Promise
              const verificationResult = await firstValueFrom(
                this.ShipperServices.verifyPayment(paymentData)
              );

              console.log('Payment verification result:', verificationResult);

              if (verificationResult.success) {
                alert('Payment Successful!');
                resolve(true);
              } else {
                alert('Payment Verification Failed!');
                resolve(false);
              }
            } catch (error) {
              console.error('Error during payment verification:', error);
              resolve(false);
            }
          },
          prefill: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            contact: '9999999999',
          },
          theme: {
            color: '#F37254',
          },
          modal: {
            ondismiss: () => {
              console.log('Payment modal dismissed');
              resolve(false);
            },
          },
        };

        const razorpayInstance = new Razorpay(options);

        razorpayInstance.on('payment.failed', (response: any) => {
          console.error('Payment Failed:', response);
          alert('Payment Failed. Please try again.');
          resolve(false);
        });

        razorpayInstance.open();
      });
    } catch (error) {
      console.error('Error in payment process:', error);
      return false;
    }
  }
}