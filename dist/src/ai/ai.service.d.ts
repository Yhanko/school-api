import { PrismaService } from '../prisma/prisma.service';
export declare class AiService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    generateStudentAnalysis(studentId: string, classId: string, institutionId: string): Promise<{
        studentName: string;
        status: string;
        summary: string;
        strengths: string[];
        weaknesses: string[];
        recommendations: string[];
        chartData: {
            subject: string;
            score: number;
        }[];
    }>;
    chatWithAi(question: string, studentId: string, institutionId: string): Promise<{
        resposta: string;
        categoria: string;
    }>;
    getSuggestions(): {
        texto: string;
        categoria: string;
    }[];
    getResources(): {
        titulo: string;
        descricao: string;
        icon: string;
        categoria: string;
    }[];
}
