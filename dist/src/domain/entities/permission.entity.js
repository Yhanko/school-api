"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionEntity = void 0;
class PermissionEntity {
    id;
    userId;
    dashboard;
    students;
    teachers;
    classes;
    financial;
    activities;
    payments;
    attendance;
    discipline;
    permissions;
    createdAt;
    updatedAt;
    constructor(id, userId, dashboard, students, teachers, classes, financial, activities, payments, attendance, discipline, permissions, createdAt, updatedAt) {
        this.id = id;
        this.userId = userId;
        this.dashboard = dashboard;
        this.students = students;
        this.teachers = teachers;
        this.classes = classes;
        this.financial = financial;
        this.activities = activities;
        this.payments = payments;
        this.attendance = attendance;
        this.discipline = discipline;
        this.permissions = permissions;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.PermissionEntity = PermissionEntity;
//# sourceMappingURL=permission.entity.js.map