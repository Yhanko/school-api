export declare enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    TEACHER = "TEACHER",
    STUDENT = "STUDENT",
    PARENT = "PARENT",
    SECRETARY = "SECRETARY"
}
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role?: Role;
}
