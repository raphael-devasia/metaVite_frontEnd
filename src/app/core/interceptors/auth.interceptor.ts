import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Auth Interceptor triggered');

  let baseUrl =
    'https://ac385a1c747ba4795a44cab8e15e55d4-563323433.eu-north-1.elb.amazonaws.com/';

  // Check if the request URL matches the specific endpoint
  // if (req.url.startsWith('http://localhost:4000/auth/register')) {
  if (req.url.startsWith(`${baseUrl}auth/register`)) {
    const token = localStorage.getItem('invitationToken'); // Fetch the token from localStorage
    if (token) {
      // Clone the request and add the Authorization header
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Cloned Request with Authorization Header:', clonedReq);

      // Forward the cloned request
      return next(clonedReq);
    }
  }

  // Forward the original request if no token is found or URL doesn't match
  return next(req);
};
