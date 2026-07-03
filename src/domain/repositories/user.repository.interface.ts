import { UserEntity } from '../entities/user.entity';

export const IUserRepository = Symbol('IUserRepository');

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  findByInstitution(institutionId: string): Promise<UserEntity[]>;
  create(user: UserEntity): Promise<UserEntity>;
  update(id: string, data: Partial<UserEntity>): Promise<UserEntity>;
}

