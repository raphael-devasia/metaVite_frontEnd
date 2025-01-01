import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('this is  from the auth interceptor');

  let token = localStorage.getItem('invitationToken');
    if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(clonedReq);

    return next(clonedReq);
  } else {
    return next(req);
  }
};
