// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const cloned = req.clone({
        withCredentials: true, // crucial for sending cookies
    });
    return next(cloned);
};