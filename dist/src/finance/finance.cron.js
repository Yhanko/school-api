"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FinanceCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const user_entity_1 = require("../domain/entities/user.entity");
let FinanceCronService = FinanceCronService_1 = class FinanceCronService {
    prisma;
    logger = new common_1.Logger(FinanceCronService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleOverduePayments() {
        this.logger.log('🔍 Verificando pagamentos em atraso...');
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const overduePayments = await this.prisma.payment.findMany({
                where: {
                    status: 'pending',
                    createdAt: { lt: thirtyDaysAgo },
                },
                include: {
                    student: { select: { name: true, parentId: true, institutionId: true } },
                },
            });
            if (overduePayments.length === 0) {
                this.logger.log('✅ Nenhum pagamento em atraso encontrado.');
                return;
            }
            this.logger.log(`⚠️ ${overduePayments.length} pagamentos em atraso encontrados.`);
            for (const payment of overduePayments) {
                await this.prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: 'overdue' },
                });
                const institutionId = payment.institutionId;
                const studentName = payment.student?.name || 'um aluno';
                const typeLabel = payment.type === 'tuition' ? 'Propina'
                    : payment.type === 'enrollment' ? 'Matrícula' : 'Pagamento';
                const notificationsToCreate = [];
                if (payment.student?.parentId) {
                    notificationsToCreate.push({
                        userId: payment.student.parentId,
                        title: `🔴 ${typeLabel} em Atraso`,
                        description: `O pagamento de ${typeLabel} (${payment.amount} Kz) do educando ${studentName} está em atraso há mais de 30 dias. Por favor, regularize a situação.`,
                        institutionId,
                    });
                }
                const secretaries = await this.prisma.user.findMany({
                    where: { institutionId, role: user_entity_1.Role.SECRETARY },
                    select: { id: true },
                });
                for (const sec of secretaries) {
                    notificationsToCreate.push({
                        userId: sec.id,
                        title: `🔴 ${typeLabel} em Atraso — Ação Necessária`,
                        description: `O pagamento de ${typeLabel} (${payment.amount} Kz) do aluno ${studentName} está em atraso. Verifique e contacte o encarregado.`,
                        institutionId,
                    });
                }
                if (notificationsToCreate.length > 0) {
                    await this.prisma.notification.createMany({ data: notificationsToCreate });
                }
            }
            this.logger.log(`✅ ${overduePayments.length} pagamentos marcados como atrasados e notificações enviadas.`);
        }
        catch (error) {
            this.logger.error('❌ Erro ao verificar pagamentos em atraso', error);
        }
    }
    async handleWeeklyAttendanceReport() {
        this.logger.log('📊 Gerando relatório semanal de frequência...');
        try {
            const institutions = await this.prisma.institution.findMany({
                where: { status: 'active' },
                select: { id: true, name: true },
            });
            for (const institution of institutions) {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                const attendanceRecords = await this.prisma.attendance.findMany({
                    where: {
                        institutionId: institution.id,
                        date: { gte: oneWeekAgo },
                    },
                    include: {
                        student: { select: { name: true, id: true } },
                    },
                });
                if (attendanceRecords.length === 0)
                    continue;
                const byStudent = {};
                for (const rec of attendanceRecords) {
                    const sid = rec.studentId;
                    if (!byStudent[sid]) {
                        byStudent[sid] = { name: rec.student.name, present: 0, total: 0 };
                    }
                    byStudent[sid].total++;
                    if (rec.status === 'present' || rec.status === 'late') {
                        byStudent[sid].present++;
                    }
                }
                const criticalStudents = Object.entries(byStudent)
                    .filter(([, data]) => data.total >= 3 && (data.present / data.total) < 0.75)
                    .map(([id, data]) => ({ id, ...data, rate: Math.round((data.present / data.total) * 100) }));
                if (criticalStudents.length === 0)
                    continue;
                const admin = await this.prisma.user.findFirst({
                    where: { institutionId: institution.id, role: user_entity_1.Role.ADMIN },
                    select: { id: true },
                });
                if (admin) {
                    const studentList = criticalStudents.map(s => `${s.name} (${s.rate}%)`).join(', ');
                    await this.prisma.notification.create({
                        data: {
                            userId: admin.id,
                            title: '📊 Relatório Semanal de Frequência',
                            description: `${criticalStudents.length} aluno(s) com frequência abaixo de 75% esta semana: ${studentList}.`,
                            institutionId: institution.id,
                        },
                    });
                }
            }
            this.logger.log('✅ Relatório semanal de frequência enviado.');
        }
        catch (error) {
            this.logger.error('❌ Erro ao gerar relatório de frequência', error);
        }
    }
    async handleMonthlyAcademicRiskReport() {
        this.logger.log('🎓 Gerando relatório mensal de risco académico...');
        try {
            const institutions = await this.prisma.institution.findMany({
                where: { status: 'active' },
                select: { id: true },
            });
            for (const institution of institutions) {
                const allGrades = await this.prisma.grade.findMany({
                    where: { institutionId: institution.id },
                    include: {
                        student: { select: { name: true, parentId: true } },
                        subject: { select: { name: true } },
                    },
                });
                const studentSubjectMap = {};
                for (const g of allGrades) {
                    const sid = g.studentId;
                    const subj = g.subject?.name || 'Geral';
                    if (!studentSubjectMap[sid])
                        studentSubjectMap[sid] = {};
                    if (!studentSubjectMap[sid][subj])
                        studentSubjectMap[sid][subj] = [];
                    studentSubjectMap[sid][subj].push(g.value);
                }
                for (const [studentId, subjects] of Object.entries(studentSubjectMap)) {
                    const weakSubjects = Object.entries(subjects)
                        .map(([subj, vals]) => ({ subj, avg: vals.reduce((a, b) => a + b, 0) / vals.length }))
                        .filter(x => x.avg < 10);
                    if (weakSubjects.length === 0)
                        continue;
                    const student = allGrades.find(g => g.studentId === studentId)?.student;
                    if (!student?.parentId)
                        continue;
                    const subjList = weakSubjects.map(x => `${x.subj} (${x.avg.toFixed(1)} val.)`).join(', ');
                    await this.prisma.notification.create({
                        data: {
                            userId: student.parentId,
                            title: '🎓 Relatório Mensal — Risco Académico',
                            description: `O seu educando ${student.name} tem médias abaixo do mínimo nas seguintes disciplinas: ${subjList}. Recomendamos reforço escolar.`,
                            institutionId: institution.id,
                        },
                    });
                }
            }
            this.logger.log('✅ Relatório mensal de risco académico enviado.');
        }
        catch (error) {
            this.logger.error('❌ Erro no relatório mensal académico', error);
        }
    }
};
exports.FinanceCronService = FinanceCronService;
__decorate([
    (0, schedule_1.Cron)('0 8 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FinanceCronService.prototype, "handleOverduePayments", null);
__decorate([
    (0, schedule_1.Cron)('0 7 * * 1'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FinanceCronService.prototype, "handleWeeklyAttendanceReport", null);
__decorate([
    (0, schedule_1.Cron)('0 6 1 * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FinanceCronService.prototype, "handleMonthlyAcademicRiskReport", null);
exports.FinanceCronService = FinanceCronService = FinanceCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceCronService);
//# sourceMappingURL=finance.cron.js.map