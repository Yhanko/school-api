export declare enum Role {
    ADMIN = "ADMIN",
    TEACHER = "TEACHER",
    STUDENT = "STUDENT",
    PARENT = "PARENT"
}
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role?: Role;
}
