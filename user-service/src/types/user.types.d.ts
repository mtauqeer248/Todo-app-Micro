export interface User {
    uuid: string;
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}
export interface CreateUserRequest {
    email: string;
    password: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface JWTPayload {
    uuid: string;
    email: string;
}
//# sourceMappingURL=user.types.d.ts.map