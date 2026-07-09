import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export enum LogAction {
  USER_LOGIN = 'USER_LOGIN',
  CREATE_STUDENT = 'CREATE_STUDENT',
  CREATE_EMPLOYEE = 'CREATE_EMPLOYEE',
  CREATE_PARENT = 'CREATE_PARENT',
  CREATE_CLASS = 'CREATE_CLASS',
  CREATE_SUBJECT = 'CREATE_SUBJECT',
  CREATE_ROOM = 'CREATE_ROOM',
  UPDATE_USER = 'UPDATE_USER',
  UPDATE_CLASS = 'UPDATE_CLASS',
  UPDATE_SUBJECT = 'UPDATE_SUBJECT',
  UPDATE_ROOM = 'UPDATE_ROOM',
  DELETE_USER = 'DELETE_USER',
  DELETE_CLASS = 'DELETE_CLASS',
  CREATE_ACADEMIC_YEAR = 'CREATE_ACADEMIC_YEAR',
  UPDATE_ACADEMIC_YEAR = 'UPDATE_ACADEMIC_YEAR',
}

@Injectable()
export class ActivityLoggerService {
  constructor(private prisma: PrismaService) {}

  async logAction(
    action: LogAction | string,
    resource: string,
    details: string,
    userId?: string,
    institutionId?: string,
    ipAddress?: string
  ): Promise<void> {
    try {
      await this.prisma.activityLog.create({
        data: {
          action,
          resource,
          details,
          userId,
          institutionId,
          ipAddress,
        },
      });
    } catch (error) {
      // We don't want logging to break the main application flow
      console.error('Failed to write activity log:', error);
    }
  }
}
