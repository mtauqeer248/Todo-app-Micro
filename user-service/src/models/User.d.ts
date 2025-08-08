import { User, CreateUserRequest } from '../types/user.types';
export declare class UserModel {
    static findByEmail(email: string): Promise<User | null>;
    static create(userData: CreateUserRequest & {
        password_hash: string;
    }): Promise<User>;
    static findByUuid(uuid: string): Promise<User | null>;
}
//# sourceMappingURL=User.d.ts.map