import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivityLoggerService } from '../../application/services/activity-logger.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly activityLogger: ActivityLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, originalUrl, body, user, ip } = req;

    // We only want to log modifying requests
    const isModifyingRequest = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
    
    if (!isModifyingRequest) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        // Sanitize body (remove passwords)
        const sanitizedBody = { ...body };
        if (sanitizedBody.password) sanitizedBody.password = '***';
        if (sanitizedBody.newPassword) sanitizedBody.newPassword = '***';
        if (sanitizedBody.oldPassword) sanitizedBody.oldPassword = '***';

        const actionName = `${method} ${originalUrl}`;
        const details = `Payload: ${JSON.stringify(sanitizedBody)}`;

        // Avoid logging login/password reset here if they are already logged in UseCases, 
        // but it's safe as a fallback.
        this.activityLogger.logAction(
          actionName,
          originalUrl,
          details,
          user?.id, // undefined if not logged in
          user?.institutionId,
          ip
        ).catch(err => console.error('AuditInterceptor Error:', err));
      }),
    );
  }
}
