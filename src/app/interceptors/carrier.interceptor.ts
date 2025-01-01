import { HttpInterceptorFn } from '@angular/common/http';

export const carrierInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('This is from the interceptor');

  // Initialize token as null
  let token: string | null = null;

  // Check if the request URL starts with specific paths
  if (req.url.startsWith('http://localhost:4000/shipper')) {
    token = localStorage.getItem('shipperAdminToken');
  } else if (req.url.startsWith('http://localhost:4000/carrier/driver')) {
    token = localStorage.getItem('driverToken');
  } else if (req.url.startsWith('http://localhost:4000/carrier/')) {
    token = localStorage.getItem('carrierAdminToken');
  } else if (req.url.startsWith('http://localhost:4000/admin')) {
    token = localStorage.getItem('appAdminToken');
  }

  // Clone the request and add the Authorization header if a token exists
  const clonedReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  console.log(clonedReq);

  // Pass the cloned request to the next handler
  return next(clonedReq);
};
