"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["TEACHER"] = "TEACHER";
    Role["SECRETARY"] = "SECRETARY";
    Role["STUDENT"] = "STUDENT";
    Role["PARENT"] = "PARENT";
    Role["ASSOCIATION_MEMBER"] = "ASSOCIATION_MEMBER";
})(Role || (exports.Role = Role = {}));
class UserEntity {
    id;
    email;
    name;
    role;
    password;
    institutionId;
    profile;
    createdAt;
    updatedAt;
    constructor(id, email, name, role, password, institutionId, profile, createdAt, updatedAt) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.password = password;
        this.institutionId = institutionId;
        this.profile = profile;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.UserEntity = UserEntity;
//# sourceMappingURL=user.entity.js.map